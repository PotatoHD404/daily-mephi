// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// noinspection SqlNoDataSourceInspection

import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";

let epoch = new Date(1970, 1, 1);

function epoch_seconds(date: Date) {
    return date.getSeconds() - epoch.getSeconds();
}

function score(likes: number, dislikes: number) {
    return likes - dislikes;
}

function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
}

function hot(likes: number, dislikes: number, date: Date) {
    let s = score(likes, dislikes);
    let order = getBaseLog(Math.max(Math.abs(s), 1), 10);
    let sign: number;
    if (s > 0) {
        sign = 1;
    } else if (s < 0) {
        sign = -1;
    } else {
        sign = 0;
    }
    let seconds = epoch_seconds(date) - 1134028003;
    return sign * order + seconds / 45000;
}

function confidence(likes: number, dislikes: number): number {
    const n = likes + dislikes;

    if (n === 0) {
        return 0;
    }

    const z = 1.281551565545;
    const p = likes / n;

    const left = p + 1 / (2 * n) * z * z;
    const right = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
    const under = 1 + 1 / n * z * z;

    return (left - right) / under;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {

        res.status(405).json({status: "method not allowed"});
        return;
    }
    if (req.query.token !== process.env.TOKEN) {
        res.status(401).json({status: "unauthorized"});
        return;
    }
    const result = await prisma.$transaction(async (prisma) => {
            return [await prisma.$executeRaw`
                WITH c4 as (SELECT id,
                                   ''                                              as "body",
                                   ''                                              as "header",
                                   gen_random_uuid()                               as "tutorId",
                                   (c2."sign" * c2."order" + c2."seconds" / 45000) as score
                            FROM (SELECT id,
                                         LOG(IF(ABS("n") > 1, ABS("n"), 1), 10) as "order",
                                         SIGN("n")                              as sign,
                                         seconds
                                  FROM (SELECT id,
                                               likes,
                                               dislikes,
                                               likes - dislikes                        as n,
                                               (CAST("createdAt" AS INT) - 1661887626) as seconds
                                        FROM "Review") as c1) as c2)
                INSERT
                INTO "Review" (id, "body", "header", "tutorId", score)
                SELECT *
                FROM c4 ON CONFLICT (id)
DO
                UPDATE SET score = excluded.score;
            `,
                await prisma.$executeRaw`
                    WITH c4 as (SELECT id, '' as text, gen_random_uuid() as userId, (c3.left - c3.right) / c3.under as score
                                FROM (SELECT id,
                                             p + 1 / (2 * n) * z * z as left,
    z * SQRT(p * (1 - p) / n + z * z / (4 * n * n)) as right,
    1 + 1 / n * z * z                               as under
                                      FROM (SELECT id, (likes + dislikes) AS n, likes / (likes + dislikes) AS p, z
                                          FROM (SELECT id, likes, dislikes, 1.281551565545 AS z
                                          FROM "Comment") as c1
                                          WHERE likes + dislikes != 0) as c2) as c3)
                    INSERT
                    INTO "Comment" (id, text, "userId", score)
                    SELECT *
                    FROM c4 ON CONFLICT (id)
DO
                    UPDATE SET score = excluded.score;
                `,
                await prisma.$executeRaw`WITH c4 as (SELECT id,
                                                            ''                                              as "header",
                                                            gen_random_uuid()                               as "userId",
                                                            (c2."sign" * c2."order" + c2."seconds" / 45000) as score
                                                     FROM (SELECT id,
                                                                  LOG(IF(ABS("n") > 1, ABS("n"), 1), 10) as "order",
                                                                  SIGN("n")                              as sign,
                                                                  seconds
                                                           FROM (SELECT id,
                                                                        likes,
                                                                        dislikes,
                                                                        likes - dislikes                        as n,
                                                                        (CAST("createdAt" AS INT) - 1661887626) as seconds
                                                                 FROM "Material") as c1) as c2)
                                         INSERT
                                         INTO "Material" (id, "header", "userId", score)
                SELECT *
                FROM c4 ON CONFLICT (id)
DO
                UPDATE SET score = excluded.score;`,
                await prisma.$executeRaw`
                    WITH c4 as (SELECT id,
                                       ''                                              as "body",
                                       gen_random_uuid()                               as "tutorId",
                                       (c2."sign" * c2."order" + c2."seconds" / 45000) as score
                                FROM (SELECT id,
                                             LOG(IF(ABS("n") > 1, ABS("n"), 1), 10) as "order",
                                             SIGN("n")                              as sign,
                                             seconds
                                      FROM (SELECT id,
                                                   likes,
                                                   dislikes,
                                                   likes - dislikes                        as n,
                                                   (CAST("createdAt" AS INT) - 1661887626) as seconds
                                            FROM "Quote") as c1) as c2)
                    INSERT
                    INTO "Quote" (id, "body", "tutorId", score)
                    SELECT *
                    FROM c4 ON CONFLICT (id)
    DO
                    UPDATE SET score = excluded.score;`,
                await prisma.$executeRaw`
                    WITH c1 as (SELECT c2."tutorId", -1 / (SUM(score) + 1) + 1 as score
                                FROM (SELECT "LegacyRating"."tutorId",
                                             ((5 + personality) * IF("personalityCount" < 10, "personalityCount", 10)::float +
                                            (5 + exams) * IF("examsCount" < 10, "examsCount", 10)::float +
                                            (5 + quality) * IF("qualityCount" < 10, "qualityCount", 10)::float) / 30 as score
                    FROM "LegacyRating"
                    UNION
                    SELECT "Rate"."tutorId",
                           SUM(("Rate".punctuality + "Rate".personality + "Rate".exams + "Rate".quality) / 40) as score
                    FROM "Rate"
                    GROUP BY "Rate"."tutorId") as c2
                    GROUP BY c2."tutorId")
                    INSERT
                    INTO "Tutor" (id, "score", "rating")
                    SELECT "Rate"."tutorId"                                                                   as id,
                           AVG(("Rate".punctuality + "Rate".personality + "Rate".exams + "Rate".quality) / 4) as rating,
                           score
                    FROM "Rate"
                             INNER JOIN c1
                                        ON c1."tutorId" = "Rate"."tutorId"
                    GROUP BY "Rate"."tutorId", score ON CONFLICT (id)
    DO
                    UPDATE SET score = excluded.score,
                        rating = excluded.rating;
                `
            ];
        },
        {
            isolationLevel: "Serializable"
        });


    res.status(200).json({status: "ok"});
}
