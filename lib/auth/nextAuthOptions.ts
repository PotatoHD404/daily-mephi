import HomeMEPhiOauth from "./mephiOauthConfig";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {PrismaClient} from "@prisma/client"
import {Session} from "next-auth";
import type { NextAuthOptions } from "next-auth"
import {prisma} from "lib/database/prisma";


// const host = getHost() + "/api/auth/callback/home";
//
// const query = new URLSearchParams({service: host});


export const nextAuthOptions: NextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days

        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
    ],
    callbacks: {
        async jwt({token, user, account, profile, trigger}: any) {
            // trigger === "signUp"
            if (user || profile) {
                // @ts-ignore
                token.id = user?.id ?? profile?.id;
                // @ts-ignore
                token.role = user?.role ?? profile?.role;
            }
            token.nickname = token.name;
            delete token.name;
            return token;
        },
        // session: async ({session, token, user}) => {
        //     // console.log("session");
        //     // console.log(session)
        //     // console.log(user)
        //     // console.log(token)
        //     type MySession = Session & {user: {id: string | null, role: string}}
        //     let newSession = session as MySession;
        //     if (session.user || token) {
        //
        //         newSession.user.id = user?.id ?? token?.sub ?? null;
        //         // @ts-ignore
        //         newSession.user.role = user?.role ?? token?.role ?? "default";
        //     }
        //     // console.log("session1");
        //     return newSession;
        // }
    },
    // pages: {
    //     // signIn: 'https://login.mephi.ru/login?' + query,
    //     // signOut: '/auth/signout',
    //     // error: '/500', // Error code passed in query string as ?error=
    //     // verifyRequest: '/auth/verify-request', // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
};
