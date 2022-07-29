// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";


async function newComment(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const {id, type} = req.query;
    if (!id || typeof id !== "string" || !type || typeof type !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {text, parentId} = req.body;
    if (!text || typeof text !== "string" || parentId && typeof parentId === "string" && !parentId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    console.log(session.sub, parentId, id)
    const comment = await prisma.comment.create({
        data: {
            text,
            review: type === "review" ? {
                connect: {
                    id,
                }
            } : undefined,
            material: type === "material" ? {
                connect: {
                    id,
                }
            } : undefined,
            news: type === "news" ? {
                connect: {
                    id,
                }
            } : undefined,
            parent: parentId ? {
                connect: {
                    id: parentId,
                }
            } : undefined,
            user: {
                connect: {
                    id: session.sub
                }
            }
        }
    });


    res.status(200).json({
        status: "ok",
        id: comment.id,
    });
}
// WITH RECURSIVE cte (id, text, createdAt, parentId, userId) as (
//     SELECT     id,
//     text,
//     createdAt,
//     parentId,
//     userId
// WHERE      postId = d8db9556-ba99-4f85-9787-49d618f8bcf2 AND
// parentId IS NULL
// UNION ALL
// SELECT     c.id,
//     c.text,
//     c.createdAt,
//     c.parentId,
//     c.userId
// FROM       Comment c
// INNER JOIN cte
// on c.parentId = cte.id
// )
// SELECT * FROM cte;
async function getComments(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const {id, type} = req.query;
    if (!id || typeof id !== "string" || !type || typeof type !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    let comments = await prisma.$queryRaw`
WITH RECURSIVE cte (id, text, "createdAt", "parentId", "userId") AS (
    SELECT
    id,
    text,
    "createdAt",
    "parentId",
    "userId"
FROM public."Comment"
WHERE "Comment"."parentId" IS NULL AND "Comment"."reviewId" = ${'0000afcc-ee2e-45e0-9acf-e53992004ab7'}
UNION ALL
SELECT     c.id,
    c.text,
    c."createdAt",
    c."parentId",
    c."userId"
FROM       "Comment" c
INNER JOIN cte
on c."parentId" = cte.id
)
SELECT * FROM cte
LEFT JOIN public."User"
ON
"User"."id" = cte."userId"
LIMIT 10;
`


    res.status(200).json({
        comments
    });

}

// TODO: add file size limit and file type limit

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    if (req.method === "POST") {
        await newComment(req, res);
    } else if (req.method === "GET") {
        await getComments(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
