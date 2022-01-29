import DailyOauth from "./dailyOauth";
import FirebaseAdapter from "./firebase-adapter";

export const nextAuthOptions = {
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        DailyOauth()
    ],
    adapter: FirebaseAdapter()

};