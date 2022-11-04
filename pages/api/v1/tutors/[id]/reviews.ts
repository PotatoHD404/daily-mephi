// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getDocument} from 'lib/database/fullTextSearch';
import {getClient} from "../../../../../lib/database/pg";

async function getReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id, cursor} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX) || cursor && (typeof cursor !== "string" || !cursor.match(/^\d+$/))) {
        res.status(400).json({status: "bad request"});
        return;
    }

    const client = await getClient();

    // const reviews = await prisma.review.findMany({
    //     where: {tutorId: id},
    //     select: {
    //         id: true,
    //         title: true,
    //         text: true,
    //         createdAt: true,
    //         legacyNickname: true,
    //         user: {
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 image: {select: {url: true}}
    //             }
    //         },
    //         // dislikes: true,
    //         // commentCount: true,
    //     },
    //     take: 10,
    //     skip: +(cursor ?? 0),
    //     // orderBy: {score: 'desc'}
    //
    // });
    // const reviews_count = await prisma.review.count()
    const [{rows: reviews}, {rows: [{count}]}] = await Promise.all([client.query(`
        SELECT reviews.id,
               reviews.title,
               reviews.text,
               reviews.created_at,
               reviews.legacy_nickname,
               users.id                                                                   AS user_id,
               users.name,
               (SELECT json_build_object(
                               'url', url,
                               'alt_url', alt_url
                           )
                FROM files
                WHERE files.id = users.image_id)                                          AS user_image,
               (SELECT COUNT(*)::INT
                FROM reactions
                WHERE reactions.review_id = reviews.id
                  AND reactions.liked = true)                                             AS likes,
               (SELECT COUNT(*)::INT
                FROM reactions
                WHERE reactions.review_id = reviews.id
                  AND reactions.liked = false)                                            AS dislikes,
               (SELECT COUNT(*)::INT FROM comments WHERE comments.review_id = reviews.id) AS comment_count
        FROM reviews
                 LEFT JOIN users ON reviews.user_id = users.id
        WHERE reviews.tutor_id = $1
        ORDER BY reviews.created_at DESC
        LIMIT 10 OFFSET $2
    `, [id, +(cursor ?? 0)]),
        client.query(`
            SELECT COUNT(*)::INT AS count
            FROM reviews
            WHERE reviews.tutor_id = $1
        `, [id])]);

    const hasMore = count > +(cursor ?? 0) + 10;
    res.status(200).json({reviews, next_cursor: hasMore ? +(cursor ?? 0) + 10 : null});
}


async function addReviews(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {text, title} = req.body;
    if (!text || !title) {
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
    //     const review = await prisma.$transaction(async (prisma) => {
    //
    //         const review = await prisma.review.create({
    //             data: {
    //                 text,
    //                 title,
    //                 user: {
    //                     connect: {id: session.sub}
    //                 },
    //                 tutor: {
    //                     connect: {id}
    //                 }
    //             },
    //         });
    //         await prisma.document.create({
    //             data: {
    //                 type: "review",
    //                 ...getDocument(text + ' ' + title),
    //             }
    //         });
    //
    //         return review;
    //     });
    //
    //     res.status(200).json({status: 'ok', id: review.id});
    // } catch (e) {
    //     res.status(500).json({status: 'error'});
    // }

    // check if user has already reviewed this tutor
    const {rows: [{exists}]} = await client.query(`
        SELECT id FROM reviews
        WHERE user_id = $1
            AND tutor_id = $2
        LIMIT 1;
    `, [userId, id]);

    if (exists) {
        res.status(400).json({status: 'You have already reviewed this tutor'});
        return;
    }

    const {rows: [review]} = await client.query(`
        BEGIN;
        WITH review as (INSERT INTO reviews (user_id, tutor_id, text, title, legacy_nickname)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *)
        WITH document as (INSERT INTO documents (type, data, review_id)
        SELECT 'review', review.text || ' ' || review.title, review.id
        FROM review)
        SELECT review.id FROM review;
        COMMIT;
    `, [userId, id, text, title, null]);

    res.status(200).json({status: 'ok', id: review.id});

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getReviews(req, res);
    } else if (req.method === "POST") {
        await addReviews(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
