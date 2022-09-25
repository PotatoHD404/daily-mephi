// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/uuidRegex";

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
    if (!text || typeof text !== "string" || parentId && typeof parentId === "string" && !parentId.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    // console.log(session.sub, parentId, id);

    let typeMapping: Record<string, any> = {review: prisma.review, material: prisma.material, news: prisma.news};


    let result: any = await prisma.$transaction(async (prisma) => {
        if (parentId) {
            const parentComment = await prisma.comment.findFirst({where: {id: parentId}});
            if (!parentComment) {
                return {status: "parent comment not found"};
            }
        }

        return [await prisma.comment.create({
            data: {
                text,
                [type]: {
                    connect: {
                        id,
                    }
                },
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
        }),
            await typeMapping[type].update({
                where: {
                    id
                },
                data: {
                    comment_count: {
                        increment: 1
                    }
                }
            })]
    }, {
        isolationLevel: "Serializable"
    });

    if (result.status) {
        res.status(400).json(result);
        return;
    }

    res.status(200).json({
        status: "ok",
        id: result[0].id,
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
    let comments: {
        id: string,
        text: string,
        createdAt: Date,
        parentId: string | null,
        userId: string,
        path: string[],
        childrenCount: bigint | number
    }[] = await prisma.$queryRaw`
        WITH results as (WITH RECURSIVE cte (id, text, "createdAt", "parentId", "userId", "likes", "dislikes", "path")
                                            AS (SELECT id,
                                                       text,
                                                       "createdAt",
                                                       "parentId",
                                                       "userId",
                                                       "likes",
                                                       "dislikes",
                                                       array [id] AS path
                                                FROM "Comment"
                                                WHERE "Comment"."parentId" IS NULL
                                                  AND "Comment"."${type}Id" = ${id}
                                                UNION ALL
                                                SELECT c.id,
                                                       c.text,
                                                       c."createdAt",
                                                       c."parentId",
                                                       c."userId",
                                                       c."likes",
                                                       c."dislikes",
                                                       cte.path || c.id
                                                FROM "Comment" c
                                                         INNER JOIN cte
                                                                    ON c."parentId" = cte.id)
                         SELECT cte.id,
                                cte.text,
                                cte."createdAt",
                                cte."parentId",
                                cte."userId",
                                cte."likes",
                                cte."dislikes",
                                count(cte2.id) as "childrenCount"
                         FROM cte
                                  LEFT JOIN public."User"
                                            ON
                                                "User"."id" = cte."userId"
                                  LEFT JOIN cte cte2
                                            ON
                                                cte.id = ANY (cte2.path) AND cte2."id" != cte."id"
                         GROUP BY cte.id, cte.text, cte."createdAt", cte."parentId", cte."userId", cte.path,
                                  cte."likes", cte."dislikes"
                         ORDER BY "childrenCount" DESC
                         LIMIT 10)
        SELECT results.*, IF(COUNT(results2.id) > 0, ARRAY_AGG(DISTINCT results2.id), '{}') as "directChildren"
        from results
                 LEFT JOIN results AS results2
                           ON
                               results2."parentId" = results.id
        GROUP BY results.id, results.text, results."createdAt", results."parentId", results."userId", results.likes,
                 results.dislikes,
                 results."childrenCount";
    `

    comments = comments.map(comment => {
        comment.childrenCount = Number(comment.childrenCount);
        return comment;
    });
    res.status(200).json({
        comments
    });

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const session = await getToken({req})

    if (req.method === "POST") {
        await newComment(req, res);
    } else if (req.method === "GET") {
        await getComments(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
