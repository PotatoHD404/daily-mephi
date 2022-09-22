import HomeMEPhiOauth from "./mephiOauthConfig";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {PrismaClient} from "@prisma/client"
import {NextAuthOptions, SessionStrategy} from "next-auth";

const prisma = new PrismaClient()
// const host = getHost() + "/api/auth/callback/home";
//
// const query = new URLSearchParams({service: host});


export const nextAuthOptions: NextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60, // 30 days

        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
    ],
    callbacks: {
        jwt: async ({ user, token }) => {
            if (user) {
                token.id = user.id;
                token.picture = user.image;
            }
            // console.log("newToken", token);
            return token;
        },
    },
    // pages: {
    //     // signIn: 'https://login.mephi.ru/login?' + query,
    //     // signOut: '/auth/signout',
    //     // error: '/500', // Error code passed in query string as ?error=
    //     // verifyRequest: '/auth/verify-request', // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
};
