import {t} from "server/trpc";
import {unstable_getServerSession, User} from "next-auth";
import {nextAuthOptions} from "lib/auth/nextAuthOptions";
import {TRPCError} from "@trpc/server";
import { faker } from "@faker-js/faker";

export const isAuthorizedFunc = jest.fn()

const isAuthorized = t.middleware(
    isAuthorizedFunc
)

beforeAll(() => {
    isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
        const session = req && res && (await unstable_getServerSession(req, res, nextAuthOptions));
        // type of user
        type MyUser = {
            id: string,
            nickname: string,
            image: string | null,
        };

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

jest.mock('server/middlewares/isAuthorized', () => ({
    __esModule: true,
    isAuthorized: isAuthorized,
}))

