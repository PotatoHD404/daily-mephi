import NextAuth from "next-auth"
import {nextAuthConfig} from "lib/auth/nextAuthConfig";
import {NextApiRequest, NextApiResponse} from "next";
// import {} from "next/headers"

// if (process.env.GOOGLE_CLIENT_ID === undefined
//     || process.env.GOOGLE_CLIENT_SECRET === undefined || process.env.AUTH_SECRET === undefined)
//     throw new Error('There is no some environment variables');

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(nextAuthConfig)
export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {

    // Check whether the request is auth callback
    // @ts-ignore
    if (req.query.nextauth.includes("callback")) {
        // CAS returns ticket, but OAUTH needs code parameter
        req.query.code = req.query.ticket;
        delete req.query.ticket;
    }
    // Get a custom cookie value from the request
    // const someCookie = req.cookies["some-custom-cookie"]
    return auth(req, res)
}
