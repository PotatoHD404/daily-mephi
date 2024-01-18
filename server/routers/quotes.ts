import {z} from 'zod';
import {t} from 'server/utils';
import {TRPCError} from "@trpc/server";
import {isAuthorized} from "server/middlewares/isAuthorized";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";


export const quotesRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/quotes/{id}',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const quote = await prisma.quote.findUnique({
                where: {id},
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                            image: {select: {url: true}}
                        }
                    },
                    likesCount: true,
                    dislikesCount: true,
                },
            });
            if (!quote) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Quote not found'
                });
            }
            return quote;
        }),
    getFromTutor: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutors/{id}/quotes',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}, input: {id}}) => {
            return prisma.quote.findMany({
                where: {tutorId: id},
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                            image: true,
                        }
                    },
                    likesCount: true,
                    dislikesCount: true
                },
                take: 10,
                orderBy: {createdAt: 'desc'}
            });
        }),
    addToTutor: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/tutors/{id}/quotes',
            protect: true
        }
    })
        .input(z.object({
            id: z.string().uuid(),
            text: z.string(),
            csrfToken: z.string(),
            recaptchaToken: z.string()
        }))
        /* .output(z.any()) */
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {id: tutorId, text}}) => {
            return prisma.$transaction(async (prisma) => {
                const [quote] = await Promise.all([
                    prisma.quote.create({
                        data: {
                            text,
                            user: {
                                connect: {id: user.id}
                            },
                            tutor: {
                                connect: {id: tutorId}
                            },
                            document: {
                                create: {
                                    type: "quote",
                                    text,
                                }
                            }
                        },
                    }),
                    prisma.tutor.update({
                        where: {id: tutorId},
                        data: {
                            quotesCount: {
                                increment: 1
                            }
                        }
                    }),
                    prisma.user.update({
                        where: {id: user.id},
                        data: {
                            quotesCount: {
                                increment: 1
                            }
                        }
                    })]);
                return quote;
            });
        }),
});
