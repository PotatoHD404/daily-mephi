import {TRPCError} from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import {prisma} from 'lib/database/prisma';
import {notion} from "lib/database/notion";

// create context based of incoming request
// set as optional here, so it can also be re-used for `getStaticProps()`
export const createContext = (
    opts?: trpcNext.CreateNextContextOptions,
) => {
    // get session from request
    const req = opts?.req;
    const res = opts?.res;

    // if (!req) {
    //     throw new TRPCError({
    //         code: 'UNAUTHORIZED',
    //         message: 'No request found'
    //     })
    // }
    // if (!res) {
    //     throw new TRPCError({
    //         code: 'UNAUTHORIZED',
    //         message: 'No response found'
    //     })
    // }
    return {
        req,
        res,
        prisma,
        notion
    };
};
export type Context = typeof createContext
