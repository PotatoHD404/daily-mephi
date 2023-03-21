import type {User} from "@prisma/client";
import {faker} from '@faker-js/faker';
import {isAuthorizedFunc} from "./mocks/isAuthorized";
import {verifyCSRFTokenFunc} from "./mocks/verifyCSRFToken";
import "./mocks/verifyRecaptcha";
import {trpc} from "./mocks/trpc"; // order matters
import {TRPCError} from "@trpc/server";
import {prisma} from "./utils/prisma";
import {verifyRecaptchaFunc} from "./mocks/verifyRecaptcha";


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

    const images = Array.from({length: 500}, generateImage).sort((a, b) => a.id.localeCompare(b.id));

    await prisma.file.createMany({
        data: images
    });

    const imageIds = images.map(image => image.id);

    // generate faker user
    function generateUser() {
        const res = {
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

        // remove selected image from array
        if (res.imageId !== null) {
            const index = imageIds.indexOf(res.imageId);
            if (index > -1) {
                imageIds.splice(index, 1);
            }
        }

        return res;
    }

    // generate 10 users
    const users: User[] = Array.from({length: 100}, generateUser);


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
    it('Edit user nickname + bio', async () => {
        const {usersWithImages, users, imageIds} = await createUsers();
        const currUser = faker.helpers.arrayElement(usersWithImages)

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {

            return next({
                ctx: {
                    user: {
                        id: currUser.id,
                        nickname: currUser.nickname,
                        image: currUser.image ? currUser.image.url : null,
                    },
                },
            })
        })
        // noinspection TypeScriptValidateJSTypes

        const newData = {
            nickname: "PotatoHD",
            bio: faker.lorem.sentence(15),
            csrfToken: '123',
            recaptchaToken: '123'
        }
        const res = await trpc.users.edit(newData);

        expect(res).toEqual({ok: true})

        const user = await prisma.user.findFirst({
            where: {
                nickname: newData.nickname
            },
            select: {
                bio: true,
                nickname: true,
                imageId: true,
            }
        })

        expect(user).toEqual({
            bio: newData.bio,
            nickname: newData.nickname,
            imageId: users.filter(el => el.id === currUser.id)[0].imageId,
        })
    });

    it('Edit user bio/nickname toxic', async () => {

    })

    it('Edit user nickname duplicate', async () => {

    });

    it('Edit user image', async () => {

    });

    it('Edit user image wrong id', async () => {

    })

    it('Edit user image null', async () => {

    })

    it('Auth error', async () => {

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            throw new Error('Auth error')
        })

        await expect(trpc.users.edit({
            nickname: faker.internet.userName(),
            bio: faker.lorem.sentence(15),
            csrfToken: '123',
            recaptchaToken: '123'
        })).rejects.toThrowError(Error)
    })

    it('CSRF token wrong/missing', async () => {
        verifyCSRFTokenFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            throw new Error('CSRF token wrong/missing')
        })

        await expect(trpc.users.edit({
            nickname: faker.internet.userName(),
            bio: faker.lorem.sentence(15),
            csrfToken: '123',
            recaptchaToken: '123'
        })).rejects.toThrowError(Error)
    })

    it('recaptcha token wrong/missing', async () => {
        verifyRecaptchaFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            throw new Error('recaptcha token wrong/missing')
        })

        await expect(trpc.users.edit({
            nickname: faker.internet.userName(),
            bio: faker.lorem.sentence(15),
            csrfToken: '123',
            recaptchaToken: '123'
        })).rejects.toThrowError(Error)
    })
});
