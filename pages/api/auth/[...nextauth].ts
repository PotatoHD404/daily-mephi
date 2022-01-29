import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth"
import FirebaseAdapter from "../../../lib/backend/next-auth/firebase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import {nextAuthOptions} from "../../../lib/backend/next-auth/signin";

if (process.env.GOOGLE_ID === undefined
    || process.env.GOOGLE_SECRET === undefined || process.env.AUTH_SECRET === undefined)
    throw new Error('There is no some environment variables');


export default NextAuth(nextAuthOptions);