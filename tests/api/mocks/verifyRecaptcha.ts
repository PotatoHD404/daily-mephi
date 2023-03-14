import { TRPCError } from '@trpc/server'
import {t} from "server/trpc";

export const verifyRecaptcha = t.middleware(async ({ ctx: {req}, next }) => {

    return next()
})

jest.mock('server/middlewares/verifyRecaptcha', () => ({
    __esModule: true,
    verifyRecaptcha: verifyRecaptcha,
}))
