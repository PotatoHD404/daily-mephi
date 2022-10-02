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
    const file = prisma.file.findUnique({
        where: {
            id
        },
        select: {
            filename: true,
            url: true,
            altUrl: true,
            size: true,
        }
    });


    res.status(200).json({
        file
    });
}
