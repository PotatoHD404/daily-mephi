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
        async jwt({token, user, account, profile, isNewUser}) {
            if (user || profile) {
                token.id = user?.id ?? profile?.id;
                token.role = user?.role ?? profile?.role;
            }
            return token;
        },
        session: async ({session, token, user}) => {
            // console.log("session");
            // console.log(session)
            // console.log(user)
            // console.log(token)
            if(session.user || token) {
                // @ts-ignore
                session.user.id = user?.id ?? token?.sub;
                // @ts-ignore
                session.user.role = user?.role ?? token?.role;
            }
            // console.log("session1");
            return session;
        }
    },
    // pages: {
    //     // signIn: 'https://login.mephi.ru/login?' + query,
    //     // signOut: '/auth/signout',
    //     // error: '/500', // Error code passed in query string as ?error=
    //     // verifyRequest: '/auth/verify-request', // (used for check email message)
    //     // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
};
