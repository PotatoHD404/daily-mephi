import {z} from 'zod';
import {t} from 'server/trpc';
import {TRPCError} from "@trpc/server";
import {isAuthorized} from "../middlewares/isAuthorized";
import {verifyCSRFToken} from "../middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "../middlewares/verifyRecaptcha";
import {isToxic} from "lib/toxicity";
import {getDocument} from "lib/database/fullTextSearch";


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
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const user = await prisma.user.findUnique({
                where: {
                    id
                },
                select: {
                    nickname: true,
                    id: true,
                    image: {
                        select: {
                            url: true,
                        }
                    },
                    rating: true,
                    role: true,
                    likesCount: true,
                    dislikesCount: true,
                    materialsCount: true,
                    reviewsCount: true,
                    quotesCount: true,
                    bio: true,
                    commentsCount: true,
                    place: true,
                }
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
        .output(z.any())
        .use(isAuthorized)
        // .use(verifyCSRFToken)
        // .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {nickname, image: imageId, bio}}) => {
            // check if nickname is toxic
            if (nickname && await isToxic(nickname)) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Nickname is toxic'
                });
            }
            // check if bio is toxic
            if (bio && await isToxic(bio)) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Bio is toxic'
                });
            }
            return await prisma.$transaction(async (prisma) => {
                await Promise.all([
                    async () => {
                        if (nickname) {
                            const user = await prisma.user.findUnique({where: {nickname}});
                            if (user && user.id !== user.id) {
                                throw new TRPCError({
                                    code: 'BAD_REQUEST',
                                    message: 'Nickname is already taken'
                                });
                            }
                        }
                    }, async () => {
                        if (imageId) {
                            const user = await prisma.user.findFirst({where: {imageId: imageId}});
                            if (user && user.id !== user.id) {
                                throw new TRPCError({
                                    code: 'BAD_REQUEST',
                                    message: 'Image already taken'
                                });
                            }
                        }
                    }]);
                await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            nickname,
                            image: imageId ? {connect: {id: imageId}} : undefined,
                            bio,
                        }
                    }
                )
                // update or create document
                let text = nickname + ' ' + bio;
                const docContent = getDocument(text);
                await prisma.document.upsert({
                    where: {
                        userId: user.id
                    },
                    create: {
                        userId: user.id,
                        text,
                        ...docContent
                    },
                    update: {text, ...docContent}
                });
                // TODO: update search index


                return {ok: true};
            });
        })
});
