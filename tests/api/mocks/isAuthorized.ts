import {t} from "server/trpc";
import {unstable_getServerSession, User} from "next-auth";
import {nextAuthOptions} from "lib/auth/nextAuthOptions";
import {TRPCError} from "@trpc/server";
import { faker } from "@faker-js/faker";

export const isAuthorizedFunc = jest.fn()

const isAuthorized = t.middleware(
    isAuthorizedFunc
)

beforeEach(() => {
    isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
        let user = {
                id: faker.datatype.uuid(),
                // @ts-ignore
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

