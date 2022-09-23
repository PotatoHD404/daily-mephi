import {OAuthConfig} from "next-auth/providers";
import {getHost} from "helpers/utils";
import {hash} from "helpers/crypto";
import prisma from "../database/prisma";
import avatars from "../database/jsons/avatars.json";

export interface Profile {
    id: string
}

let host = getHost() + "/api/auth/callback/home";

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
                return {
                    tokens: {
                        access_token,
                        id_token: !resArr[1].match(/^[a-z]{3}[0-9]{3}$/) ? "tutor" : "default"
                    }
                };
            }
        },
        userinfo: {
            url: "https://example.com/oauth/userinfo",
            // @ts-ignore
            async request({tokens: {access_token, id_token}}) {
                if (!access_token)
                    throw new Error("Something went wrong during getting user info");
                return {id: access_token, role: id_token}
            }
        },
        async profile(profile) {
            const addedAvatars = await prisma.user.findMany({
                select: {
                    image: {
                        select: {
                            id: true
                        }
                    }
                }
            });
            // get random avatar
            let image: string | undefined = undefined;
            do {
                image = avatars[Math.floor(Math.random() * avatars.length)];
            } while (addedAvatars.find(a => a.image?.id == image));
            // console.log(profile)
            return {
                id: profile.id,
                role: profile.role,
                name: null,
                imageId: image
            };
        },
        clientId: '1'
    }
}
