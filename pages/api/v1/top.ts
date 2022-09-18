// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    let calculatedPlace: number = 0;
    let calculatedTake: number = 4;
    if(req.query) {
        const {place, take} = req.query;
        calculatedPlace = +(place || 0);
        calculatedTake = +(take || 4);
    }
    const userCount = await (await prisma.user.aggregate({_count: true}))._count;
    let skip: number;
    if (calculatedPlace == 0) {
        skip = 0;
    } else if (calculatedPlace <= userCount - 1 && calculatedPlace >= userCount - 2) {
        skip = userCount - calculatedTake;
    } else {
        skip = calculatedPlace - (calculatedTake - 2);
    }
    const users = await prisma.user.findMany({
            select: {
                name: true,
                id: true,
                image: true,
                rating: true,
            },
            orderBy: {
                rating: 'desc',
            },
            take: calculatedTake,
            skip
        }
    )

    res.status(200).json(users);
}
