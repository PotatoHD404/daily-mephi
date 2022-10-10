// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    let {id} = req.query;
    if (!id || typeof id != "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // const allUsers = {status: "ok"}
    // const user = await prisma.user.findFirst({
    //         where: {
    //             id
    //         },
    //         select: {
    //             name: true,
    //             id: true,
    //             image: true,
    //             rating: true,
    //             role: true,
    //             userCourse: true,
    //             _count: {
    //                 select: {
    //                     materials: true,
    //                     reviews: true,
    //                     quotes: true,
    //                 }
    //             },
    //         },
    //     }
    // )
    // get user and it's place in rating
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            name: true,
            id: true,
            image: true,
            rating: true,
            role: true,
            materialsCount: true,
            reviewsCount: true,
            quotesCount: true,
            place: true,
        }
    });    // console.log(user);
    // Generate sql query from above


    if (!user) {
        res.status(404).json({status: "not found"});
        return;
    }
    res.status(200).json(user);
}
