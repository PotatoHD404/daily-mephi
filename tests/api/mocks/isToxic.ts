import {t} from "server/utils";
import {unstable_getServerSession, User} from "next-auth";
import {nextAuthOptions} from "lib/auth/nextAuthOptions";
import {TRPCError} from "@trpc/server";
import { faker } from "@faker-js/faker";

export const isToxic = jest.fn()

beforeEach(() => {
    isToxic.mockImplementation(async () => true )
})

afterEach(() => {
    isToxic.mockReset()
})

jest.mock('lib/toxicity', () => ({
    __esModule: true,
    isToxic: isToxic,
}))

