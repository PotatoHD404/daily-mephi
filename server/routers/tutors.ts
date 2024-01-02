import {z} from 'zod';
import {t} from 'server/utils';
import {TRPCError} from "@trpc/server";



export const tutorSelect = {
    id: true,
    shortName: true,
    fullName: true,
    images: {
        select: {
            url: true
        }
    },
    reviewsCount: true,
    quotesCount: true,
    materialsCount: true,
    legacyRating: {
        select: {
            personality: true,
            exams: true,
            quality: true,
            personalityCount: true,
            examsCount: true,
            qualityCount: true,
            ratingCount: true,
            avgRating: true
        }
    },
    rating: {
        select: {
            punctuality: true,
            exams: true,
            quality: true,
            personality: true,
            ratingCount: true,
            avgRating: true
        }
    }
};

export const tutorsRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutors/{id}',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const tutor = await prisma.tutor.findUnique({
                where: {
                    id
                },
                select: tutorSelect
            });
            if (!tutor) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Tutor not found'
                });
            }
            return tutor;
        }),
    getAll: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutors',
        }
    }).input(z.object({
            limit: z.number().int().default(10),
        }
    ))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {limit}}) => {
            return prisma.tutor.findMany({
                select: tutorSelect,
                take: limit,
            });
        }),
});
