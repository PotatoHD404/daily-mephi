// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const materials = await prisma.material.findMany({
        where: {tutorId: id},
        select: {
            id: true,
            header: true,
            description: true,
            uploaded: true,
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

    res.status(200).json(materials);
}
