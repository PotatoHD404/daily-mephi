import {OAuthConfig} from "next-auth/providers";
import {getHost} from "helpers/utils";
import {hash} from "helpers/crypto";

export interface Profile {
    id: string
}

const host = getHost() + "/api/auth/callback/home";

// It's a little dirty code, but it's working! It's converting CAS auth to OAuth formatting

export default function HomeOauth<P extends Record<string, any> = Profile>(): OAuthConfig<P> {
    return {
        id: "home",
        name: "Home MEPHi",
        type: "oauth",
        authorization: {
            url: "https://login.mephi.ru/login",
            params: {service: host} // TODO: add host check
        },
        token: {
            url: "http://localhost:3000/api/debug",
            async request({params}) {
                if (!params.code)
                    throw new Error("There is no cas ticket");
                const query = new URLSearchParams({service: host, ticket: params.code});
                const response = await fetch('https://login.mephi.ru/validate?' + query)
                const respString = await response.text();
                // const respString = 'yes\n1\n';
                const resArr: string[] = respString.split('\n');
                if (resArr[0] !== 'yes' || !resArr[1])
                    throw new Error("Something went wrong during cas login");
                const access_token: string = await hash(resArr[1]);

                return {tokens: {access_token}}
            }
        },
        userinfo: {
            url: "https://example.com/oauth/userinfo",
            async request({tokens: {access_token}}) {
                if (!access_token)
                    throw new Error("Something went wrong during getting user info");
                return {id: access_token}
            }
        },
        profile(profile) {
            console.log(profile)
            return {
                id: profile.id,
                name: null,
                image: null
            };
        },
        clientId: '1'
    }
}
