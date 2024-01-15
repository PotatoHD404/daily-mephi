import type {Discipline} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {prismaMock} from "tests/mocks/prisma";
import {trpc} from "tests/mocks/trpc";
import {describe, it} from '@jest/globals';


// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v1/disciplines', () => {

    it('Test get all', async () => {

    });
});