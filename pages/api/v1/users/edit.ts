// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    console.log(req.method === "GET")
    // const allUsers = {status: "ok"}
    let allUsers = await prisma.user.findMany({
            select: {
                name: true,
                id: true,
                image: true,
                rating: true,
            },
            orderBy: {
                rating: 'desc',
            },
            take: 20,
        }
    )

    res.status(200).json(allUsers);
}
