import {OAuthConfig} from "next-auth/providers";
import {getHost} from "lib/utils";
import {hash} from "lib/crypto";
import {prisma} from "lib/database/prisma";

export interface Profile {
    id: string;
    role?: string;
}

let host = getHost() + "/api/auth/callback/home";

// It's a little dirty code, but it's working! It's converting CAS auth to OAuth formatting


export default function HomeOauth<P extends Record<string, any> = Profile>(): OAuthConfig<P> {
    return {
        id: "home",
        name: "Home MEPHi",
        type: "oauth",
        style: { logo: "images/mephi.png", bg: "#EEE", text: "#000" },
        authorization: {
            url: "https://auth.mephi.ru/login",
            params: {service: host} // TODO: add host check
        },
        token: {
            url: "http://localhost:3000/api/debug",
            async request({params}) {
                if (!params.code)
                    throw new Error("There is no cas ticket");
                const query = new URLSearchParams({service: host, ticket: params.code});
                const response = await fetch('https://auth.mephi.ru/validate?' + query)
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
            // Custom implementation of userinfo
            async request({tokens}) {
                if (!tokens.access_token) {
                    throw Error("No login in the auth request")
                }
                return {
                    id: tokens.access_token as string,
                    role: tokens.id_token as string,
                } as any;
            }
        },
        async profile(profile, tokens) {
            // const addedAvatars = await prisma.user.findMany({
            //     select: {
            //         image: {
            //             select: {
            //                 id: true
            //             }
            //         }
            //     }
            // });
            // get random avatar
            // let image: string | null = null;
            // do {
            //     image = avatars[Math.floor(Math.random() * avatars.length)];
            // } while (addedAvatars.find(a => a.image?.id == image));
            // console.log(profile)
            return {
                id: profile.id,
                role: profile.role,
                nickname: null,
                imageId: null
            };
        },
        clientId: '1'
    };
}
