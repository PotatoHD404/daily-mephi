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
    let calculatedPlace: number = 0;
    let calculatedTake: number = 4;
    if (req.query) {
        const {place, take} = req.query;
        calculatedPlace = +(place ?? 0);
        calculatedTake = +(take ?? 4);
    }
    const userCount = await prisma.user.count();
    let skip: number;
    if (calculatedPlace == 1) {
        skip = 0;
    } else if (calculatedPlace <= userCount - 1 && calculatedPlace >= userCount - 2) {
        skip = userCount - calculatedTake;
    } else {
        skip = calculatedPlace - (calculatedTake - 2);
    }
    let users = await prisma.user.findMany({
            select: {
                name: true,
                id: true,
                image: {
                    select: {
                        url: true
                    }
                },
                rating: true,
            },
            orderBy: {
                rating: 'desc',
            },
            take: calculatedTake,
            skip
        }
    )
    // @ts-ignore
    users = users.map((user) => {
        return {...user, image: user.image?.url}
    });
    res.status(200).json(users);
}
