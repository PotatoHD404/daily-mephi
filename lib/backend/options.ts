import DailyOauth from "./dailyOauth";
import FirebaseAdapter from "./firebase-adapter";
import HomeOauth from "./OauthConfig";
import {Session, User} from "next-auth";
import {JWT} from "next-auth/jwt";
// import GoogleProvider from "next-auth/providers/google";
//
// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
//     throw new Error("There are not enough secrets");

export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        HomeOauth(),
    ],
    callbacks: {
        async session({session, token, user}: {
            session: Session
            user: User
            token: JWT
        }) {
            (session.user as any).id = user.id;
            return session;
        }
    },
    adapter: FirebaseAdapter()

};