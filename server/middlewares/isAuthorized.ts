import {TRPCError} from '@trpc/server'
import {getServerSession, User} from "next-auth";
import {nextAuthOptions} from "../../lib/auth/nextAuthOptions";
import {t} from "../utils";

export const isAuthorized = t.middleware(async ({ctx: {req, res}, next}) => {

    const session = req && res && (await getServerSession(req, res, nextAuthOptions));
    // type of user
    type MyUser = {
        id: string,
        nickname: string,
        image: string | null,
    };
    const sessionUser = session?.user as (User & MyUser);
    let user: MyUser | null = null;
    if (sessionUser.id) {
        user = {
            id: sessionUser.id,
            // @ts-ignore
            nickname: sessionUser.name,
            image: sessionUser?.image || null,
        };
    }
    if (!user) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return next({
        ctx: {
            user,
        },
    })
})

// .use(isAuthed)
