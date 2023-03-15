import {t} from "server/trpc";
import {TRPCError} from "@trpc/server";
import {createHash} from "crypto";
import {defaultCookies} from "lib/utils";

export const verifyCSRFTokenFunc = jest.fn()

const verifyRecaptcha = t.middleware(
    verifyCSRFTokenFunc,
)

beforeAll(() => {
    verifyCSRFTokenFunc.mockImplementation(async ({ ctx: {req}, next }) => {

        return next()
    }
    )
})

jest.mock('server/middlewares/verifyCSRFToken', () => ({
    __esModule: true,
    verifyRecaptcha: verifyRecaptcha,
}))
