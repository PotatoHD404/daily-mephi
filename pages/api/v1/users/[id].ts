// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    let {id}: { id: string | undefined } = req.query as any;
    if (id == "me") {
        const session = await getToken({req})
        if (!session?.sub) {
            res.status(401).json({status: 'You are not authenticated'});
            return;
        }
        id = session.sub;
    }
    // const allUsers = {status: "ok"}
    const user = await prisma.user.findFirst({
            where: {
                id
            },
            select: {
                name: true,
                id: true,
                image: true,
                rating: true,
                role: true,
                userCourse: true,
                _count: {
                    select: {
                        materials: true,
                        reviews: true,
                        quotes: true,
                    }
                },
            },
        }
    )

    if (!user) {
        res.status(404).json({status: "not found"});
        return;
    }
    // @ts-ignore
    user.materials = user._count.materials;
    // @ts-ignore
    user.reviews = user._count.reviews;
    // @ts-ignore
    user.quotes = user._count.quotes;
    res.status(200).json(user);
}
