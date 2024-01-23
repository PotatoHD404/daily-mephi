import {t} from "server/utils";

export const verifyRecaptchaFunc = jest.fn()

const verifyRecaptcha = t.middleware(
    verifyRecaptchaFunc,
)

beforeEach(() => {
    verifyRecaptchaFunc.mockImplementation(async ({ctx: {req}, next}) => {
        return next()
    })
})

afterEach(() => {
    verifyRecaptchaFunc.mockReset()
})


jest.mock('server/middlewares/verifyRecaptcha', () => ({
    __esModule: true,
    verifyRecaptcha: verifyRecaptchaFunc,
}))
