import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id, type, comment_id} = req.query;
    if (!id || typeof id !== "string" || !type || typeof type !== "string" || !comment_id || typeof comment_id !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const comment = prisma.comment.findFirst({
        where: {
            id: comment_id,
            postId: id,
        },
        select: {
            text: true,
            createdAt: true,
            comments: {
                select: {
                    _count: true,
                }
            }
        }
    });



    res.status(200).json({
        comment
    });
}
