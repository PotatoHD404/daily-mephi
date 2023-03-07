import {z} from 'zod';
import {t} from 'server/trpc';
import {isAuthorized} from "../middlewares/isAuthorized";
import {TRPCError} from "@trpc/server";
import {verifyCSRFToken} from "../middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "../middlewares/verifyRecaptcha";
import {Comment} from "@prisma/client";


export const commentsRouter = t.router({
    getOne: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/comments/{type}/{id}/{comment_id}'
        }
    })
        .input(z.object({
            type: z.enum(["news", "material", "review"]),
            id: z.string().uuid(),
            comment_id: z.string().uuid()
        }))
        .output(z.any())
        .query(({ctx: {prisma}, input: {id, type, comment_id: commentId}}) => {
            return prisma.comment.findUnique({
                where: {
                    [`${type}Id`]: id,
                    id: commentId
                },
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    parentId: true,
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
    getAll: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/comments/{type}/{id}'
        }
    })
        .input(z.object({
            type: z.enum(["news", "material", "review"]),
            id: z.string().uuid()
        }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {id, type}}) => {
            let comments: {
                id: string,
                text: string,
                createdAt: Date,
                parentId: string | null,
                userId: string,
                path: string[],
                childrenCount: bigint | number
            }[] = await prisma.$queryRaw`
                WITH results as (WITH RECURSIVE cte (id, text, "createdAt", "parentId", "userId", "likes", "dislikes",
                                                     "path")
                                                    AS (SELECT id,
                                                               text,
                                                               "createdAt",
                                                               "parentId",
                                                               "userId",
                                                               "likes",
                                                               "dislikes",
                                                               array [id] AS path
                                                        FROM "Comment"
                                                        WHERE "Comment"."parentId" IS NULL
                                                          AND "Comment"."${type}Id" = ${id}
                                                        UNION ALL
                                                        SELECT c.id,
                                                               c.text,
                                                               c."createdAt",
                                                               c."parentId",
                                                               c."userId",
                                                               c."likes",
                                                               c."dislikes",
                                                               cte.path || c.id
                                                        FROM "Comment" c
                                                                 INNER JOIN cte
                                                                            ON c."parentId" = cte.id)
                                 SELECT cte.id,
                                        cte.text,
                                        cte."createdAt",
                                        cte."parentId",
                                        cte."userId",
                                        cte."likes",
                                        cte."dislikes",
                                        count(cte2.id) as "childrenCount"
                                 FROM cte
                                          LEFT JOIN public."User"
                                                    ON
                                                        "User"."id" = cte."userId"
                                          LEFT JOIN cte cte2
                                                    ON
                                                        cte.id = ANY (cte2.path) AND cte2."id" != cte."id"
                                 GROUP BY cte.id, cte.text, cte."createdAt", cte."parentId", cte."userId", cte.path,
                                          cte."likes", cte."dislikes"
                                 ORDER BY "childrenCount" DESC
                                 LIMIT 10)
                SELECT results.*, IF(COUNT(results2.id) > 0, ARRAY_AGG(DISTINCT results2.id), '{}') as "directChildren"
                from results
                         LEFT JOIN results AS results2
                                   ON
                                       results2."parentId" = results.id
                GROUP BY results.id, results.text, results."createdAt", results."parentId", results."userId",
                         results.likes,
                         results.dislikes,
                         results."childrenCount";
            `

            comments = comments.map(comment => {
                comment.childrenCount = Number(comment.childrenCount);
                return comment;
            });
            return comments;
        }),
    create: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/comments/{type}/{id}',
            protect: true
        }
    })
        .input(z.object({
            type: z.enum(["news", "material", "review"]),
            id: z.string().uuid(),
            text: z.string(),
            parentId: z.string().uuid().optional(),
            csrfToken: z.string(),
            recaptchaToken: z.string()
        }))
        .output(z.any())
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {id, type, text, parentId}}) => {

            let typeMapping: Record<string, any> = {
                review: prisma.review,
                material: prisma.material,
                news: prisma.news
            };


            return await prisma.$transaction(async (prisma) => {
                let parentComment: Comment | null;
                let path: string[] = [];
                if (parentId) {
                    parentComment = await prisma.comment.findFirst({where: {id: parentId}});
                    if (!parentComment) {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: 'Parent comment not found'
                        });
                    }

                    await prisma.comment.updateMany({
                        where: {
                            // path contains parent comment id
                            path: {
                                has: parentId
                            }
                        },
                        data: {
                            commentsCount: {
                                increment: 1
                            }
                        }
                    })
                    path = parentComment.path;
                }
                await typeMapping[type].update({
                    where: {
                        id
                    },
                    data: {
                        commentsCount: {
                            increment: 1
                        }
                    }
                });
                const comment = await prisma.comment.create({
                    data: {
                        text,
                        [type]: {
                            connect: {
                                id,
                            }
                        },
                        parent: parentId ? {
                            connect: {
                                id: parentId,
                            }
                        } : undefined,
                        user: {
                            connect: {
                                id: user.id
                            }
                        },
                    }
                });
                path.push(comment.id);
                await prisma.comment.update({
                    where: {
                        id: comment.id
                    },
                    data: {
                        path
                    }
                });
            }, {
                isolationLevel: "Serializable"
            });
        }),

});
