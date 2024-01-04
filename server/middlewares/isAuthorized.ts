import {TRPCError} from '@trpc/server'
import {t} from "../utils";
import {User} from "next-auth";
import {auth} from "../../pages/api/auth/[...nextauth]";

export const isAuthorized = t.middleware(async ({ctx: {req, res}, next}) => {

    const session = req && res && (await auth(req, res));
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
