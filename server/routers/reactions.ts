import {z} from 'zod';
import {t} from 'lib/trpc';
import {isAuthorized} from "../middlewares/isAuthorized";
import {verifyCSRFToken} from "../middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "../middlewares/verifyRecaptcha";


export const reactionsRouter = t.router({
    add: t.procedure.meta({
        openapi: {
            method: 'PUT',
            path: '/reactions',
            protect: true
        }
    })
        .input(z.object({
                type: z.enum(['like', 'dislike', 'unlike']),
                targetId: z.string().uuid(),
                targetType: z.enum(['news', 'comment', 'quote', 'material', 'review']),
                csrfToken: z.string(),
                recaptchaToken: z.string()
            }
        ))
        .output(z.any())
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({ctx: {prisma, user}, input: {type, targetId, targetType}}) => {
            return await prisma.$transaction(async (prisma) => {
                    const typeMap: Record<string, any> = {
                        "quote": prisma.quote,
                        "review": prisma.review,
                        "material": prisma.material,
                        "comment": prisma.comment
                    }
                    const fkId = `${targetType}Id`;
                    const table = typeMap[type];
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
                        return await table.findUnique({
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
                                [likeExists.like ? "likes" : "dislikes"]: {
                                    decrement: 1
                                }
                            }
                        });
                    }
                    if (likeExists) {
                        if (likeExists.like === (type === "like") || !likeExists.like === (type === "dislike")) {
                            return await table.findUnique({
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
                                [likeExists.like ? "likes" : "dislikes"]: {
                                    decrement: 1
                                },
                                [likeExists.like ? "dislikes" : "likes"]: {
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
                                [type === "like" ? "likes" : "dislikes"]: {
                                    increment: 1
                                }
                            }
                        });
                    }
                    return await table.findUnique({
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
