import type {Discipline, Faculty, Semester, File} from "@prisma/client";
import {PrismaClient} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {trpc} from "tests/api/mocks/trpc";



// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect()    
})

afterAll(async () => {
    const deleteDisciplines = prisma.discipline.deleteMany()
    
    prisma.$connect();
    const deletes = Object.getOwnPropertyNames(prisma).
        filter(el => el[0] !== el[0].
        toUpperCase() && el[0].
        match(/[a-z]/i)).
        // @ts-ignore
        map(el => prisma[el]?.deleteMany).
        filter(el => el !== undefined).map(el => el())
    await prisma.$transaction(deletes)

    await prisma.$disconnect()
})

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
        await prisma.discipline.createMany({
            data: disciplines
        });

        // prismaMock.discipline.findMany.mockResolvedValue(disciplines);

        const apiDisciplines = await trpc.utils.disciplines();

        expect(apiDisciplines).toEqual(disciplines.sort((a, b) => a.id > b.id ? 1 : -1));

        // expect(true).toBeTruthy()

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

        prisma.faculty.createMany({
                data: faculties
        });

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

        prisma.semester.createMany({
            data: semesters
        });

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

describe('[GET] /api/v1/get_avatars', () => {

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

        prisma.file.createMany({data: files});

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});
