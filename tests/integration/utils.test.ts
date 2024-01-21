import {faker} from "@faker-js/faker";
import {trpc} from "tests/utils/trpc";
import {describe, expect, it} from '@jest/globals';
import {prisma} from "lib/database/prisma";
import {generateDiscipline, generateFaculty, generateFile, generateImage} from "./utils/faker";

// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }


describe('[GET] /api/v2/disciplines', () => {

    it('Test get all', async () => {

        const disciplines = Array.from({length: 10}, generateDiscipline).sort((a, b) => a.id.localeCompare(b.id));

        await prisma.discipline.createMany({
            data: disciplines
        });

        // prismaMock.discipline.findMany.mockResolvedValue(disciplines);

        const apiDisciplines = await trpc.utils.disciplines();

        expect(apiDisciplines).toEqual(disciplines);

        // expect(true).toBeTruthy()

    });
});

describe('[GET] /api/v2/faculties', () => {

    it('Test get all', async () => {

        const faculties = Array.from({length: 10}, generateFaculty).sort((a, b) => a.id.localeCompare(b.id));

        await prisma.faculty.createMany({
            data: faculties
        });

        const apiFaculties = await trpc.utils.facilities();

        expect(apiFaculties).toEqual(faculties);

    });
});

describe('[GET] /api/v2/semesters', () => {

    it('Test get all', async () => {

        // const apiSemesters = await utils.utils.semesters();

        // expect(apiSemesters).toEqual(semesters);

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

describe('[GET] /api/v2/get_avatars', () => {

    it('Test get all', async () => {
        function generateUser() {
            return {
                id: faker.string.uuid(),
            }
        }

        const users = Array.from({length: 300}, generateUser);

        const usersCopy = users.map(el => el.id)

        await prisma.user.createMany({
            data: users
        });


        let files = Array.from({length: 500}, () => generateFile(usersCopy)).sort((a, b) => a.id.localeCompare(b.id));

        await prisma.file.createMany({data: files});


        files = files.filter(el => el.userId === null)

        files = files.filter(el => el.tag === "avatar")

        const images = files.map(el => ({url: el.url, altUrl: el.altUrl}))

        const apiAvatars = await trpc.utils.getAvatars();


        expect(apiAvatars).toEqual(images);

    });
});


describe('[GET] /api/v2/top', () => {
    async function initTest() {

        const images = Array.from({length: 500}, generateImage).sort((a, b) => a.id.localeCompare(b.id));
        const imageIds = images.map(el => el.id)
        await prisma.file.createMany({
            data: images
        });
        let used_names = new Set()

        function generateUser() {

            let res = {
                id: faker.string.uuid(),
                nickname: "",
                rating: faker.number.int({min: 0, max: 100}),
                imageId: faker.datatype.boolean() ? faker.helpers.arrayElement(imageIds) : null,
            };
            do {
                res.nickname = faker.internet.userName();
            } while (used_names.has(res.nickname))
            used_names.add(res.nickname);
            if (res.imageId) {
                imageIds.splice(imageIds.findIndex(el => el === res.imageId), 1)
            }
            return res;
        }

        let users = Array.from({length: 200}, generateUser).sort((a, b) => a.id.localeCompare(b.id));

        await prisma.user.createMany({
            data: users
        });

        users = users.sort((a, b) => a.rating < b.rating ? 1 : (a.rating === b.rating ? (a.id.localeCompare(b.id)) : -1));

        // add images to users


        return users.map((el, index) => {
            if (el.imageId !== null) {
                const image = images.find(img => img.id === el.imageId)
                if (image === undefined) throw new Error("Image not found")
                let res = {
                    ...el,
                    image: {
                        url: image.url,
                    },
                    place: index + 1
                }
                // @ts-ignore
                delete res.imageId
                return res
            }
            // @ts-ignore
            delete el.imageId
            return {...el, image: null, place: index + 1}
        });
    }

    it('Test get 1 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 1});


        expect(topUsers).toEqual(filteredUsers.slice(0, 10));

    });
    it('Test get 2 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 2});

        const usersCount = await prisma.user.count();

        expect(usersCount).toEqual(200);

        expect(topUsers).toEqual(filteredUsers.slice(0, 10));

    });
    it('Test get 10 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 10});

        const usersCount = await prisma.user.count();
        expect(usersCount).toEqual(200);

        expect(topUsers).toEqual(filteredUsers.slice(5, 15));
    });
    it('Test get 190 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 190});

        const usersCount = await prisma.user.count();
        expect(usersCount).toEqual(200);

        expect(topUsers).toEqual(filteredUsers.slice(185, 195));
    });
    it('Test get 196 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 196});

        const usersCount = await prisma.user.count();
        expect(usersCount).toEqual(200);

        expect(topUsers).toEqual(filteredUsers.slice(191, 200));
    });
    it('Test get 197 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 197});

        const usersCount = await prisma.user.count();
        expect(usersCount).toEqual(200);

        expect(topUsers).toEqual(filteredUsers.slice(192, 200));
    });
    it('Test get 200 place', async () => {
        const filteredUsers = await initTest();

        // users = users.filter(el => el.tag === "avatar")

        // const images = users.map(el => ({url: el.url, altUrl: el.altUrl}))

        const topUsers = await trpc.utils.top({place: 200});

        const usersCount = await prisma.user.count();
        expect(usersCount).toEqual(200);

        expect(topUsers).toEqual(filteredUsers.slice(195, 200));
    });
});
