import logger, {setLogger} from "next-auth/lib/logger"
import * as routes from "next-auth/core/routes"
import renderPage from "next-auth/core/pages"
import {init} from "next-auth/core/init"
import {assertConfig} from "next-auth/core/lib/assert"
import {SessionStore} from "next-auth/core/lib/cookie"

import type {NextAuthOptions} from "next-auth/core/types"
import type {NextAuthAction} from "next-auth/lib/types"
import type {Cookie} from "next-auth/core/lib/cookie"
import type {ErrorType} from "next-auth/core/pages/error"
import FirebaseAdapter from "./firebase-adapter";
import {detectHost} from "next-auth/next/utils";
import {NextApiRequest} from "next";
import {Account, Profile} from "next-auth";
import oAuthCallback from "next-auth/core/lib/oauth/callback";
import callbackHandler from "next-auth/core/lib/callback-handler";


export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        // CredentialsProvider({
        //     // The name to display on the sign in form (e.g. "Sign in with...")
        //     name: "Credentials",
        //     // The credentials is used to generate a suitable form on the sign in page.
        //     // You can specify whatever fields you are expecting to be submitted.
        //     // e.g. domain, username, password, 2FA token, etc.
        //     // You can pass any HTML attribute to the <input> tag through the object.
        //     credentials: {
        //         token: { label: "token", type: "text" },
        //     },
        //     async authorize(credentials, req) {
        //         // Add logic here to look up the user from the credentials supplied
        //         const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
        //
        //         if (user) {
        //             // Any object returned will be saved in `user` property of the JWT
        //             return user
        //         } else {
        //             // If you return null then an error will be displayed advising the user to check their details.
        //             return null
        //
        //             // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //         }
        //     }
        // })
    ],
    // session: { strategy: "jwt" },
    // jwt: {
    //     // A secret to use for key generation. Defaults to the top-level `secret`.
    //     secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    //     // The maximum age of the NextAuth.js issued JWT in seconds.
    //     // Defaults to `session.maxAge`.
    //     maxAge: 60 * 60 * 24 * 30,
    //     // You can define your own encode/decode functions for signing and encryption
    //     // if you want to override the default behavior.
    //     // async encode({ secret, token, maxAge }) {},
    //     // async decode({ secret, token }) {},
    // },
    adapter: FirebaseAdapter()

};

export interface IncomingRequest {
    /** @default "http://localhost:3000" */
    host?: string
    method?: string
    cookies?: Record<string, string>
    headers?: Record<string, any>
    query?: Record<string, any>
    body?: Record<string, any>
    action: NextAuthAction
    providerId?: string
    error?: string
}

export interface NextAuthHeader {
    key: string
    value: string
}

export interface OutgoingResponse<Body extends string | Record<string, any> | any[] = any> {
    status?: number
    headers?: NextAuthHeader[]
    body?: Body
    redirect?: string
    cookies?: Cookie[]
}

export interface NextAuthHandlerParams {
    req: IncomingRequest
    options: NextAuthOptions
}

export async function NextAuthHandler<Body extends string | Record<string, any> | any[]>(req: NextApiRequest): Promise<OutgoingResponse<Body>> {
    // const {options: userOptions, req} = params
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

    const assertionResult = assertConfig({req: request, options: userOptions})

    if (typeof assertionResult === "string") {
        logger.warn(assertionResult)
    } else if (assertionResult instanceof Error) {
        // Bail out early if there's an error in the user config
        const {pages, theme} = userOptions
        logger.error(assertionResult.code, assertionResult)
        if (pages?.error) {
            return {
                redirect: `${pages.error}?error=Configuration`,
            }
        }
        const render = renderPage({theme})
        return render.error({error: "configuration"})
    }

    const {action, providerId, error, method = "GET"} = request

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
    // cookies.push(...(request.cookies)


    const sessionStore = new SessionStore(
        options.cookies.sessionToken,
        request,
        options.logger
    )


    // const callback = await routes.callback({
    //     body: request.body,
    //     query: request.query,
    //     headers: request.headers,
    //     cookies: request.cookies,
    //     method,
    //     options,
    //     sessionStore,
    // })

    const body = request.body;
    const headers = request.headers;
    const {
        provider,
        adapter,
        url,
        callbackUrl,
        pages,
        jwt,
        events,
        callbacks,
        session: {strategy: sessionStrategy, maxAge: sessionMaxAge},
    } = options;


    try {
        const {
            profile: profile,
            account: account,
            OAuthProfile: OAuthProfile,
            cookies: oauthCookies,
        }: {
            profile: any,
            account: Omit<Account, "userId"> | null,
            OAuthProfile: Profile,
            cookies?: OutgoingResponse["cookies"]
        } = await oAuthCallback({
            query,
            body,
            method,
            options,
            cookies: request.cookies,
        });

        if (!account) {
            // logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error as Error)
            return {redirect: `${url}/signin`, cookies};
        }

        if (oauthCookies) cookies.push(...oauthCookies);

        try {
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
                return {redirect: `${url}/signin`, cookies};
            }

            // Check if user is allowed to sign in
            // Attempt to get Profile from OAuth provider details before invoking
            // signIn callback - but if no user object is returned, that is fine
            // (that just means it's a new user signing in for the first time).
            let userOrProfile = profile;
            if (adapter) {
                const {getUserByAccount} = adapter;
                const userByAccount = await getUserByAccount({

                    providerAccountId: (account as Account).providerAccountId,
                    provider: provider.id,
                })

                if (userByAccount) userOrProfile = userByAccount;
            }
            // const acc: Account = {
            //     providerAccountId: '',
            //     /** id of the user this account belongs to. */
            //     userId: '',
            //     /** id of the provider used for this account */
            //     provider: account.provider,
            //     /** Provider's type for this account */
            //     type: 'oauth'
            // }
            try {
                const isAllowed = await callbacks.signIn({
                    user: userOrProfile,
                    account: (account as Account),
                    profile: OAuthProfile,
                    email: {}
                });
                if (!isAllowed) {
                    return {redirect: `${url}/error?error=AccessDenied`, cookies};
                } else if (typeof isAllowed === "string") {
                    return {redirect: isAllowed, cookies};
                }
            } catch (error) {
                return {
                    redirect: `${url}/error?error=${encodeURIComponent(
                        (error as Error).message
                    )}`,
                    cookies,
                };
            }
            // Sign user in

            const res = await callbackHandler({
                sessionToken: sessionStore.value,
                profile: profile,
                account: (account as Account),
                options: options,
            });
            if (!res) {
                return {redirect: `${url}/signin`, cookies};
            }
            const {user, session, isNewUser} = res;

            if (!session ||
                !("sessionToken" in session) ||
                session?.sessionToken ||
                typeof session?.sessionToken !== "string") {
                return {redirect: `${url}/signin`, cookies};
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
                account: (account as Account),
                profile: profile,
                isNewUser: isNewUser
            });

            // Handle first logins on new accounts
            // e.g. option to send users to a new account landing page on initial login
            // Note that the callback URL is preserved, so the journey can still be resumed
            if (isNewUser && pages.newUser) {
                return {
                    redirect: `${pages.newUser}${
                        pages.newUser.includes("?") ? "&" : "?"
                    }callbackUrl=${encodeURIComponent(callbackUrl)}`,
                    cookies,
                }
            }

            // Callback URL is already verified at this point, so safe to use if specified
            return {redirect: callbackUrl, cookies}
        } catch (error) {
            if ((error as Error).name === "AccountNotLinkedError") {
                // If the email on the account is already linked, but not with this OAuth account
                return {
                    redirect: `${url}/error?error=OAuthAccountNotLinked`,
                    cookies,
                }
            } else if ((error as Error).name === "CreateUserError") {
                return {redirect: `${url}/error?error=OAuthCreateAccount`, cookies}
            }
            logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error as Error)
            return {redirect: `${url}/error?error=Callback`, cookies}
        }
    } catch (error) {
        if ((error as Error).name === "OAuthCallbackError") {
            logger.error("CALLBACK_OAUTH_ERROR", error as Error)
            return {redirect: `${url}/error?error=OAuthCallback`, cookies}
        }
        logger.error("OAUTH_CALLBACK_ERROR", error as Error)
        return {redirect: `${url}/error?error=Callback`, cookies}
    }

    //
    // if (callback.cookies) cookies.push(...callback.cookies)
    // return {...callback, cookies}


    // return {
    //     status: 500,
    //     body: `Error: Action ${action} with HTTP ${method} is not supported by NextAuth.js` as any,
    // }
}