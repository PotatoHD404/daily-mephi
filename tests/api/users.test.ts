import type {User} from "@prisma/client";
import {faker} from '@faker-js/faker';
import {isAuthorizedFunc} from "./mocks/isAuthorized";
import {verifyCSRFTokenFunc} from "./mocks/verifyCSRFToken";
import "./mocks/verifyRecaptcha";
import {trpc} from "./mocks/trpc"; // order matters
import {inferProcedureInput, TRPCError} from "@trpc/server";
import {prisma} from "./utils/prisma";
import {verifyRecaptchaFunc} from "./mocks/verifyRecaptcha";
import {AppRouter} from "../../server";
import {createUsers} from "./utils/createUsers";
import {describe, it, expect, jest} from '@jest/globals';

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

// Helper function to generate input data for the edit function
function generateEditInput(): inferProcedureInput<AppRouter["users"]["edit"]> {
    return {
        nickname: faker.internet.userName(),
        bio: faker.lorem.sentence(15),
        image: faker.datatype.uuid(),
        csrfToken: '123',
        recaptchaToken: '123'
    };
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

    it('Edit user image', async () => {
        const {users, imageIds} = await createUsers();
        const currUser = faker.helpers.arrayElement(users);

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            return next({
                ctx: {
                    user: {
                        id: currUser.id,
                        nickname: currUser.nickname,
                        imageId: currUser.imageId,
                    },
                },
            })
        });

        const newImageId = faker.helpers.arrayElement(imageIds);

        const imageData: inferProcedureInput<AppRouter["users"]["edit"]> = {
            nickname: currUser.nickname || '', // replace null with empty string
            bio: currUser.bio || '', // replace null with empty string
            image: newImageId, // rename image to imageId
            csrfToken: '123',
            recaptchaToken: '123'
        };

        const res = await trpc.users.edit(imageData);
        expect(res).toEqual({ok: true});

        const updatedUser = await prisma.user.findUnique({where: {id: currUser.id}});
        expect(updatedUser?.imageId).toEqual(newImageId);
    });

    it('Edit user image wrong id', async () => {
        const {users} = await createUsers();
        const currUser = faker.helpers.arrayElement(users);

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            return next({
                ctx: {
                    user: {
                        id: currUser.id,
                        nickname: currUser.nickname,
                        imageId: currUser.imageId,
                    },
                },
            })
        });

        const wrongImageId = faker.datatype.uuid();

        const imageData: inferProcedureInput<AppRouter["users"]["edit"]> = {
            nickname: currUser.nickname || undefined,
            bio: currUser.bio || undefined,
            image: wrongImageId,
            csrfToken: '123',
            recaptchaToken: '123'
        };

        await expect(trpc.users.edit(imageData)).rejects.toThrowError(TRPCError);
    });

    it('Edit user image null', async () => {
        const {users} = await createUsers();
        const currUser = faker.helpers.arrayElement(users);

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            return next({
                ctx: {
                    user: {
                        id: currUser.id,
                        nickname: currUser.nickname,
                        imageId: currUser.imageId,
                    },
                },
            })
        });

        const imageData: inferProcedureInput<AppRouter["users"]["edit"]> = {
            nickname: currUser.nickname || undefined,
            bio: currUser.bio || undefined,
            csrfToken: '123',
            recaptchaToken: '123'
        };

        const res = await trpc.users.edit(imageData);
        expect(res).toEqual({ok: true});

        const updatedUser = await prisma.user.findUnique({where: {id: currUser.id}});
        expect(updatedUser?.imageId).toBeNull();
    });

    it('Edit user bio/nickname toxic', async () => {
        const {users} = await createUsers();
        const currUser = faker.helpers.arrayElement(users);

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            return next({
                ctx: {
                    user: {
                        id: currUser.id,
                        nickname: currUser.nickname,
                        imageId: currUser.imageId,
                    },
                },
            })
        });

        let toxicData: inferProcedureInput<AppRouter["users"]["edit"]> = {
            nickname: "Gnida",
            bio: "Bio",
            csrfToken: '123',
            recaptchaToken: '123'
        };

        await expect(trpc.users.edit(toxicData)).rejects.toThrowError(TRPCError);

        //

        toxicData = {
            nickname: "Nickname",
            bio: "Чертила блiн",
            csrfToken: '123',
            recaptchaToken: '123'
        };

        await expect(trpc.users.edit(toxicData)).rejects.toThrowError(TRPCError);
    });

    it('Edit user nickname duplicate', async () => {
        const {users} = await createUsers();
        const currUser = faker.helpers.arrayElement(users);
        const duplicateNickname = faker.helpers.arrayElement(users).nickname;

        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            return next({
                ctx: {
                    user: {
                        id: currUser.id,
                        nickname: currUser.nickname,
                        imageId: currUser.imageId,
                    },
                },
            })
        });

        const duplicateData: inferProcedureInput<AppRouter["users"]["edit"]> = {
            nickname: duplicateNickname || undefined,
            bio: faker.lorem.sentence(15),
            csrfToken: '123',
            recaptchaToken: '123'
        };

        await expect(trpc.users.edit(duplicateData)).rejects.toThrowError(TRPCError);
    });

    it('Auth error', async () => {
        isAuthorizedFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            throw new Error('Auth error')
        });

        await expect(trpc.users.edit(generateEditInput())).rejects.toThrowError(Error);
    });

    it('CSRF token wrong/missing', async () => {
        verifyCSRFTokenFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            throw new Error('CSRF token wrong/missing')
        });

        await expect(trpc.users.edit(generateEditInput())).rejects.toThrowError(Error);
    });

    it('Recaptcha token wrong/missing', async () => {
        verifyRecaptchaFunc.mockImplementation(async ({ctx: {req, res}, next}) => {
            throw new Error('recaptcha token wrong/missing')
        });

        await expect(trpc.users.edit(generateEditInput())).rejects.toThrowError(Error);
    });
});
