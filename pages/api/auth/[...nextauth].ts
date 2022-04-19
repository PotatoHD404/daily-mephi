import NextAuth from "next-auth"
import {nextAuthOptions} from "../../../lib/backend/options";

// if (process.env.GOOGLE_CLIENT_ID === undefined
//     || process.env.GOOGLE_CLIENT_SECRET === undefined || process.env.AUTH_SECRET === undefined)
//     throw new Error('There is no some environment variables');


export default NextAuth(nextAuthOptions);