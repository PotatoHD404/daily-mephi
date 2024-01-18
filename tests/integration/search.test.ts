import type {Discipline} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {trpc} from "tests/utils/trpc";
import {searchRouter} from "server/routers/search";
import {describe, it, expect, jest} from '@jest/globals';
import {prisma} from "../../lib/database/prisma";


// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v2/disciplines', () => {

    it('Test get all', async () => {

        // const apiSemesters = await utils.utils.semesters();

        // expect(apiSemesters).toEqual(semesters);

    });
});