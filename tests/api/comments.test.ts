import type {Discipline} from "@prisma/client";
import {prismaMock} from "tests/api/mocks/prisma";  // <--- this import
// order makes difference, it's important to mock prisma before importing utils
import {faker} from "@faker-js/faker";
import {trpc} from "tests/api/mocks/trpc";
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
