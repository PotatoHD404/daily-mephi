// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/uuidRegex";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const materials = await prisma.material.findMany({
        where: {tutorId: id},
        select: {
            id: true,
            header: true,
            description: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            likes: true,
            dislikes: true,
            comment_count: true
        },
        take: 10,
        orderBy: {createdAt: 'desc'}
    });

    res.status(200).json(materials);
}
