import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth"
import FirebaseAdapter from "../../../lib/backend/next-auth/firebase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";


if (process.env.GOOGLE_ID === undefined
    || process.env.GOOGLE_SECRET === undefined || process.env.AUTH_SECRET === undefined)
    throw new Error('There is no some environment variables');


export default NextAuth({
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        // CredentialsProvider({
        //     // The name to display on the sign in form (e.g. "Sign in with...")
        //     name: "Credentials",
        //     // The credentials is used to generate a suitable form on the sign in page.
        //     // You can specify whatever fields you are expecting to be submitted.
        //     // e.g. domain, username, password, 2FA token, etc.
        //     // You can pass any HTML attribute to the <input> tag through the object.
        //     credentials: {
        //         token: { label: "token", type: "text" },
        //     },
        //     async authorize(credentials, req) {
        //         // Add logic here to look up the user from the credentials supplied
        //         const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
        //
        //         if (user) {
        //             // Any object returned will be saved in `user` property of the JWT
        //             return user
        //         } else {
        //             // If you return null then an error will be displayed advising the user to check their details.
        //             return null
        //
        //             // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //         }
        //     }
        // })
    ],
    // session: { strategy: "jwt" },
    // jwt: {
    //     // A secret to use for key generation. Defaults to the top-level `secret`.
    //     secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    //     // The maximum age of the NextAuth.js issued JWT in seconds.
    //     // Defaults to `session.maxAge`.
    //     maxAge: 60 * 60 * 24 * 30,
    //     // You can define your own encode/decode functions for signing and encryption
    //     // if you want to override the default behavior.
    //     // async encode({ secret, token, maxAge }) {},
    //     // async decode({ secret, token }) {},
    // },
    adapter: FirebaseAdapter()

})