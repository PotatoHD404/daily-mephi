import HomeMEPhiOauth from "./mephiOauthConfig";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [
        HomeMEPhiOauth(),
    ],
    pages: {
        signIn: '/',
        // signOut: '/auth/signout',
        error: '/500', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    }
};