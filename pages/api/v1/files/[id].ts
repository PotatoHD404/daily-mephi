import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getClient} from "../../../../lib/database/pg";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // const file = prisma.file.findUnique({
    //     where: {
    //         id
    //     },
    //     select: {
    //         filename: true,
    //         url: true,
    //         altUrl: true,
    //         size: true,
    //     }
    // });

    const client = await getClient();
    const {rows: [file]} = await client.query(`
    SELECT filename,
             url,
             alt_url,
             size
    FROM files
    WHERE files.id = $1
    `, [id]);

    res.status(200).json({
        file
    });
}
