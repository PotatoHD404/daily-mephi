import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getClient} from "../../../../lib/database/pg";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // const news = prisma.news.findUnique({
    //     where: {
    //         id
    //     },
    //     select: {
    //         title: true,
    //         text: true,
    //         createdAt: true,
    //         // commentCount: true
    //     }
    // });
    const client = await getClient();
    const {rows: [news]} = await client.query(`
    SELECT news.title,
             news.text,
             news.created_at,
        (SELECT COUNT(*)::INT
                    FROM reactions
                    WHERE reactions.news_id = news.id
                        AND reactions.liked = true)                                                 AS likes,
        (SELECT COUNT(*)::INT
                    FROM reactions
                    WHERE reactions.news_id = news.id
                        AND reactions.liked = false)                                                AS dislikes,
        (SELECT COUNT(*)::INT FROM comments WHERE comments.news_id = news.id)                      AS comment_count
    FROM news
    WHERE news.id = $1
    `, [id])

    res.status(200).json({news});
}
