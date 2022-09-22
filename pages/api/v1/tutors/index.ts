// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    let result: {
        id: string,
        firstName: string | null,
        lastName: string | null,
        fatherName: string | null,
        updatedAt: Date,
        nickName: string | null,
        legacyRating: number,
        rating: number,
        reviewsCount: number,
        materialsCount: number,
    }[] = await prisma.$queryRaw`
        SELECT "Tutor".id                                                                            as id,
               "firstName",
               "lastName",
               "fatherName",
               "updatedAt",
               "nickName",
               (COALESCE("LegacyRating"."exams" / CAST(NULLIF("LegacyRating"."examsCount", 0) AS FLOAT), 0.0) +
                COALESCE("LegacyRating".quality / CAST(NULLIF("LegacyRating"."qualityCount", 0) AS FLOAT), 0.0) +
                COALESCE("LegacyRating".personality / CAST(NULLIF("LegacyRating"."personalityCount", 0) AS FLOAT),
                         0.0)) / 3                                                                   AS "legacyRating",
               (COALESCE(AVG("Rate".quality), 0.0) + COALESCE(AVG("Rate"."exams"), 0.0) +
                COALESCE(AVG("Rate".personality), 0.0) + COALESCE(AVG("Rate".punctuality), 0.0)) / 4 AS rating,
               COUNT("Review".id)                                                                    as "reviewsCount",
               COUNT("Material".id)                                                                  as "materialsCount",
               IF(COUNT("File".id) > 0, ARRAY_AGG("File".url), '{}')                                 AS images
        FROM "Tutor"
                 LEFT JOIN "LegacyRating"
                           ON
                               "LegacyRating"."tutorId" = "Tutor".id
                 LEFT JOIN "Rate"
                           ON
                               "Rate"."tutorId" = "Tutor".id
                 LEFT JOIN "Review"
                           ON
                               "Review"."tutorId" = "Tutor".id
                 LEFT JOIN "Material"
                           ON
                               "Material"."tutorId" = "Tutor".id
                 LEFT JOIN "File"
                           ON
                               "File"."tutorId" = "Tutor".id
        GROUP BY "Tutor".id, "LegacyRating"."exams", "LegacyRating"."examsCount", "LegacyRating"."quality",
                 "LegacyRating"."qualityCount", "LegacyRating"."personality", "LegacyRating"."personalityCount"
        ORDER BY rating DESC, "legacyRating" DESC
        LIMIT 20;
    `
    // console.log(result)
    result = result.map(item => {
        item.legacyRating = Number(item.legacyRating.toFixed(2))
        item.rating = Number(item.rating.toFixed(2))
        item.reviewsCount = Number(item.reviewsCount)
        item.materialsCount = Number(item.materialsCount)
        return item
    });
    res.status(200).json(result);
}
