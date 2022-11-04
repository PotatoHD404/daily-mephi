// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getClient} from "../../../lib/database/pg";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    // const avatars = await prisma.file.findMany(
    //     {
    //         where: {
    //             tag: "avatar",
    //             user: null
    //         },
    //         select: {
    //             url: true,
    //             altUrl: true,
    //         }
    //     }
    // )
    const client = await getClient();
    const {rows: avatars} = await client.query(`
    SELECT id,
           url,
           alt_url
    FROM files
    WHERE tag = 'avatar'
        AND user_id IS NULL
    `)


    res.status(200).json(avatars);
}
