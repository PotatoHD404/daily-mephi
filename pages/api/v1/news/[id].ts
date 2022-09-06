import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


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
            comment_count: true
        }
    });



    res.status(200).json({
        news
    });
}
