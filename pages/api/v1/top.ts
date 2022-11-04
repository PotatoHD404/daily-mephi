// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getClient} from "../../../lib/database/pg";


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
        calculatedPlace = +(place ?? 1);
        calculatedTake = +(take ?? 4);
    }
    const client = await getClient();

    // const userCount = await prisma.user.count();
    const {rows: [{count: userCount}]} = await client.query(`
    SELECT COUNT(*)::INT FROM users
    `)
    let skip: number;
    if (calculatedPlace <= calculatedTake / 2) {
        skip = 0;
    } else if (calculatedPlace <= userCount && calculatedPlace >= userCount - calculatedTake / 2) {
        skip = userCount - calculatedTake;
    } else {
        skip = calculatedPlace - calculatedTake / 2;
    }
    // let users = await prisma.user.findMany({
    //         select: {
    //             name: true,
    //             id: true,
    //             image: {
    //                 select: {
    //                     url: true
    //                 }
    //             },
    //             rating: true,
    //         },
    //         orderBy: {
    //             rating: 'desc',
    //         },
    //         take: calculatedTake,
    //         skip
    //     }
    // )
    let {rows: users} = await client.query(`
    SELECT users.id, users.name, users.rating, 
    (SELECT json_build_object(
                       'url', url,
                       'alt_url', alt_url
                   )
                FROM files
                WHERE files.user_id = users.id) AS user_image
    FROM users
    ORDER BY users.rating DESC
    LIMIT $1 OFFSET $2
    `, [calculatedTake, skip])


    res.status(200).json(users);
}
