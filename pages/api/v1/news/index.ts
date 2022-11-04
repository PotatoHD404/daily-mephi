import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getClient} from "../../../../lib/database/pg";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // const news = prisma.news.findMany({
    //     select: {
    //         title: true,
    //         text: true,
    //         createdAt: true,
    //         // commentCount: true
    //     },
    //     take: 10,
    // });
    const client = await getClient();
    const {rows: news} = await client.query(`
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
    ORDER BY id
    LIMIT 10;
    `)

    res.status(200).json({
        news
    });
}
