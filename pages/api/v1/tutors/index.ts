// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {tutorSelect} from "./[id]";
import {getClient} from "lib/database/pg";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {limit} = req.query;
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }

    const client = await getClient();

    // let result = await prisma.tutor.findMany({
    //     select: tutorSelect,
    //     take: limit ? parseInt(limit as string) : 10,
    // });

    const {rows: tutors} = await client.query(`
        SELECT * FROM tutors LIMIT $1
    `, [limit ? parseInt(limit as string) : 10]);



    res.status(200).json({tutors});
}
