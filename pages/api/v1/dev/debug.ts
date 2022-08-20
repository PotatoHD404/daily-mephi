// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios";
import prisma from "lib/database/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }
    let files = await prisma.file.findMany({
        select: {
            id: true,
            filename: true,
        },
        where: {
            uploaded: {gte: "2022-08-07T12:21:18.791Z"}
        }
    });
    res.status(200).json({
        status: "ok",
        fileMap: files.reduce((acc: {[key: string]: string}, file) => {
            acc[file.filename] = file.id
            return acc;
        }, {})
    });
}
