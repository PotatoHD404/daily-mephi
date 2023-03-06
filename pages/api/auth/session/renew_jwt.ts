// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import { prisma } from "lib/database/prisma";
import jwt, {encode, getToken} from "next-auth/jwt";
import { serialize } from "cookie"

const ALLOWED_COOKIE_SIZE = 4096
// Based on commented out section above
const ESTIMATED_EMPTY_COOKIE_SIZE = 163
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE

export class SessionStore {
    #chunks: any = {}
    #option: any
    #logger: any

    constructor(
        option: any,
        req: {
            cookies?: Partial<Record<string, string> | Map<string, string>>
            headers?: Headers | any | Record<string, string>
        },
        logger: any
    ) {
        this.#logger = logger
        this.#option = option

        const { cookies } = req
        const { name: cookieName } = option

        if (cookies instanceof Map) {
            for (const name of cookies.keys()) {
                if (name.startsWith(cookieName)) this.#chunks[name] = cookies.get(name)
            }
        } else {
            for (const name in cookies) {
                if (name.startsWith(cookieName)) { // @ts-ignore
                    this.#chunks[name] = cookies[name]
                }
            }
        }
    }

    get value() {
        return Object.values(this.#chunks)?.join("")
    }

    /** Given a cookie, return a list of cookies, chunked to fit the allowed cookie size. */
    #chunk(cookie: any): any[] {
        const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE)

        if (chunkCount === 1) {
            this.#chunks[cookie.name] = cookie.value
            return [cookie]
        }

        const cookies: any[] = []
        for (let i = 0; i < chunkCount; i++) {
            const name = `${cookie.name}.${i}`
            const value = cookie.value.substr(i * CHUNK_SIZE, CHUNK_SIZE)
            cookies.push({ ...cookie, name, value })
            this.#chunks[name] = value
        }

        this.#logger.debug("CHUNKING_SESSION_COOKIE", {
            message: `Session cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
            emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
            valueSize: cookie.value.length,
            chunks: cookies.map((c) => c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE),
        })

        return cookies
    }

    /** Returns cleaned cookie chunks. */
    #clean(): Record<string, any> {
        const cleanedChunks: Record<string, any> = {}
        for (const name in this.#chunks) {
            delete this.#chunks?.[name]
            cleanedChunks[name] = {
                name,
                value: "",
                options: { ...this.#option.options, maxAge: 0 },
            }
        }
        return cleanedChunks
    }

    /**
     * Given a cookie value, return new cookies, chunked, to fit the allowed cookie size.
     * If the cookie has changed from chunked to unchunked or vice versa,
     * it deletes the old cookies as well.
     */
    chunk(value: string, options: any): any[] {
        // Assume all cookies should be cleaned by default
        const cookies: Record<string, any> = this.#clean()

        // Calculate new chunks
        const chunked = this.#chunk({
            name: this.#option.name,
            value,
            options: { ...this.#option.options, ...options },
        })

        // Update stored chunks / cookies
        for (const chunk of chunked) {
            cookies[chunk.name] = chunk
        }

        return Object.values(cookies)
    }

    /** Returns a list of cookies that should be cleaned. */
    clean(): any[] {
        return Object.values(this.#clean())
    }
}

export function setCookie(res: any, cookie: any) {
    // Preserve any existing cookies that have already been set in the same session
    let setCookieHeader = res.getHeader("Set-Cookie") ?? []
    // If not an array (i.e. a string with a single cookie) convert it into an array
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [setCookieHeader]
    }
    const { name, value, options } = cookie
    const cookieHeader = serialize(name, value, options)
    setCookieHeader.push(cookieHeader)
    res.setHeader("Set-Cookie", setCookieHeader)
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // console.log("we are here");
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
                nickname: true,
                email: true,
                image: {
                    select: {
                        url: true
                    }
                },
                id: true,
            },
        }
    )

    if (!user) {
        res.status(404).json({status: "not found"});
        return;
    }

    session = {
        nickname: user.nickname,
        email: user.email,
        picture: user.image?.url || null,
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

    const cookieString = `${sessionCookie.name}=${sessionCookie.value}; Path=/; Expires=${
        // @ts-ignore
        sessionCookie.options.expires.toUTCString()
    }; HttpOnly; ${sessionCookie.options.secure ? "Secure; " : ""}SameSite=Lax;`;
    res.setHeader("Set-Cookie",
        cookieString);
    // console.log(token)
    // console.log(res.getHeader("Set-Cookie"))
    res.status(200).json({status: "ok", cookieString});
}
