import type {Discipline} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {prisma} from "./utils/prisma";
import {trpc} from "tests/mocks/trpc";
import {searchRouter} from "server/routers/search";
import {describe, it, expect, jest} from '@jest/globals';


// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v1/disciplines', () => {

    it('Test get all', async () => {

        // const apiSemesters = await utils.utils.semesters();

        // expect(apiSemesters).toEqual(semesters);

    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
