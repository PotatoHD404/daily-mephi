import {initializeDatabase, getAuthToken} from '../../../lib/backend/database';
import database_client from './../../../lib/frontend/database'
import GoogleProvider from "next-auth/providers/google"
import {getFirestore} from "firebase/firestore"
import NextAuth from "next-auth"
import {FirebaseAdapter} from "@next-auth/firebase-adapter";
import {getAuth, signInWithCustomToken} from "firebase/auth";


export default NextAuth({
    // https://next-auth.js.org/providers/overview
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