// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {TutorType} from "lib/database/types";
import {UUID_REGEX} from "lib/uuidRegex";


export function processTutor(item: TutorType) {
    // @ts-ignore
    item.legacyRating = Number(item.legacyRating.toFixed(2)) || null
    item.rating = Number(item.rating.toFixed(2))
    item.reviewsCount = Number(item.reviewsCount)
    item.materialsCount = Number(item.materialsCount)
    item.quotesCount = Number(item.quotesCount)
    item.reviewsCount = Number(item.reviewsCount)
    item.quality = Number(item.quality.toFixed(2))
    item.exams = Number(item.exams.toFixed(2))
    item.personality = Number(item.personality.toFixed(2))
    item.punctuality = Number(item.punctuality.toFixed(2))
    return item

}

export async function getTutor(id: string) {
    return (await getTutors(id))[0];
}

export async function getTutors(id?: string): Promise<TutorType[]> {
    let result: TutorType[] = await prisma.$queryRaw`
        SELECT "Tutor".id                                                           as id,
               "firstName",
               "lastName",
               "fatherName",
               "updatedAt",
               "nickName",
               (COALESCE("LegacyRating"."exams" / CAST(NULLIF("LegacyRating"."examsCount", 0) AS FLOAT), 0.0) +
                COALESCE("LegacyRating".quality / CAST(NULLIF("LegacyRating"."qualityCount", 0) AS FLOAT), 0.0) +
                COALESCE("LegacyRating".personality / CAST(NULLIF("LegacyRating"."personalityCount", 0) AS FLOAT),
                         0.0)) / 3                                                  AS "legacyRating",
               IFNULL(AVG("Rate".quality), 0)                                       AS quality,
               IFNULL(AVG("Rate".exams), 0)                                         AS exams,
               IFNULL(AVG("Rate".personality), 0)                                   AS personality,
               IFNULL(AVG("Rate".punctuality), 0)                                   AS punctuality,
               COUNT("Review".id)                                                   as "reviewsCount",
               COUNT("Material".id)                                                 as "materialsCount",
               COUNT("Quote".id)                                                    as "quotesCount",
               IF(COUNT("File".id) > 0, ARRAY_AGG("File".url), '{}')                as images,
               IF(COUNT("Discipline".name) > 0, ARRAY_AGG("Discipline".name), '{}') as disciplines,
               IF(COUNT("Faculty".name) > 0, ARRAY_AGG("Faculty".name), '{}')       as faculties,
               "Tutor"."rating"                                                     as rating
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
                 LEFT JOIN "_FacultyToTutor"
                           ON
                               "_FacultyToTutor"."B" = "Tutor".id
                 LEFT JOIN "Faculty"
                           ON
                               "_FacultyToTutor"."A" = "Faculty".id
                 LEFT JOIN "_DisciplineToTutor"
                           ON
                               "_DisciplineToTutor"."B" = "Tutor".id
                 LEFT JOIN "Discipline"
                           ON
                               "_DisciplineToTutor"."A" = "Discipline".id
                 LEFT JOIN "Quote"
                           ON
                               "Quote"."tutorId" = "Tutor".id
        GROUP BY "Tutor".id, "LegacyRating"."exams", "LegacyRating"."examsCount", "LegacyRating"."quality",
                 "LegacyRating"."qualityCount", "LegacyRating"."personality", "LegacyRating"."personalityCount"
    `;
    result = result.map(processTutor);
    return result;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const tutor = await getTutor(id);
    if (tutor === undefined) {
        res.status(404).json({status: "not found"});
        return;
    }

    res.status(200).json(tutor);
}
