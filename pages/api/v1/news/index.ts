import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const news = prisma.news.findMany({
        select: {
            header: true,
            body: true,
            createdAt: true,
            comments: {
                select: {
                    _count: true,
                },
            },
        },
        take: 10,
    });



    res.status(200).json({
        news
    });
}
