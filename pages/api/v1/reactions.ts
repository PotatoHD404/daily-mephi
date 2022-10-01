import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/uuidRegex";
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
    const userId = session?.sub;
    if (!userId) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }

    const result = await prisma.$transaction(async (prisma) => {
            const typeMap2: Record<string, any> = {
                "quote": prisma.quote,
                "review": prisma.review,
                "material": prisma.material,
                "comment": prisma.comment
            }
            const fkId = `${type}Id`;
            const table = typeMap2[type];
            const likeExists = await prisma.reaction.findFirst({
                where: {
                    user: {
                        id: userId
                    },
                    [fkId]: {
                        id
                    }
                },
                select: {
                    id: true,
                    like: true
                }
            });
            if (!likeExists && reaction === "unlike") {
                return {};
            }
            if (likeExists && reaction === "unlike") {
                await prisma.reaction.delete({
                    where: {
                        id: likeExists.id
                    }
                });
                await table.update({
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
                    return {};
                }
                await prisma.reaction.update({
                    where: {
                        id: likeExists.id
                    },
                    data: {
                        like: reaction === "like"
                    }
                });
                await table.update({
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
                await prisma.reaction.create({
                    data: {
                        user: {
                            connect: {
                                id: userId
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
                await table.update({
                    where: {id},
                    data: {
                        [reaction === "like" ? "likes" : "dislikes"]: {
                            increment: 1
                        }
                    }
                });
            }
            return await table.findUnique({
                where: {id},
                select: {
                    likes: true,
                    dislikes: true
                }
            });
        },
        {
            isolationLevel: "Serializable"
        });
    res.status(200).json({...result});
}

