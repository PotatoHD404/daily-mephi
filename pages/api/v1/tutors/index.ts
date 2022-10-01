// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {tutorSelect} from "./[id]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {limit} = req.query;
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    let result = await prisma.tutor.findMany({
        select: tutorSelect,
        take: limit ? parseInt(limit as string) : 10,
    });

    res.status(200).json(result);
}
