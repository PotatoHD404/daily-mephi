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
               IFNULL("tutorRating".quality, 0)                                       AS quality,
               IFNULL("tutorRating".exams, 0)                                         AS exams,
               IFNULL("tutorRating".personality, 0)                                   AS personality,
               IFNULL("tutorRating".punctuality, 0)                                   AS punctuality,
               "tutorImages".result                as images,
               "tutorDisciplines".result as disciplines,
               "tutorFaculties".result       as faculties,
               "Tutor"."rating"                                                     as rating,
               "quotesCount".result                                                  as "quotesCount",
                "materialsCount".result                                               as "materialsCount",
                "reviewsCount".result                                                 as "reviewsCount"
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
                 LEFT JOIN (SELECT COUNT("Quote".id) as result
                           FROM "Quote"
                        WHERE "Quote"."tutorId" = ${id}) AS "quotesCount"
                            ON TRUE
                LEFT JOIN (SELECT COUNT("Review".id) as result
                            FROM "Review"
                            WHERE "Review"."tutorId" = ${id}) AS "reviewsCount"
                            ON TRUE
                LEFT JOIN (SELECT COUNT("Material".id) as result
                            FROM "Material"
                            WHERE "Material"."tutorId" = ${id}) AS "materialsCount"
                            ON TRUE
                LEFT JOIN (SELECT AVG("Rate".quality) as quality, AVG("Rate".exams) as exams,
                 AVG("Rate".personality) as personality, AVG("Rate".punctuality) as punctuality
                            FROM "Rate"
                            WHERE "Rate"."tutorId" = ${id}) AS "tutorRating"
                            ON TRUE
                LEFT JOIN (SELECT IF(COUNT("File".id) > 0, ARRAY_AGG("File".url), '{}') as result
                            FROM "File"
                            WHERE "File"."tutorId" = ${id}) AS "tutorImages"
                            ON TRUE
                LEFT JOIN (SELECT IF(COUNT("Discipline".name) > 0, ARRAY_AGG("Discipline".name), '{}') as result
                            FROM "_DisciplineToTutor"
                                        LEFT JOIN "Discipline"
                                                    ON
                                                        "_DisciplineToTutor"."A" = "Discipline".id
                            WHERE "_DisciplineToTutor"."B" = ${id}) AS "tutorDisciplines"
                            ON TRUE
                LEFT JOIN (SELECT IF(COUNT("Faculty".name) > 0, ARRAY_AGG("Faculty".name), '{}') as result
                            FROM "_FacultyToTutor"
                                        LEFT JOIN "Faculty"
                                                    ON
                                                        "_FacultyToTutor"."A" = "Faculty".id
                            WHERE "_FacultyToTutor"."B" = ${id}) AS "tutorFaculties"
                            ON TRUE
                WHERE "Tutor".id = ${id}
    `;
    console.log(result)
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
