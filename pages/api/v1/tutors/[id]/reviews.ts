// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";

async function getReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const reviews = await prisma.review.findMany({
        where: {tutorId: id},
        select: {
            id: true,
            header: true,
            body: true,
            uploaded: true,
            legacyNickname: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            likes: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                }
            },
            dislikes: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                }
            },
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
                orderBy: {
                    createdAt: "asc"
                },
                take: 10,
            },
        },
        take: 10,
        orderBy: {uploaded: 'desc'}
    });

    res.status(200).json(reviews);
}


async function addReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {body, header} = req.body;
    if (!body || !header) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    try {
        const review = await prisma.review.create({
            data: {
                body,
                header,
                user: {
                    connect: {id: session.sub}
                },
                tutor: {
                    connect: {id}
                }
            },
        });

        res.status(200).json({status: 'ok', id: review.id});
    }
    catch (e) {
        res.status(500).json({status: 'error'});
    }

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getReviews(req, res);
    } else if (req.method === "POST") {
        await addReviews(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
