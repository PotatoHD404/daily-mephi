import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const news = prisma.news.findMany({
        select: {
            title: true,
            text: true,
            createdAt: true,
            // commentCount: true
        },
        take: 10,
    });


    res.status(200).json({
        news
    });
}
