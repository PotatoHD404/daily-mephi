import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import {prisma} from 'lib/database/prisma';
import {notion} from "../database/notion";
import {unstable_getServerSession, User} from "next-auth";
import {nextAuthOptions} from "../auth/nextAuthOptions";

// create context based of incoming request
// set as optional here, so it can also be re-used for `getStaticProps()`
export const createContext = async (
    opts?: trpcNext.CreateNextContextOptions,
) => {
    // get session from request
    const req = opts?.req;
    const res = opts?.res;
    const session = req && res && (await unstable_getServerSession(req, res, nextAuthOptions));
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
    return {
        req,
        res,
        user,
        prisma,
        notion
    };
};
export type Context = trpc.inferAsyncReturnType<typeof createContext>;
