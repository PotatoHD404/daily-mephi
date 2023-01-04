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
    // const disciplines = await prisma.discipline.findMany()
    const client = await getClient();
    const {rows: disciplines} = await client.query(`
    SELECT * FROM disciplines
    `)

    res.status(200).json({disciplines});
}
