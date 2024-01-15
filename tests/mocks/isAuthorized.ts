jest.mock('next-auth');

import {t} from "server/utils";
import {faker} from "@faker-js/faker";

export const isAuthorizedFunc = jest.fn()

const isAuthorized = t.middleware(
    isAuthorizedFunc
)

beforeEach(() => {
    isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
        let user = {
            id: faker.string.uuid(),
            nickname: faker.internet.userName(),
            image: faker.image.avatar(),
        };


        return next({
            ctx: {
                user,
            },
        })
    })
})

afterEach(() => {
    isAuthorizedFunc.mockReset()
})

jest.mock('server/middlewares/isAuthorized', () => ({
    __esModule: true,
    isAuthorized: isAuthorized,
}))

