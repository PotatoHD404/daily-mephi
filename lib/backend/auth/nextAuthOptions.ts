import DailyOauth from "../dailyOauth";
// import FirebaseAdapter from "./firebase-adapter";
import HomeMEPhiOauth from "./mephiOauthConfig";
import {Session, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import NextAuth from "next-auth"
import SequelizeAdapter from "@next-auth/sequelize-adapter"
import {Sequelize} from "sequelize";
// import GoogleProvider from "next-auth/providers/google";
//
// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
//     throw new Error("There are not enough secrets");

const sequelize = new Sequelize('postgres://PotatoHD:password@localhost:5432/stocks');

export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
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
    },
    // callbacks: {
    //     async session({session, token, user}: {
    //         session: Session
    //         user: User
    //         token: JWT
    //     }) {
    //         (session.user as any).id = user.id;
    //         return session;
    //     }
    // },
    adapter: SequelizeAdapter(sequelize)

};