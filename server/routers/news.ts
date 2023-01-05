import {z} from 'zod';
import {t} from 'lib/trpc';
import {TRPCError} from "@trpc/server";


export const newsRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/news/{id}',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id}}) => {
            const news = prisma.news.findUnique({
                where: {
                    id
                },
                select: {
                    title: true,
                    text: true,
                    createdAt: true,
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true
                }
            });
            if (!news) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'News not found'
                });
            }
            return news;
        }),
    getAll: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/news',
        }
    })
        .input(z.void())
        .output(z.any())
        .query(async ({ctx: {prisma}}) => {
            return prisma.news.findMany({
                select: {
                    title: true,
                    text: true,
                    createdAt: true,
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true
                },
                take: 10,
            });
        })

});
