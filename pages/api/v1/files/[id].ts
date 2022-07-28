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
    const file = prisma.file.findUnique({
        where: {
            id
        },
        select: {
            filename: true,
            url: true,
        }
    });



    res.status(200).json({
        file
    });
}
