import {TRPCError} from '@trpc/server'
import {t} from "../utils";
import {defaultCookies} from "../../lib/utils";
import {createHash} from "crypto";

export const verifyCSRFToken = t.middleware(async ({ctx: {req}, next}) => {

    const nextOptions: any = {
        ...defaultCookies(
            req.url?.startsWith("https://") ?? false
        ),
        secret: process.env.NEXTAUTH_SECRET,
    };

    const cookieValue = req.cookies[nextOptions.csrfToken.name];
    const {csrfToken: bodyValue} = req.body;
    if (!cookieValue || !bodyValue) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'No CSRF token found'
        })
    }
    const [csrfToken, csrfTokenHash] = cookieValue.split("|")
    const expectedCsrfTokenHash = createHash("sha256")
        .update(`${csrfToken}${nextOptions.secret}`)
        .digest("hex")

    if (csrfTokenHash !== expectedCsrfTokenHash || csrfToken !== bodyValue) {
        // If hash matches then we trust the CSRF token value
        // If this is a POST request and the CSRF Token in the POST request matches
        // the cookie we have already verified is the one we have set, then the token is verified!
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'CSRF token mismatch'
        })
    }


    return next()
})

// .use(isAuthed)
