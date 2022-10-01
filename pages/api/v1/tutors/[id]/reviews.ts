// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/uuidRegex";

async function getReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id, cursor} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX) || cursor && (typeof cursor !== "string" || !cursor.match(/^\d+$/))) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const reviews = await prisma.review.findMany({
        where: {tutorId: id},
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
        take: 10,
        skip: +(cursor ?? 0),
        orderBy: {score: 'desc'}

    });
    const reviews_count = await prisma.review.count()
    const hasMore = reviews_count > +(cursor ?? 0) + 10;
    res.status(200).json({reviews, next_cursor: hasMore ? +(cursor ?? 0) + 10 : null});
}


async function addReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {text, title} = req.body;
    if (!text || !title) {
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
                text,
                title,
                user: {
                    connect: {id: session.sub}
                },
                tutor: {
                    connect: {id}
                }
            },
        });

        res.status(200).json({status: 'ok', id: review.id});
    } catch (e) {
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
