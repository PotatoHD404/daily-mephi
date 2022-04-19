import {OAuthConfig, OAuthUserConfig} from "next-auth/providers";
import {TokenSet} from "next-auth";
import {Awaitable} from "next-auth";

export interface Profile {
    id: string
}


// export interface TokenSetParameters {
//     access_token?: string;
//     token_type?: string;
//     id_token?: string;
//     refresh_token?: string;
//     scope?: string;
//
//     expires_at?: number;
//     session_state?: string;
//
//     [key: string]: unknown;
// }

export default function HomeOauth<P extends Record<string, any> = Profile>(): OAuthConfig<P> {
    return {
        id: "home",
        name: "Home MEPHi",
        type: "oauth",
        // wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
        authorization: {
            url: "https://login.mephi.ru/login",
            params: {service: "http://localhost:3000/api/auth/callback/home"} // TODO: add host check
        },
        // idToken: true,
        // checks: ["pkce", "state"],
        token: {
            url: "https://login.mephi.ru/validate",
            async request(context) {
                // context contains useful properties to help you make the request.
                // const tokens = await makeTokenRequest(context)
                console.log(context);
                return {tokens: {access_token: 'token'}}
            }
        }
    }
}
