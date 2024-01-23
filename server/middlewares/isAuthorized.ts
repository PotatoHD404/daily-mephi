import {TRPCError} from '@trpc/server'
import {User} from "next-auth";
import {auth, MyAppUser} from "lib/auth/nextAuthOptions";
import {t} from "server/utils";

export const isAuthorized = t.middleware(async ({ctx: {req, res}, next}) => {

    const session = await auth(req, res);
    const sessionUser = session?.user as (MyAppUser) ?? null;
    if (!sessionUser) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return next({
        ctx: {
            user: sessionUser,
        },
    })
})

// .use(isAuthed)
