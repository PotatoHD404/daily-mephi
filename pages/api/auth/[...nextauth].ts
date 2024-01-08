// import NextAuth from "next-auth"
import {nextAuthConfig} from "lib/auth/nextAuthConfig";
import {NextApiRequest, NextApiResponse} from "next";
import {auth} from "lib/auth";
// import {} from "next/headers"

// if (process.env.GOOGLE_CLIENT_ID === undefined
//     || process.env.GOOGLE_CLIENT_SECRET === undefined || process.env.AUTH_SECRET === undefined)
//     throw new Error('There is no some environment variables');

interface IHeaders {
    headers: Headers
}

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {

    // Check whether the request is auth callback
    if (req?.query?.nextauth?.includes("callback")) {
        // CAS returns ticket, but OAUTH needs code parameter
        req.query.code = req.query.ticket;
        delete req.query.ticket;
    }
    // Get a custom cookie value from the request
    // const someCookie = req.cookies["some-custom-cookie"]
    let newRes = (res as NextApiResponse & IHeaders)
    newRes.headers = new Headers()
    const session = await auth(req, res);
    for (const header of newRes.headers)
        res.setHeader(...header)

    // res.status(200).json({})
    res.status(res.statusCode).json(session)
}
