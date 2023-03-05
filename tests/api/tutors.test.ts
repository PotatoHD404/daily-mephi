import type {Discipline} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {prismaMock} from "tests/mocks/prisma";
import {trpc} from "tests/mocks/trpc";

jest.setTimeout(5 * 10e2);

// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v1/disciplines', () => {

    it('Test get all', async () => {
        function generateDiscipline(): Discipline {
            return {
                id: faker.datatype.uuid(),
                name: faker.lorem.sentence(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        const disciplines = Array.from({length: 10}, generateDiscipline);

        prismaMock.discipline.findMany.mockResolvedValue(disciplines);

        const apiDisciplines = await trpc.utils.disciplines();

        expect(apiDisciplines).toEqual(disciplines);

    });
});
