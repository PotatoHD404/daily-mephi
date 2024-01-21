import {t} from "server/utils";

export const verifyCSRFTokenFunc = jest.fn()

const verifyCSRFToken = t.middleware(
    verifyCSRFTokenFunc,
)

beforeEach(() => {
    verifyCSRFTokenFunc.mockImplementation(async ({ctx: {req}, next}) => {
        return next()
    })
})

afterEach(() => {
    verifyCSRFTokenFunc.mockReset()
})

jest.mock('server/middlewares/verifyCSRFToken', () => ({
    __esModule: true,
    verifyCSRFToken: verifyCSRFToken,
}))
