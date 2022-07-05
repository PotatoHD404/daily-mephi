import NextAuth, {SessionStrategy} from "next-auth"
import {nextAuthOptions} from "lib/auth/nextAuthOptions";
import {NextApiRequest, NextApiResponse} from "next";

// if (process.env.GOOGLE_CLIENT_ID === undefined
//     || process.env.GOOGLE_CLIENT_SECRET === undefined || process.env.AUTH_SECRET === undefined)
//     throw new Error('There is no some environment variables');

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Check whether the request is auth callback
    // @ts-ignore
    if (req.query.nextauth.includes("callback")) {
        // CAS returns ticket, but OAUTH needs code parameter
        req.query.code = req.query.ticket;
        delete req.query.ticket;
    }
    // Get a custom cookie value from the request
    // const someCookie = req.cookies["some-custom-cookie"]

    return await NextAuth(req, res, nextAuthOptions)
}