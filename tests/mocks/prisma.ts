import type { PrismaClient } from '@prisma/client'
import type { DeepMockProxy } from "jest-mock-extended";
import { mockDeep, mockReset } from 'jest-mock-extended'

import {prisma} from 'lib/database/prisma'
import {jest} from "@jest/globals";
import {beforeEach} from "jest-circus";

jest.mock('lib/database/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>({ funcPropSupport: true }),
}))

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
