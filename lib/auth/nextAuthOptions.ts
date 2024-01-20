import HomeMEPhiOauth from "./mephiOauthConfig";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {User} from "@prisma/client"
// import {Session, User} from "next-auth";
import type {NextAuthOptions} from "next-auth"
import {prisma} from "lib/database/prisma";
import VkProvider from "next-auth/providers/vk";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import GitHubProvider from "next-auth/providers/github";
import {env} from "../env";


// const host = getHost() + "/api/auth/callback/home";
//
// const query = new URLSearchParams({service: host});

// select user along with it's image
export const selectUser = {
    select: {
        id: true,
        nickname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        rating: true,
        bio: true,
        place: true,
        likesCount: true,
        dislikesCount: true,
        commentsCount: true,
        materialsCount: true,
        reviewsCount: true,
        quotesCount: true,
        score: true,
        image: {
            select: {
                id: true,
                url: true,
            }
        }
    },
}

let findUser = (id: string) => prisma.user.findUniqueOrThrow({ where: { id }, ...selectUser })
let prismaAdapter = PrismaAdapter(prisma);
prismaAdapter = {
    ...prismaAdapter,
    createUser: (data: any): any => prisma.user.create({ data, ...selectUser },),
    getUser: (id: any): any  => prisma.user.findUnique({ where: { id }, ...selectUser }),
    getUserByEmail: (email: any): any  => prisma.user.findUnique({ where: { email }, ...selectUser  }),
    async getUserByAccount(provider_providerAccountId: any): Promise<any> {
        const account = await prisma.account.findUnique({
            where: { provider_providerAccountId },
            select: {user: selectUser},
        })
        return account?.user ?? null
    },
}

export type MyAppUser = Awaited<ReturnType<typeof findUser>>

const vkApiVersion = "5.199"


export const nextAuthOptions: NextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    adapter: prismaAdapter,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days

        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: env.NEXTAUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
        YandexProvider({
            clientId: env.YANDEX_CLIENT_ID,
            clientSecret: env.YANDEX_CLIENT_SECRET,
            authorization:
                "https://oauth.yandex.ru/authorize?scope=login:email",
        }),
        VkProvider({
            authorization: `https://oauth.vk.com/authorize?scope=email&v=${vkApiVersion}`,
            token: `https://oauth.vk.com/access_token?v=${vkApiVersion}`,
            userinfo: `https://api.vk.com/method/users.get?v=${vkApiVersion}`,
            clientId: env.VK_CLIENT_ID,
            clientSecret: env.VK_CLIENT_SECRET
        }),
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        }),
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET
        })
    ],
    callbacks: {
        // async signIn({user, account, profile}) {
        //     // return true;
        //     return true;
        // },
        async jwt({token, user, account, profile, trigger}) {

            if (trigger == "signUp" && account?.provider !== "home") {

                // disallow registering with external providers
                throw new Error("Sign up with external providers is not allowed")
            }
            if (trigger == "update") {
                const tokenUser = token?.user as MyAppUser;
                if (tokenUser.id === null) {
                    throw new Error("Invalid user id")
                }
                // console.log("update")
                // console.log(token.user)
                token.user = await prisma.user.findUnique({where: {id: tokenUser.id}, ...selectUser});
                if (!token.user) {
                    throw new Error("User not found")
                }
            }
            else if (user || profile) {
                token.user = user as MyAppUser;
            }
            return token;
        },
        async session({session, token, user}) {
            if (token.user) {
                // @ts-ignore
                session.user = token.user as MyAppUser;
            }
            return session;
        }
    },
    pages: {
        error: "/signin",
        signIn: "/signin",
    }
    // pages: {
    // signIn: 'https://login.mephi.ru/login?' + query,
    //     // signOut: '/auth/signout',
    //     // error: '/500', // Error code passed in query string as ?error=
    //     // verifyRequest: '/auth/verify-request', // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
};
