import {z} from 'zod';
import {t} from 'server/utils';
import {isAuthorized} from "server/middlewares/isAuthorized";
import {TRPCError} from "@trpc/server";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";
import {Comment, Prisma} from "@prisma/client";
import {uuidv4} from "msw/lib/core/utils/internal/uuidv4";
import {DefaultArgs} from "@prisma/client/runtime/library";


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
        /* .output(z.any()) */
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
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}, input: {id, type}}) => {
            let comments: {
                id: string
                text: string,
                createdAt: Date,
                parentId: string | null,
                userId: string,
                path: string[],
                childrenCount: bigint | number
            }[] = await prisma.$queryRaw`
                WITH RECURSIVE cte AS (SELECT id,
                                                               text,
                                                               "created_at",
                                                               "parentId",
                                                               "userId",
                                                               "likesCount",
                                                               "dislikesCount",
                                                               "commentsCount"
                                                               array [id] AS path
                                                        FROM "Comment"
                                                        WHERE "Comment"."parentId" IS NULL
                                                          AND "Comment"."${type}Id" = ${id}
                                                        UNION ALL
                                                        SELECT c.id,
                                                               c.text,
                                                               c."created_at",
                                                               c."parent_id",
                                                               c."userId",
                                                               c."likes_count",
                                                               c."dislikes_count",
                                                               c."commentsCount",
                                                               cte.path || c.id
                                                        FROM "comments" c
                                                                 INNER JOIN cte
                                                                            ON c."parentId" = cte.id)
                                 SELECT cte.id,
                                        cte.text,
                                        cte."created_at",
                                        cte."parent_id",
                                        cte."user_id",
                                        cte."likes_count",
                                        cte."dislikes_count",
                                        cte."childrenCount"
                                 FROM cte
                                          LEFT JOIN public."users"
                                                    ON
                                                        "User"."id" = cte."userId"
                                 ORDER BY "likes_count", "childrenCount" DESC
                                 LIMIT 10;
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
        /* .output(z.any()) */
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {id: recordId, type, text, parentId}}) => {
            return prisma.$transaction(async (prisma) => {
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
                const id = uuidv4();
                path.push(id);
                const table = prisma[type] as Prisma.NewsDelegate<DefaultArgs>;

                const [comment] = await Promise.all([
                    prisma.comment.create({
                        data: {
                            id,
                            text,
                            path,
                            [type]: {
                                connect: {
                                    id: recordId,
                                },
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
                    }),
                    table.update({
                        where: {
                            id: recordId
                        },
                        data: {
                            commentsCount: {
                                increment: 1
                            }
                        }
                    })]);
                return comment;
            }, {
                isolationLevel: "Serializable"
            });
        }),

});
