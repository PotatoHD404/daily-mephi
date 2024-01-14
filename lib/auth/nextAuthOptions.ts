import HomeMEPhiOauth from "./mephiOauthConfig";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {PrismaClient} from "@prisma/client"
import {Session, User} from "next-auth";
import type {NextAuthOptions} from "next-auth"
import {prisma} from "lib/database/prisma";
import {AdapterUser} from "next-auth/adapters";


// const host = getHost() + "/api/auth/callback/home";
//
// const query = new URLSearchParams({service: host});

export interface MyAppUser extends User, AdapterUser {
    id: string;
    name: string;
    email: string;
    // customClaim?: string; // Add any custom fields you need
    role?: string
}

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
        async jwt({token, user, account, profile, trigger}) {
            // trigger === "signUp"
            if (user) {
                token.user = user as MyAppUser;
                // token.id = user?.id ?? profile?.id;
                // token.role = user?.role ?? profile?.role;
            }
            // token.nickname = token.name;
            // delete token.name;
            return token;
        },
        async session({session, token, user}) {
            if (token.user) {
                // Ensure the session user is of type MyAppUser
                // console.log(token.user)

                session.user = token.user as MyAppUser;
            }
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
