import {t} from "server/utils";
import {nextAuthConfig} from "lib/auth/nextAuthConfig";
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

