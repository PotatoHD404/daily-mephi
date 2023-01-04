
import { TRPCError } from '@trpc/server'
import {t} from "../../lib/trpc";

export const isAuthorized = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next({
        ctx: {
            user: ctx.user,
        },
    })
})

// .use(isAuthed)
