// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    const avatars = await prisma.file.findMany(
        {
            where: {
                tag: "avatar",
                user: null
            },
            select: {
                url: true,
                altUrl: true,
            }
        }
    )

    res.status(200).json(avatars);
}
