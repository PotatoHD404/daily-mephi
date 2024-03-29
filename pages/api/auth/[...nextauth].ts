import NextAuth from "next-auth"
import {nextAuthOptions} from "lib/auth/nextAuthOptions";
import {NextApiRequest, NextApiResponse} from "next";
// import {} from "next/headers"

// if (process.env.GOOGLE_CLIENT_ID === undefined
//     || process.env.GOOGLE_CLIENT_SECRET === undefined || process.env.AUTH_SECRET === undefined)
//     throw new Error('There is no some environment variables');

function arrayToString(array?: string[]) {
    return array ? '/' + array.join('/') : '';
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    // Check whether the request is auth callback
    const arr = req?.query?.nextauth as string[] | undefined
    if (arrayToString(arr) === "/callback/home") {
        // CAS returns ticket, but OAUTH needs code parameter
        req.query.code = req.query.ticket;
        delete req.query.ticket;
    }
    // Get a custom cookie value from the request
    // const someCookie = req.cookies["some-custom-cookie"]
    return await NextAuth(req, res, nextAuthOptions);
}
