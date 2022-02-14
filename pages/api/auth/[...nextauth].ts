import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth"
import FirebaseAdapter from "../../../lib/backend/firebase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import {nextAuthOptions} from "../../../lib/backend/options";

// if (process.env.GOOGLE_CLIENT_ID === undefined
//     || process.env.GOOGLE_CLIENT_SECRET === undefined || process.env.AUTH_SECRET === undefined)
//     throw new Error('There is no some environment variables');


export default NextAuth(nextAuthOptions);