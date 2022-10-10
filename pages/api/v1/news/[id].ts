import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const news = prisma.news.findUnique({
        where: {
            id
        },
        select: {
            title: true,
            text: true,
            createdAt: true,
            // commentCount: true
        }
    });


    res.status(200).json({
        news
    });
}
