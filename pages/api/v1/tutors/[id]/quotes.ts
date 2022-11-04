// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getClient} from "../../../../../lib/database/pg";


async function getQuotes(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }

    const client = await getClient();

    // const quotes = await prisma.quote.findMany({
    //     where: {tutorId: id},
    //     select: {
    //         id: true,
    //         text: true,
    //         createdAt: true,
    //         user: {
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 image: true,
    //             }
    //         },
    //         // likes: true,
    //         // dislikes: true
    //     },
    //     take: 10,
    //     // orderBy: {score: 'desc'}
    // });

    const {rows: quotes} = await client.query(
        `SELECT quotes.id,
                quotes.text,
                quotes.created_at,
                quotes.user_id,
                users.name,
                users.image,
                (SELECT COUNT(*)::INT
                 FROM reactions
                 WHERE reactions.quote_id = quotes.id
                   AND reactions.liked = true)  AS likes,
                (SELECT COUNT(*)::INT
                 FROM reactions
                 WHERE reactions.quote_id = quotes.id
                   AND reactions.liked = false) AS dislikes
         FROM quotes
                  INNER JOIN users ON users.id = quotes.user_id
         WHERE quotes.tutor_id = $1
         ORDER BY quotes.created_at DESC
         LIMIT 10`,
        [id]
    );

    res.status(200).json({quotes});
}


async function addQuote(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {text} = req.body;
    if (!text || typeof text !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    let userId = session?.sub;
    const client = await getClient();
    if (!userId && process.env.LOCAL !== "true") {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    } else {

        // select first user from database
        const {rows: [user]} = await client.query(
            `SELECT id
             FROM users
             LIMIT 1;`);
        userId = user.id;
    }
    // try {
    //
    //     const quote = await prisma.$transaction(async (prisma) => {
    //         const quote = await prisma.quote.create({
    //         data: {
    //             text,
    //             user: {
    //                 connect: {id: session.sub}
    //             },
    //             tutor: {
    //                 connect: {id}
    //             }
    //         },
    //     });
    //     await prisma.document.create({
    //         data: {
    //             type: "quote",
    //             ...getDocument(text)
    //         }
    //     });
    //     return quote;
    // });
    //     res.status(200).json({status: 'ok', id: quote.id});
    // } catch (e) {
    //     res.status(500).json({status: 'error'});
    // }

    const {rows: [quote]} = await client.query(`
        BEGIN;
        WITH quote AS (
            INSERT INTO quotes (text, user_id, tutor_id)
            VALUES ($1, $2, $3)
            RETURNING id, text
        ),
        document AS (INSERT INTO documents (type, data, quote_id)
        SELECT 'quote', quote.text, quote.id
        FROM quote)
        SELECT quote.id FROM quote;
        COMMIT;
`,
        [text, userId, id]
    );
    res.status(200).json({id: quote.id});

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getQuotes(req, res);
    } else if (req.method === "POST") {
        await addQuote(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }


}
