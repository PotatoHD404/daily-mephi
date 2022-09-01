import prisma from "lib/database/prisma";
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
    if (req.query.type !== "like" &&
        req.query.type !== "dislike" &&
        req.query.type !== "unlike" ||
        req.body.type !== "quote" &&
        req.body.type !== "review" &&
        req.body.type !== "material" &&
        req.body.type !== "comment" || req.body.id === undefined) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req});
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const {type, id} = req.body;

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
                    id: true,
                    like: true
                }
            });
            if (!likeExists && req.query.type === "unlike") {
                return;
            }
            if (likeExists && req.query.type === "unlike") {
                await likeExists.delete();

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
                if (likeExists.like === (req.query.type === "like") || !likeExists.like === (req.query.type === "dislike")) {
                    return;
                }
                await like.update({
                    where: {
                        id: likeExists.id
                    },
                    data: {
                        like: req.query.type === "like"
                    }
                });
                return await typeMap2[type].update({
                    where: {id},
                    data: {
                        [likeExists.like ? "likes" : "dislikes"]: {
                            increment: 1
                        },
                        [likeExists.like ? "dislikes" : "likes"]: {
                            decrement: 1
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
                        like: req.query.type === "like"
                    }
                });
                return typeMap2[type].update({
                    where: {id},
                    data: {
                        [req.query.type === "like" ? "likes" : "dislikes"]: {
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

