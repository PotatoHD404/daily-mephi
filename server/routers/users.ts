import {z} from 'zod';
import {t} from 'server/utils';
import {TRPCError} from "@trpc/server";
import {isAuthorized} from "server/middlewares/isAuthorized";
import {isToxic} from "lib/toxicity";
import {selectUser} from "../../lib/auth/nextAuthOptions";


export const usersRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/users/{id}',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const user = await prisma.user.findUnique({
                where: {
                    id
                },
                ...selectUser
            });
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found'
                });
            }
            return user;
        }),
    edit: t.procedure.meta({
        openapi: {
            method: 'PUT',
            path: '/users',
            protect: true,
        }
    })
        .input(z.object({
            nickname: z.string().regex(/^[a-zA-Z0-9_]{3,30}$/, {message: 'Nickname must be 3-30 characters long and contain only letters, numbers and underscores'}).optional(),
            image: z.string().uuid().optional(),
            bio: z.string().max(150, {message: 'Bio must be 150 characters or less'}).optional(),
            csrfToken: z.string(),
            recaptchaToken: z.string(),
        }))
        /* .output(z.any()) */
        .use(isAuthorized)
        // .use(verifyCSRFToken)
        // .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {nickname, image: imageId, bio}}) => {
            // check if nickname is toxic
            if (nickname && (await isToxic(nickname))) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Никнейм токсичен'
                });
            }
            // check if bio is toxic
            if (bio && (await isToxic(bio))) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Био токсично'
                });
            }

            return prisma.$transaction(async (prisma: any) => {
                await Promise.all([
                    async () => {
                        if (nickname) {
                            const user = await prisma.user.findUnique({where: {nickname}});
                            if (user && user.id !== user.id) {
                                throw new TRPCError({
                                    code: 'BAD_REQUEST',
                                    message: 'Никнейм уже занят'
                                });
                            }
                        }
                    }, async () => {
                        if (imageId) {
                            const user = await prisma.user.findFirst({where: {imageId: imageId}});
                            if (user && user.id !== user.id) {
                                throw new TRPCError({
                                    code: 'BAD_REQUEST',
                                    message: 'Аватар уже занят'
                                });
                            }
                        }
                    }]);
                // console.log(user)
                const text = nickname + ' ' + bio;
                return await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            nickname,
                            image: imageId ? {connect: {id: imageId}} : undefined,
                            bio,
                            document: {
                                upsert: {
                                    create: {
                                        text,
                                    },
                                    update: {
                                        text,
                                    },
                                }
                            }
                        },
                        ...selectUser
                    }
                )
            }).catch((e: any) => {
                console.log(e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Ошибка сервера'
                });
            });
        })
});
