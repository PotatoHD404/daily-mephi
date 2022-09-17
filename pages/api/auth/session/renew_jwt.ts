// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken, encode, decode} from "next-auth/jwt";
import jwt from "next-auth/jwt";
import {Cookie, SessionStore} from "next-auth/core/lib/cookie";
import {setCookie} from "next-auth/next/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    if (!process.env.NEXTAUTH_SECRET)
        throw new Error("JWT_PRIVATE is not defined");
    let session = await getToken({req})
    // console.log(session)
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const id = session.sub;
    // const decodedToken = await getToken({ ...jwtOpts, req, cookieName: "next-auth.session-token"})
    // console.log(decodedToken)
    // const allUsers = {status: "ok"}
    const user = await prisma.user.findFirst({
            where: {
                id
            },
            select: {
                name: true,
                email: true,
                image: true,
                id: true,
            },
        }
    )

    if (!user) {
        res.status(404).json({status: "not found"});
        return;
    }

    session = {
        name: user.name,
        email: user.email,
        picture: user.image,
        sub: user.id,
    }

    const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL;
    const cookieName = secureCookie
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    const sessionStore = new SessionStore(
        {name: cookieName, options: {secure: secureCookie}},
        {cookies: req.cookies, headers: req.headers},
        console
    )
    const
        token = await encode({token: session, secret: process.env.NEXTAUTH_SECRET, ...jwt});
    const sessionCookie = sessionStore.chunk(token, {expires: new Date(Date.now() + 60 * 60 * 1000)})[0]
    // console.log(sessionCookies)
    setCookie(res, sessionCookie)
    // send the cookies
    // sessionCookie.forEach((cookie: Cookie) => {
    //     res.setHeader("Set-Cookie", cookie);
    // });
    // Encode token
    // const newToken = await encode({...jwt, secret: process.env.JWT_PRIVATE, token: session })

    // decode the token
    // console.log(verifiedToken)
    // const resCookies: Cookie[] = []
    // resCookies.push(...sessionStore.value)
    // console.log(sessionCookie);
    res.setHeader("Set-Cookie",
        `${sessionCookie.name}=${sessionCookie.value}; Path=/; Expires=${
            sessionCookie.options.expires.toUTCString()
    }; Http${sessionCookie.options.secure ? "s" : ""}Only; SameSite=Lax;`);
    // console.log(token)
    res.status(200).json({status: "ok"});
}
