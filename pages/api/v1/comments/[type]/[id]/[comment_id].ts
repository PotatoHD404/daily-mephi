import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id, type, comment_id} = req.query;
    if (!id ||
        typeof id !== "string" ||
        !type ||
        typeof type !== "string" ||
        !comment_id ||
        typeof comment_id !== "string" ||
        type !== "news" && type !== "material" && type !== "review") {
        res.status(400).json({status: "bad request"});
        return;
    }
    // get column name from type


    // get comments from column type by prisma
    const comment = prisma.comment.findUnique({
        where: {
            [`${type}Id`]: id,
        },
        select: {
            id: true,
            text: true,
            createdAt: true,
            parentId: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    });


    res.status(200).json({
        comment
    });
}
