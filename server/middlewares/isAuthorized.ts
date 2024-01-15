import {TRPCError} from '@trpc/server'
import {getServerSession, User} from "next-auth";
import {MyAppUser, nextAuthOptions} from "../../lib/auth/nextAuthOptions";
import {t} from "../utils";

export const isAuthorized = t.middleware(async ({ctx: {req, res}, next}) => {

    const session = req && res && (await getServerSession(req, res, nextAuthOptions));
    const sessionUser = session?.user as (User & MyAppUser) ?? null;
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
