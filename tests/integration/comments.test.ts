import type {Discipline} from "@prisma/client";
// order makes difference, it's important to mock prisma before importing utils
import {faker} from "@faker-js/faker";
import {trpc} from "tests/utils/trpc";
import {describe, it} from '@jest/globals';


// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v2/disciplines', () => {

    it('Test get all', async () => {

    });
});
