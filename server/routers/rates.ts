import {z} from 'zod';
import {t} from 'server/utils';
import {isAuthorized} from "server/middlewares/isAuthorized";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";
import {TRPCError} from "@trpc/server";


export const ratesRouter = t.router({
    getFromTutor: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutor/{id}/rates',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}, input: {id}}) => {
            return prisma.rate.findMany({
                where: {tutorId: id},
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            nickname: true,
                            image: true,
                        }
                    }
                }
            });
        }),
    addToTutor: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/tutor/{id}/rates',
            protect: true
        }
    })
        .input(z.object({
            id: z.string().uuid(),
            personality: z.number().int().min(0).max(10),
            punctuality: z.number().int().min(0).max(10),
            exams: z.number().int().min(0).max(10),
            quality: z.number().int().min(0).max(10),
            csrfToken: z.string(),
            recaptchaToken: z.string(),
        }))
        /* .output(z.any()) */
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {id: tutorId, personality, punctuality, exams, quality}}) => {
            try {
                return await prisma.$transaction(async (prisma) => {
                    const rate = await prisma.rate.create({
                        data: {
                            personality,
                            punctuality,
                            exams,
                            quality,
                            user: {
                                connect: {id: user.id}
                            },
                            tutor: {
                                connect: {id: tutorId}
                            }
                        }
                    });
                    await prisma.tutor.update({
                        where: {id: tutorId},
                        data: {
                            rates: {
                                connect: {id: rate.id}
                            }
                        }
                    });
                    return rate;
                });
            } catch (e: any) {
                if (e.code === 'P2002') {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'You have already rated this tutor'
                    });
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e.message
                });
            }
        }),
});
