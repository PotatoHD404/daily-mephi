// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";

async function getReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const review = await prisma.review.findUnique({
        where: {id},
        select: {
            id: true,
            title: true,
            text: true,
            createdAt: true,
            legacyNickname: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: {select: {url: true}}
                }
            },
            likes: true,
            dislikes: true,
            commentCount: true,
        },
    });
    if (!review) {
        res.status(404).json({status: "not found"});
        return;
    }
    res.status(200).json(review);
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getReviews(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
