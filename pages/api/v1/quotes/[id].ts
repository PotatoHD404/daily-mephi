// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getClient} from "../../../../lib/database/pg";

async function getReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // const quote = await prisma.quote.findUnique({
    //     where: {id},
    //     select: {
    //         id: true,
    //         text: true,
    //         createdAt: true,
    //         user: {
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 image: {select: {url: true}}
    //             }
    //         },
    //         // likes: true,
    //         // dislikes: true,
    //     },
    // });
    const client = await getClient();
    const {rows: [quote]} = await client.query(`
    SELECT quotes.id,
           quotes.text,
           quotes.created_at,
           quotes.user_id,
           users.name,
           users.image,
           (SELECT COUNT(*)::INT
            FROM reactions
            WHERE reactions.quote_id = quotes.id
              AND reactions.liked = true)                   AS likes,
           (SELECT COUNT(*)::INT
            FROM reactions
            WHERE reactions.quote_id = quotes.id
              AND reactions.liked = false)                  AS dislikes
    FROM quotes
             LEFT JOIN users ON quotes.user_id = users.id
    WHERE quotes.id = $1
    `, [id]);

    if (!quote) {
        res.status(404).json({status: "not found"});
        return;
    }
    res.status(200).json(quote);

}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getReviews(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
