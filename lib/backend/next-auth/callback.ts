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

}