import type {Discipline, Faculty, Semester, File} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {prismaMock} from "tests/api/mocks/prisma";
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

describe('[GET] /api/v1/faculties', () => {

    it('Test get all', async () => {
        function generateFaculty(): Faculty {
            return {
                id: faker.datatype.uuid(),
                name: faker.lorem.sentence(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        const faculties = Array.from({length: 10}, generateFaculty);

        prismaMock.faculty.findMany.mockResolvedValue(faculties);

        const apiFaculties = await trpc.utils.facilities();

        expect(apiFaculties).toEqual(faculties);

    });
});

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateSemester(): Semester {
            return {
                id: faker.datatype.uuid(),
                name: faker.lorem.sentence(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        const semesters = Array.from({length: 10}, generateSemester);

        prismaMock.semester.findMany.mockResolvedValue(semesters);

        const apiSemesters = await trpc.utils.semesters();

        expect(apiSemesters).toEqual(semesters);

    });
});

// export type File = {
//     id: string
//     url: string
//     altUrl: string | null
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
//     filename: string
//     userId: string | null
//     tutorId: string | null
//     materialId: string | null
//     tag: string | null
//     size: number
//   }

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateFile(): File {
            return {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: null,
                tutorId: null,
                materialId: null,
                tag: "image",
                size: faker.datatype.number(),
            }
        }

        const files = Array.from({length: 50}, generateFile);

        prismaMock.file.findMany.mockResolvedValue(files);

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateFile(): File {
            return {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: null,
                tutorId: null,
                materialId: null,
                tag: "image",
                size: faker.datatype.number(),
            }
        }

        const files = Array.from({length: 50}, generateFile);

        prismaMock.file.findMany.mockResolvedValue(files);

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateFile(): File {
            return {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: null,
                tutorId: null,
                materialId: null,
                tag: "image",
                size: faker.datatype.number(),
            }
        }

        const files = Array.from({length: 50}, generateFile);

        prismaMock.file.findMany.mockResolvedValue(files);

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});