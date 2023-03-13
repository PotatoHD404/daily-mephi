import type {Discipline} from "@prisma/client";
import {prismaMock} from "tests/api/mocks/prisma";  // <--- this import
// order makes difference, it's important to mock prisma before importing trpc
import {faker} from "@faker-js/faker";
import {trpc} from "tests/api/mocks/trpc";


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
