import {z} from 'zod';
import {t} from 'server/utils';
import {isAuthorized} from "server/middlewares/isAuthorized";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";
import {Prisma} from ".prisma/client";
import {DefaultArgs} from "@prisma/client/runtime/library";
import {TRPCError} from "@trpc/server";

// type PrismaModelClient = Prisma.Prisma__QuoteClient<any> | Prisma.Prisma__ReviewClient<any> | Prisma.Prisma__MaterialClient<any> | Prisma.Prisma__CommentClient<any> | Prisma.Prisma__NewsClient<any>;
// interface TypeMap {
//     quote: Prisma.QuoteDelegate<DefaultArgs>;
//     review: Prisma.ReviewDelegate<DefaultArgs>;
//     material: Prisma.MaterialDelegate<DefaultArgs>;
//     comment: Prisma.CommentDelegate<DefaultArgs>;
//     news: Prisma.NewsDelegate<DefaultArgs>;
// }


// type TypeMap = {
//     quote: Prisma.QuoteDelegate<DefaultArgs>,
//     review: Prisma.ReviewDelegate<DefaultArgs>,
//     material: Prisma.MaterialDelegate<DefaultArgs>,
//     comment: Prisma.CommentDelegate<DefaultArgs>,
//     news: Prisma.NewsDelegate<DefaultArgs>
// };

type TargetTypes = "quote" | "review" | "material" | "comment" | "news";
export const reactionsRouter = t.router({
    change: t.procedure.meta({
        openapi: {
            method: 'PUT',
            path: '/reactions',
            protect: true
        }
    })
        .input(z.object({
                type: z.enum(['like', 'dislike', 'unlike']),
                targetId: z.string().uuid(),
                targetType: z.enum(['comment', 'quote', 'material', 'review', 'news']),
                csrfToken: z.string(),
                recaptchaToken: z.string()
            }
        ))
        /* .output(z.any()) */
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {type, targetId, targetType}}) => {
            return prisma.$transaction(async (prisma) => {
                    const typeMap = {
                        "quote": prisma.quote,
                        "review": prisma.review,
                        "material": prisma.material,
                        "comment": prisma.comment,
                        "news": prisma.news
                    }
                    const fkId = `${targetType}Id` as const;
                    const table = typeMap[targetType] as Prisma.QuoteDelegate<DefaultArgs>;
                    let record = await table.findUniqueOrThrow({
                        where: {id: targetId},
                        select: {
                            likesCount: true,
                            dislikesCount: true
                        },
                    }).catch(() => {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: `Not found ${targetType} with id ${targetId}`
                        });
                    });

                    let likeRecord = await prisma.reaction.findFirst({
                        where: {
                            user: {
                                id: user.id
                            },
                            [fkId]: targetId

                        },
                        select: {
                            id: true,
                            like: true
                        }
                    });


                    if (!likeRecord && type === "unlike") {
                        return record;
                    } else if (likeRecord && type === "unlike") {
                        let action = {
                            [likeRecord.like ? "likesCount" : "dislikesCount"]: {
                                decrement: 1
                            }
                        };
                        return await Promise.all([
                            prisma.reaction.delete({
                                where: {
                                    id: likeRecord.id
                                }
                            }),
                            prisma.user.update({
                                where: {id: user.id},
                                data: action
                            }),
                            table.update({
                                where: {id: targetId},
                                data: action,
                                select: {
                                    likesCount: true,
                                    dislikesCount: true
                                }
                            })]).then((values) => values[2]);
                    } else {
                        let action: { [x: string]: { decrement: number; } | { increment: number; } | { update: { score: { [x: string]: number; }; }; }; };
                        let promise: Promise<any>;
                        if (likeRecord?.like === (type === "like") || !likeRecord?.like === (type === "dislike")) {
                            return record;
                        }
                        if (likeRecord) {
                            action = {
                                [likeRecord.like ? "likesCount" : "dislikesCount"]: {
                                    decrement: 1
                                },
                                [likeRecord.like ? "dislikesCount" : "likesCount"]: {
                                    increment: 1
                                }
                            };
                            promise = prisma.reaction.update({
                                where: {
                                    id: likeRecord.id
                                },
                                data: {
                                    like: type === "like"
                                }
                            });
                        } else {
                            promise = prisma.reaction.create({
                                data: {
                                    user: {
                                        connect: {
                                            id: user.id
                                        }
                                    },
                                    [targetType]: {
                                        connect: {
                                            id: targetId
                                        }
                                    },
                                    like: type === "like"
                                }
                            });
                            action = {
                                [type === "like" ? "likesCount" : "dislikesCount"]: {
                                    increment: 1
                                }
                            };
                        }
                        if (targetType === "comment") {
                            action = {
                                ...action,
                                comment: {
                                    update: {
                                        score: {
                                            [type === "like" ? "increment" : "decrement"]: 1
                                        }
                                    }
                                }
                            }
                        }
                        return await Promise.all([
                            promise,
                            prisma.user.update({
                                where: {
                                    id: user.id
                                },
                                data: action
                            }),
                            table.update({
                                where: {id: targetId},
                                data: action,
                                select: {
                                    likesCount: true,
                                    dislikesCount: true
                                }
                            })
                        ]).then((values) => values[2]);
                    }
                },
                {
                    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
                });

        })
});
