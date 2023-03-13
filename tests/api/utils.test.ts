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

        const disciplines = Array.from({length: 10}, generateDiscipline).sort((a, b) => a.id > b.id ? 1 : -1);

        await prisma.discipline.createMany({
            data: disciplines
        });

        // prismaMock.discipline.findMany.mockResolvedValue(disciplines);

        const apiDisciplines = await trpc.utils.disciplines();

        expect(apiDisciplines).toEqual(disciplines);

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

        const faculties = Array.from({length: 10}, generateFaculty).sort((a, b) => a.id > b.id ? 1 : -1);

        await prisma.faculty.createMany({
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
                name: faker.random.numeric(1),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        let semesters = Array.from({length: 10}, generateSemester).sort((a, b) => a.id > b.id ? 1 : -1);
        // filter unique semesters by name
        semesters = semesters.filter((item, index) => semesters.findIndex(el => el.name === item.name) === index)
        await prisma.semester.createMany({
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

export type UserCreateManyInput = {
    id?: string
    nickname?: string | null
    imageId?: string | null
    role?: string
    email?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    rating?: number
    bio?: string | null
    place?: number
    likesCount?: number
    dislikesCount?: number
    commentsCount?: number
    materialsCount?: number
    reviewsCount?: number
    quotesCount?: number
    score?: number
  }

describe('[GET] /api/v1/get_avatars', () => {

    it('Test get all', async () => {
        function generateUser() {
            return {
                id: faker.datatype.uuid(),
            }
        }

        const users = Array.from({length: 300}, generateUser);

        const usersCopy = users.map(el => el.id)

        await prisma.user.createMany({
            data: users
        });



        function generateFile(): File {
            const res = {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: faker.datatype.boolean() || usersCopy.length === 0 ? null : faker.helpers.arrayElement(usersCopy),
                tutorId: null,
                materialId: null,
                tag: faker.datatype.boolean() ? "avatar" : "other",
                size: faker.datatype.number(),
            }
            // remove user id from users array
            if (res.userId !== null && res.tag === "avatar")
                usersCopy.splice(usersCopy.findIndex(el => el === res.userId), 1)
            return res;
        }

        let files = Array.from({length: 500}, generateFile).sort((a, b) => a.id > b.id ? 1 : -1);

        await prisma.file.createMany({data: files});


        files = files.filter(el => el.userId === null)

        files = files.filter(el => el.tag === "avatar")

        const images = files.map(el => ({url: el.url, altUrl: el.altUrl}))

        const apiAvatars = await trpc.utils.getAvatars();


        expect(images).toEqual(apiAvatars);

    });
});
