import DailyOauth from "./dailyOauth";
import FirebaseAdapter from "./firebase-adapter";
// import GoogleProvider from "next-auth/providers/google";
//
// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
//     throw new Error("There are not enough secrets");

export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        DailyOauth(),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // })
    ],
    adapter: FirebaseAdapter()

};