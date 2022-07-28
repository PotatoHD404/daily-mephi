// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";


async function newComment(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const {id, type} = req.query;
    if (!id || typeof id !== "string" || !type || typeof type !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {text, parentId} = req.body;
    if (!text || typeof text !== "string" || parentId && typeof parentId === "string" && !parentId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const comment = await prisma.comment.create({
        // @ts-ignore
        data: {
            text,
            review: type === "review" ? {
                connect: {
                    id,
                }
            } : undefined,
            material: type === "material" ? {
                connect: {
                    id,
                }
            } : undefined,
            news: type === "news" ? {
                connect: {
                    id,
                }
            } : undefined,
            parent: parentId ? {
                connect: {
                    id: parentId,
                }
            } : undefined,
            user: {
                connect: {
                    id: session.sub
                }
            }
        }
    });


    res.status(200).json({
        status: "ok",
        id: comment.id,
    });
}

async function getComments(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const {id, type} = req.query;
    if (!id || typeof id !== "string" || !type || typeof type !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const comments = await prisma.comment.findMany({
        where: {
            postId: id,
        },
        select: {
            text: true,
            createdAt: true,
            comments: {
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    },
                    _count: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
                take: 10,
            }
        },
        take: 10,
    });


    res.status(200).json({
        comments
    });

}

// TODO: add file size limit and file type limit

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    if (req.method === "POST") {
        await newComment(req, res);
    } else if (req.method === "GET") {
        await getComments(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
