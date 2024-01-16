import {z} from 'zod';
import {t} from 'server/utils';
import {isAuthorized} from "server/middlewares/isAuthorized";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";


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
                targetType: z.enum(['comment', 'quote', 'material', 'review']), // TODO: 'news',
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
                        "comment": prisma.comment
                    }
                    const fkId = `${targetType}Id`;
                    const table = typeMap[targetType];
                    const likeExists = await prisma.reaction.findFirst({
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
                    if (!likeExists && type === "unlike") {
                        return table.findUnique({
                            where: {id: targetId},
                            select: {
                                likes: true,
                                dislikes: true
                            }
                        });
                    }
                    if (likeExists && type === "unlike") {
                        await prisma.reaction.delete({
                            where: {
                                id: likeExists.id
                            }
                        });
                        await table.update({
                            where: {id: targetId},
                            data: {
                                [likeExists.like ? "likesCount" : "dislikesCount"]: {
                                    decrement: 1
                                }
                            }
                        });

                        await prisma.user.update({
                            where: {id: user.id},
                            data: {
                                [likeExists.like ? "likesCount" : "dislikesCount"]: {}
                            }
                        });
                    }
                    if (likeExists) {
                        if (likeExists.like === (type === "like") || !likeExists.like === (type === "dislike")) {
                            return table.findUnique({
                                where: {id: targetId},
                                select: {
                                    likes: true,
                                    dislikes: true
                                }
                            });
                        }
                        await prisma.reaction.update({
                            where: {
                                id: likeExists.id
                            },
                            data: {
                                like: type === "like"
                            }
                        });
                        await table.update({
                            where: {id: targetId},
                            data: {
                                [likeExists.like ? "likesCount" : "dislikesCount"]: {
                                    decrement: 1
                                },
                                [likeExists.like ? "dislikesCount" : "likesCount"]: {
                                    increment: 1
                                }
                            }
                        });

                        // update likes and dislikes
                        await prisma.user.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                [likeExists.like ? "likesCount" : "dislikesCount"]: {
                                    decrement: 1
                                },
                                [likeExists.like ? "dislikesCount" : "likesCount"]: {
                                    increment: 1
                                }
                            }
                        });
                    } else {
                        await prisma.reaction.create({
                            data: {
                                user: {
                                    connect: {
                                        id: user.id
                                    }
                                },
                                [type]: {
                                    connect: {
                                        id: targetId
                                    }
                                },
                                like: type === "like"
                            }
                        });
                        await table.update({
                            where: {id: targetId},
                            data: {
                                [type === "like" ? "likesCount" : "dislikesCount"]: {
                                    increment: 1
                                }
                            }
                        });
                        // increment user's likes and dislikes
                        await prisma.user.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                [type === "like" ? "likesCount" : "dislikesCount"]: {
                                    increment: 1
                                }
                            }
                        });

                    }
                    return table.findUnique({
                        where: {id: targetId},
                        select: {
                            likes: true,
                            dislikes: true
                        }
                    });
                },
                {
                    isolationLevel: "Serializable"
                });

        })
});
