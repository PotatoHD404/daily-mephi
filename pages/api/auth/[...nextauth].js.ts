import {initializeDatabase, getAuthToken} from '../../../lib/backend/database';
import database_client from './../../../lib/frontend/database'
import GoogleProvider from "next-auth/providers/google"
import {getFirestore} from "firebase/firestore"
import NextAuth from "next-auth"
import {FirebaseAdapter} from "../../../lib/backend/firebase-adapter";
import {getAuth, signInWithCustomToken} from "firebase/auth";


if (process.env.GOOGLE_ID === undefined
    || process.env.GOOGLE_SECRET === undefined || process.env.AUTH_SECRET === undefined)
    throw new Error('There is no some environment variables');


export default NextAuth({
    // https://next-auth.js.org/providers/overview
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    adapter: FirebaseAdapter(await (async () => {
            await initializeDatabase();

            const auth = getAuth();
            const userCredential = await signInWithCustomToken(auth, await getAuthToken('admin'));

            return getFirestore()
        })()
    )

})