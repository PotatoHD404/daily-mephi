import NextAuth from "next-auth";
import {nextAuthConfig} from "./nextAuthConfig";

export const {
    handlers,
    auth,
    signIn, signOut
} = NextAuth(nextAuthConfig)