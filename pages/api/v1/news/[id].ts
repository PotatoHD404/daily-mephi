import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id} = req.query;
    if (!id || typeof id !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const news = prisma.news.findUnique({
        where: {
            id
        },
        select: {
            header: true,
            body: true,
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
        }
    });



    res.status(200).json({
        news
    });
}
