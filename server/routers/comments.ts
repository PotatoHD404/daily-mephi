import {z} from 'zod';
import {t} from 'server/utils';
import {isAuthorized} from "server/middlewares/isAuthorized";
import {TRPCError} from "@trpc/server";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";
import {Comment as DefaultComment, Prisma, PrismaClient} from "@prisma/client";
import {DefaultArgs} from "@prisma/client/runtime/library";


type AdditionalSearchType = {} | { path: { has: string }, depth: { gte: number } }
const getComments = async (prisma: PrismaClient, type: "news" | "material" | "review", recordId: string, additionalSearch: AdditionalSearchType, limit: number, offset: number) =>
    prisma.comment.findMany({
        where: {
            type,
            recordId,
            ...additionalSearch
        },
        select: {
            id: true,
            text: true,
            createdAt: true,
            parentId: true,
            commentsCount: true,
            likesCount: true,
            dislikesCount: true,
            path: true,
            depth: true,
            user: {
                select: {
                    id: true,
                    nickname: true,
                    image: {
                        select: {
                            url: true
                        }
                    }
                }
            },
        },
        orderBy: {
            score: 'desc'
        },
        take: limit,
        skip: offset
    });

type Comment = Awaited<ReturnType<typeof getComments>>[0]
type CommentMapType = { children: CommentMapType[], comment: Comment | null }

export function buildCommentTree(comments: Comment[]): CommentMapType[] {

    const commentMap: { [key: string]: CommentMapType } = {};

    // Initialize the map and create a children container for each comment
    comments.forEach(comment => {
        commentMap[comment.id] = {comment, children: []};
    });
    // ids that are in path but not commentIds and filter by commentMap keys
    const parentIds = comments.flatMap(comment => comment.path.slice(0, -1)).filter(id => !(id in commentMap));
    parentIds.forEach(id => {
        commentMap[id] = {comment: null, children: []};
    });
    const rootComments: CommentMapType[] = [];

    comments.forEach(comment => {
        if (comment.parentId) {
            // If it has a parentId, it's a child comment, add it to the parent's children array
            commentMap[comment.parentId].children.push(commentMap[comment.id]);
        } else {
            // If it doesn't have a parentId, it's a root comment
            rootComments.push(commentMap[comment.id]);
        }
    });
    return rootComments;
}

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
        .query(({ctx: {prisma}, input: {id: recordId, type, comment_id: commentId}}) => {
            return prisma.comment.findUnique({
                where: {
                    type,
                    recordId,
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
            id: z.string().uuid(),
            parentId: z.string().uuid().nullish().default(null),
            limit: z.number().int().min(1).max(100).default(20),
            offset: z.number().int().min(0).default(0),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}, input: {id: recordId, type, parentId, limit, offset}}) => {
            let additionalSearch: AdditionalSearchType = {};
            if (parentId) {
                const parentComment = await prisma.comment.findUnique({
                    where: {
                        type,
                        recordId,
                        id: parentId
                    },
                    select: {
                        depth: true
                    }
                });
                if (!parentComment) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Parent comment not found'
                    });
                }
                let depth = parentComment.depth;
                additionalSearch = {
                    path: {
                        has: parentId
                    },
                    depth: {
                        gte: depth
                    }
                }
            }
            let comments = await getComments(prisma, type, recordId, additionalSearch, limit, offset);

            return buildCommentTree(comments);

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
                let parentComment: DefaultComment | null;
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
                            type,
                            recordId,
                            depth: {
                                lte: parentComment.depth
                            },
                            path: {
                                has: parentId
                            }
                        },
                        data: {
                            commentsCount: {
                                increment: 1
                            },
                            score: {
                                increment: 1
                            }
                        }
                    })
                    path = parentComment.path;
                }
                const id = crypto.randomUUID()
                path.push(id);
                const table = prisma[type] as Prisma.NewsDelegate<DefaultArgs>;

                const [comment] = await Promise.all([
                    prisma.comment.create({
                        data: {
                            id,
                            text,
                            path,
                            type,
                            depth: path.length,
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
