import {z} from 'zod';
import {t} from 'lib/trpc';
import {TRPCError} from "@trpc/server";
import {isAuthorized} from "../middlewares/isAuthorized";
import {verifyCSRFToken} from "../middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "../middlewares/verifyRecaptcha";
import {getDocument} from "../../lib/database/fullTextSearch";
import {Prisma} from "@prisma/client";



export const reviewsRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/reviews/{id}',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const review = await prisma.review.findUnique({
                where: {id},
                select: {
                    id: true,
                    title: true,
                    text: true,
                    createdAt: true,
                    legacyNickname: true,
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                            image: {select: {url: true}}
                        }
                    },
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true,
                },
            });
            if (!review) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Review not found'
                });
            }
            return review;
        }),
    getFromTutor: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutors/{id}/reviews',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
            take: z.number().default(10),
            cursor: z.string().optional(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id, take, cursor}}) => {
                return await prisma.review.findMany({
                    where: {tutorId: id},
                    select: {
                        id: true,
                        title: true,
                        text: true,
                        createdAt: true,
                        legacyNickname: true,
                        user: {
                            select: {
                                id: true,
                                nickname: true,
                                image: {select: {url: true}}
                            }
                        },
                        likesCount: true,
                        dislikesCount: true,
                        commentsCount: true,
                    },
                    take,
                    cursor: cursor ? {id: cursor} : undefined,
                    orderBy: {createdAt: 'desc'},
                });
            }
        ),
    addToTutor: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/tutors/{id}/reviews',
            protect: true
        }
    })
        .input(z.object({
            id: z.string().uuid(),
            title: z.string().min(1).max(100),
            text: z.string().min(1).max(10000),
            csrfToken: z.string(),
            recaptchaToken: z.string(),
        }))
        .output(z.any())
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {id: tutorId, title, text}}) => {
            try {
                return await prisma.$transaction(async (prisma) => {

                    const review = await prisma.review.create({
                        data: {
                            text,
                            title,
                            user: {
                                connect: {id: user.id}
                            },
                            tutor: {
                                connect: {id: tutorId}
                            }
                        },
                    });
                    await prisma.tutor.update({
                        where: {id: tutorId},
                        data: {
                            reviewsCount: {
                                increment: 1
                            }
                        }
                    });
                    await prisma.user.update({
                        where: {id: user.id},
                        data: {
                            reviewsCount: {
                                increment: 1
                            }
                        }
                    });
                    await prisma.document.create({
                        data: {
                            type: "review",
                            ...getDocument(text + ' ' + title),
                        }
                    });

                    return review;
                });
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: 'You already reviewed this tutor'
                        });
                    }
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: e.message
                    });
                }
            }
        })
});
