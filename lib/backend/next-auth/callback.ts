import oAuthCallback from "next-auth/core/lib/oauth/callback"
import callbackHandler from "next-auth/core/lib/callback-handler"
import {hashToken} from "next-auth/core/lib/utils"

import type {InternalOptions} from "./types"
import type {IncomingRequest, OutgoingResponse} from "next-auth/core"
import type {Cookie, SessionStore} from "next-auth/core/lib/cookie"
// import type { User } from "../.."
import type {Account, Profile, User} from "next-auth"
import {CredentialInput, OAuthConfig, ProviderType} from "next-auth/providers";
// TODO: https://github.com/nextauthjs/next-auth/blob/main/src/core/lib/callback-handler.ts
// https://github.com/nextauthjs/next-auth/blob/main/src/core/routes/callback.ts
// https://github.com/nextauthjs/next-auth/blob/main/src/core/lib/oauth/callback.ts
// https://github.com/nextauthjs/next-auth/blob/main/src/core/index.ts
// routes.callback
/** Handle callbacks from login services */
export default async function callback(params: {
    options: InternalOptions<"oauth" | "credentials" | "email">
    query: IncomingRequest["query"]
    method: Required<IncomingRequest>["method"]
    body: IncomingRequest["body"]
    headers: IncomingRequest["headers"]
    cookies: IncomingRequest["cookies"]
    sessionStore: SessionStore
}): Promise<OutgoingResponse> {
    const {options, query, body, method, headers, sessionStore} = params;
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
        logger,
    } = options;

    const cookies: Cookie[] = [];

    if (provider.type === "oauth") {
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
                cookies: params.cookies,
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
    }
    return {
        status: 500,
        body: `Error: Callback for provider type ${provider.type} not supported`,
        cookies,
    }
}