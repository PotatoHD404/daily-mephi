import type {User} from "@prisma/client";
import {faker} from '@faker-js/faker';
import {trpc} from "./mocks/trpc";
import {TRPCError} from "@trpc/server";
import {prisma} from "./utils/prisma";


// export type User = {
//     id: string
//     nickname: string | null
//     imageId: string | null
//     role: string
//     email: string | null
//     emailVerified: Date | null
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
//     rating: number
//     bio: string | null
//     place: number
//     likesCount: number
//     dislikesCount: number
//     commentsCount: number
//     materialsCount: number
//     reviewsCount: number
//     quotesCount: number
//     score: number
// }
async function createUsers() {
    function generateImage() {
        return {
            id: faker.datatype.uuid(),
            tag: "avatar",
            filename: faker.system.fileName(),
            url: faker.internet.url(),
            altUrl: faker.internet.url(),
        }
    }

    const images = Array.from({length: 500}, generateImage).sort((a, b) => a.id > b.id ? 1 : -1);

    await prisma.file.createMany({
        data: images
    });

    const imageIds = images.map(image => image.id);

    // generate faker user
    function generateUser() {
        return {
            bio: faker.lorem.sentence(),
            commentsCount: faker.datatype.number({
                'min': 0,
                'max': 50
            }),
            createdAt: faker.date.past(),
            deletedAt: null,
            dislikesCount: faker.datatype.number({
                'min': 0,
                'max': 50
            }),
            email: null,
            emailVerified: null,
            id: faker.datatype.uuid(),
            imageId: faker.datatype.boolean() ? faker.helpers.arrayElement(imageIds) : null,
            likesCount: faker.datatype.number({
                'min': 0,
                'max': 50
            }),
            materialsCount: faker.datatype.number({
                'min': 0,
                'max': 50
            }),
            nickname: faker.internet.userName(),
            place: faker.datatype.number({
                'min': 1,
                'max': 100
            }),
            quotesCount: faker.datatype.number({
                'min': 0,
                'max': 50
            }),
            rating: faker.datatype.number({
                'min': 0,
                'max': 100
            }),
            reviewsCount: faker.datatype.number({
                'min': 0,
                'max': 50
            }),
            role: 'user',
            score: faker.datatype.number({
                'min': 0,
                'max': 100
            }),
            updatedAt: faker.date.past(),
        }
    }

    // generate 10 users
    const users: User[] = Array.from({length: 10}, generateUser);


    await prisma.user.createMany({
        data: users
    });

    // const result = await supertest(server)
    //     .get('/api/v1/top')
    //     .expect(200)
    //     .expect('Content-Type', /json/);
    // expect(result.body).toBeDefined();
    // expect(result.body).toEqual(users)

    return {
        usersWithImages: users.map((el, index) => {
            let res
            if (el.imageId !== null) {
                const image = images.find(img => img.id === el.imageId)
                if (image === undefined) throw new Error("Image not found")
                res = {
                    ...el,
                    image: {
                        url: image.url,
                    }
                }
            } else {
                res = {...el, image: null}
            }
            // @ts-ignore
            delete res.imageId
            // @ts-ignore
            delete res.email
            // @ts-ignore
            delete res.emailVerified
            // @ts-ignore
            delete res.createdAt
            // @ts-ignore
            delete res.deletedAt
            // @ts-ignore
            delete res.score
            // @ts-ignore
            delete res.updatedAt
            return res
        }), users, imageIds
    }
}

describe('[GET] /api/v1/users/{id}', () => {

    it('Test get one', async () => {
        const {usersWithImages, users} = await createUsers();
        const promises = users.map(el => trpc.users.getOne({id: el.id}))
        const apiUsers = await Promise.all(promises)

        expect(apiUsers).toEqual(usersWithImages)

        await expect(trpc.users.getOne({id: '123'})).rejects.toThrowError(TRPCError) // uuid in not valid
        await expect(trpc.users.getOne({id: faker.datatype.uuid()})).rejects.toThrowError(TRPCError) // not found
    });
});

describe('[PUT] /api/v1/users', () => {
    it('Test create new', async () => {
        const {usersWithImages, users, imageIds} = await createUsers();
        const newUser = {
            nickname: "PotatoHD",
            bio: faker.lorem.sentence(15),
            image: faker.helpers.arrayElement(imageIds)
        }
        // noinspection TypeScriptValidateJSTypes
        const res = await trpc.users.edit({
            csrfToken: "123",
            recaptchaToken: "123",
            nickname: newUser.nickname,
            bio: newUser.bio,
            image: newUser.image
        });

        expect(res).toEqual({ok: true})

        const user = await prisma.user.findFirst({
            where: {
                nickname: newUser.nickname
            },
            select: {
                bio: true,
                nickname: true,
                imageId: true
            }
        })
        const usersCount = await prisma.user.count()

        expect(usersCount).toEqual(users.length + 1)

        expect(user).toEqual({
            bio: newUser.bio,
            nickname: newUser.nickname,
            imageId: newUser.image
        })
    });

    it('Edit user nickname + bio', async () => {

    });

    it('Edit user image', async () => {

    });
});
