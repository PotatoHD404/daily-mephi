// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    let {id}: { id: string | undefined, name: string | undefined } = req.query as any;
    // const allUsers = {status: "ok"}
    const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {id: {equals: id}}
                ]
            },
            select: {
                name: true,
                id: true,
                image: true,
                rating: true,
            },
        }
    )
    if(!user) {
        res.status(404).json({status: "not found"});
        return;
    }
    res.status(200).json(user);
}
