import {TRPCError} from '@trpc/server'
import {t} from "server/utils";

export const verifyRecaptcha = t.middleware(async ({ctx: {req}, next}) => {
    const {recaptchaToken: token} = req.body;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    if (!data.success || data.score < 0.5) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Recaptcha failed'
        })
    }

    return next()
})

// .use(isAuthed)
