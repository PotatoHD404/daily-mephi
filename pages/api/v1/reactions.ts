import prisma from "lib/database/prisma";
import { UUID_REGEX } from "lib/uuidRegex";
import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "PUT") {

        res.status(405).json({status: "method not allowed"});
        return;
    }
    const {id, reaction, type} = req.body;
    if (reaction !== "like" &&
        reaction !== "dislike" &&
        reaction !== "unlike" ||
        type !== "quote" &&
        type !== "review" &&
        type !== "material" &&
        type !== "comment" || !id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req});
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }

    await prisma.$transaction(async (prisma) => {
            const typeMap: Record<string, any> = {
                "quote": prisma.quoteLike,
                "review": prisma.reviewLike,
                "material": prisma.materialLike,
                "comment": prisma.commentLike
            };
            const typeMap2: Record<string, any> = {
                "quote": prisma.quote,
                "review": prisma.review,
                "material": prisma.material,
                "comment": prisma.comment
            }
            const like = typeMap[type];
            const likeExists = await like.findFirst({
                where: {
                    user: {
                        id: session.sub
                    },
                    [type]: {
                        id
                    }
                },
                select: {
                    like: true
                }
            });
            if (!likeExists && reaction === "unlike") {
                return;
            }
            if (likeExists && reaction === "unlike") {
                await like.delete({
                    where: {
                        userId_commentId: {
                            userId: session.sub,
                            [`${type}Id`]: id
                        }
                    }
                });

                return await typeMap2[type].update({
                    where: {id},
                    data: {
                        [likeExists.like ? "likes" : "dislikes"]: {
                            decrement: 1
                        }
                    }
                });
            }
            if (likeExists) {
                if (likeExists.like === (reaction === "like") || !likeExists.like === (reaction === "dislike")) {
                    return;
                }
                await like.update({
                    where: {
                        userId_commentId: {
                            userId: session.sub,
                            [`${type}Id`]: id
                        }
                    },
                    data: {
                        like: reaction === "like"
                    }
                });
                return await typeMap2[type].update({
                    where: {id},
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
                await like.create({
                    data: {
                        user: {
                            connect: {
                                id: session.sub
                            }
                        },
                        [type]: {
                            connect: {
                                id
                            }
                        },
                        like: reaction === "like"
                    }
                });
                return typeMap2[type].update({
                    where: {id},
                    data: {
                        [reaction === "like" ? "likes" : "dislikes"]: {
                            increment: 1
                        }
                    }
                });
            }
        },
        {
            isolationLevel: "Serializable"
        });
    res.status(200).json({status: "ok"});
}

