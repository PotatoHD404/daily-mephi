// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import https from 'https'
import * as util from "util";
import {doRequest, redirect} from '../../lib/backend/utils';
import {decrypt, hash} from '../../lib/backend/crypto';
import admin from "firebase-admin";
import fs from 'fs';
import {detectHost} from "../../lib/backend/utils";
import {NextAuthOptions} from "next-auth/core/types";
import logger, {setLogger} from "../../lib/backend/next-auth/lib/logger";  //
import {assertConfig} from "../../lib/backend/next-auth/core/lib/assert"; //
import {init} from "../../lib/backend/next-auth/core/init"; //
import {SessionStore} from "../../lib/backend/next-auth/core/lib/cookie"; //
import {Account, Profile} from "next-auth";
import callbackHandler from "../../lib/backend/next-auth/core/lib/callback-handler"; //
import {nextAuthOptions} from "../../lib/backend/options";
import {NextAuthAction} from "../../lib/backend/next-auth/lib/types";

// TODO: https://github.com/nextauthjs/next-auth/blob/main/src/core/lib/callback-handler.ts
// https://github.com/nextauthjs/next-auth/blob/main/src/core/routes/callback.ts
// https://github.com/nextauthjs/next-auth/blob/main/src/core/lib/oauth/callback.ts
// https://github.com/nextauthjs/next-auth/blob/main/src/core/index.ts
// routes.callback
// https://login.mephi.ru/login?service=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcas
type Data = {
    res: string | null | undefined
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {ticket}: { [key: string]: string | string[]; } = req.query;
    if (ticket === undefined) {
        res.status(500).json({res: 'There is no ticket'});
        return;
    }
    const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
    const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
    const response: string | Error = await doRequest({
        hostname: 'login.mephi.ru',
        port: 443,
        path: `/validate?service=${host}&ticket=${ticket}`,
        method: 'GET',
    });
    if (util.types.isNativeError(response)) {
        res.status(500).json({res: response.message})
        return;
    }
    const resArr: string[] = response.split('\n');
    if (resArr.length != 3) {
        res.status(500).json({res: 'There is an error 1: ' + response});
        return;
    }

    if (resArr[0] === 'yes') {
        const providerAccountId: string = await hash(resArr[1]);
        if (admin.credential === undefined) {
            const credentials: string = fs.readFileSync('firebaseCredentialsEncrypted.b64', 'binary')
            admin.initializeApp({
                credential: admin.credential.cert(await decrypt(credentials)),
                databaseURL: "https://daily-mephi-default-rtdb.firebaseio.com"
            });
        }
        const {nextauth, ...query} = req.query;
        const request = {
            host: detectHost(req.headers["x-forwarded-host"]),
            body: req.body,
            query: query,
            cookies: req.cookies,
            headers: req.headers,
            method: req.method,
            action: nextauth?.[0] as NextAuthAction,
            providerId: nextauth?.[1],
            error: (req.query.error as string | undefined) ?? nextauth?.[1],
        };
        const userOptions: NextAuthOptions = nextAuthOptions;

        setLogger(userOptions.logger, userOptions.debug)

        // const assertionResult = assertConfig({req: request, options: userOptions})
        //
        // if (typeof assertionResult === "string") {
        //     logger.warn(assertionResult)
        // } else if (assertionResult instanceof Error) {
        //     // Bail out early if there's an error in the user config
        //     const {pages} = userOptions
        //     logger.error(assertionResult.code, assertionResult)
        //     if (pages?.error) {
        //         redirect(res, `${pages.error}?error=Configuration`);
        //         return;
        //     }
        //     res.status(500).json({res: "error configuration"});
        //     return;
        // }

        const {action} = request
        const providerId = nextAuthOptions.providers[0].id;
        const {options, cookies} = await init({
            userOptions,
            action,
            providerId,
            host: request.host,
            callbackUrl: request.body?.callbackUrl ?? request.query?.callbackUrl,
            csrfToken: request.body?.csrfToken,
            cookies: request.cookies,
            isPost: false,
        })


        const sessionStore = new SessionStore(
            options.cookies.sessionToken,
            request,
            options.logger
        )


        const {
            provider,
            adapter,
            url,
            callbackUrl,
            pages,
            events,
            callbacks,
        } = options;
        console.log(provider);
        // try {
        const {
            profile: profile,
            account: acc,
            OAuthProfile: OAuthProfile,
        }: {
            profile: any
            account: Omit<Account, "userId"> | null
            OAuthProfile: Profile
        } = {
            profile: {id: providerAccountId},
            account: {
                provider: provider.id, type: provider.type,
                providerAccountId: providerAccountId
            },
            OAuthProfile: {id: providerAccountId}
        }


        const account = acc as Account;
        if (!account) {

            redirect(res, `${url}/signin`);
            return;
        }

        // try {
        // Make it easier to debug when adding a new provider
        logger.debug("OAUTH_CALLBACK_RESPONSE", {
            profile,
            account,
            OAuthProfile,
        });

        // If we don't have a profile object then either something went wrong
        // or the user cancelled signing in. We don't know which, so we just
        // direct the user to the signin page for now. We could do something
        // else in future.
        //
        // Note: In oAuthCallback an error is logged with debug info, so it
        // should at least be visible to developers what happened if it is an
        // error with the provider.
        if (!profile) {
            redirect(res, `${url}/signin`, cookies);
            return;
        }

        // Check if user is allowed to sign in
        // Attempt to get Profile from OAuth provider details before invoking
        // signIn callback - but if no user object is returned, that is fine
        // (that just means it's a new user signing in for the first time).
        let userOrProfile = profile;
        if (adapter) {
            const {getUserByAccount} = adapter;
            const userByAccount = await getUserByAccount({

                providerAccountId: account.providerAccountId,
                provider: provider.id,
            })

            if (userByAccount) userOrProfile = userByAccount;
        }

        try {
            const isAllowed = await callbacks.signIn({
                user: userOrProfile,
                account: account,
                profile: OAuthProfile,
                email: {}
            });
            if (!isAllowed) {
                redirect(res, `${url}/error?error=AccessDenied`, cookies);
                return;
            } else if (typeof isAllowed === "string") {
                redirect(res, isAllowed, cookies);
                return;
            }
        } catch (error) {

            redirect(res, `${url}/error?error=${encodeURIComponent(
                (error as Error).message
            )}`, cookies);

            return;
        }
        // Sign user in

        const result = await callbackHandler({
            sessionToken: sessionStore.value,
            profile: profile,
            account: account,
            options: options,
        });
        if (!result) {
            redirect(res, `${url}/signin`, cookies);
            return;
        }
        const {user, session, isNewUser} = result;

        if (!session ||
            !("sessionToken" in session) ||
            session?.sessionToken ||
            typeof session?.sessionToken !== "string") {
            redirect(res, `${url}/signin`, cookies);

            return;
        }
        // Save Session Token in cookie
        cookies.push({
            name: options.cookies.sessionToken.name,
            value: session.sessionToken,
            options: {
                ...options.cookies.sessionToken.options,
                expires: session.expires,
            },
        })
        await events.signIn?.({
            user: user,
            account: account,
            profile: null,
            isNewUser: isNewUser
        });

        // Handle first logins on new accounts
        // e.g. option to send users to a new account landing page on initial login
        // Note that the callback URL is preserved, so the journey can still be resumed
        if (isNewUser && pages.newUser) {
            redirect(res, `${pages.newUser}${
                pages.newUser.includes("?") ? "&" : "?"
            }callbackUrl=${encodeURIComponent(callbackUrl)}`, cookies);
            return;
        }

        // Callback URL is already verified at this point, so safe to use if specified
        redirect(res, callbackUrl, cookies);
        return;
        //     } catch (error) {
        //         if ((error as Error).name === "AccountNotLinkedError") {
        //             // If the email on the account is already linked, but not with this OAuth account
        //             redirect(res, `${url}/error?error=OAuthAccountNotLinked`, cookies);
        //             return;
        //         } else if ((error as Error).name === "CreateUserError") {
        //             redirect(res, `${url}/error?error=OAuthCreateAccount`, cookies);
        //
        //             return;
        //         }
        //         logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error as Error)
        //         redirect(res, `${url}/error?error=Callback`, cookies);
        //
        //         return;
        //     }
        // } catch (error) {
        //     if ((error as Error).name === "OAuthCallbackError") {
        //         logger.error("CALLBACK_OAUTH_ERROR", error as Error);
        //         redirect(res, `${url}/error?error=OAuthCallback`, cookies);
        //
        //         return;
        //     }
        //     logger.error("OAUTH_CALLBACK_ERROR", error as Error)
        //     redirect(res, `${url}/error?error=Callback`, cookies);
        //
        //     return;
        // }
        // https://github.com/nextauthjs/next-auth/blob/main/src/core/routes/callback.ts


    } else if (resArr[0] === 'no') {
        redirect(res, '/api/cas?error=true');
        return;
    } else {
        res.status(500).json({res: 'There is an error 2: ' + response});
    }
}

