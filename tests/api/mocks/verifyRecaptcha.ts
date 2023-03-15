import { TRPCError } from '@trpc/server'
import {t} from "server/trpc";

export const verifyRecaptchaFunc = jest.fn()

const verifyRecaptcha = t.middleware(
    verifyRecaptchaFunc,
)

beforeAll(() => {
    verifyRecaptchaFunc.mockImplementation(async ({ ctx: {req}, next }) => {

        return next()
    }
    )
})


jest.mock('server/middlewares/verifyRecaptcha', () => ({
    __esModule: true,
    verifyRecaptcha: verifyRecaptcha,
}))
