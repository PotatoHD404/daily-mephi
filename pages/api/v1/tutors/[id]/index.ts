// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getClient} from "lib/database/pg";


export const tutorSelect = {
    id: true,
    shortName: true,
    fullName: true,
    images: {
        select: {
            url: true
        }
    },
    reviewsCount: true,
    quotesCount: true,
    materialsCount: true,
    legacyRating: {
        select: {
            personality: true,
            exams: true,
            quality: true,
            personalityCount: true,
            examsCount: true,
            qualityCount: true,
            ratingCount: true,
            avgRating: true
        }
    },
    rating: {
        select: {
            punctuality: true,
            exams: true,
            quality: true,
            personality: true,
            ratingCount: true,
            avgRating: true
        }
    }
};

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

    const client = await getClient();

    // const tutor = await prisma.tutor.findUnique({
    //     where: {
    //         id
    //     },
    //     select: tutorSelect
    // });

    // rewrite this to use pg

    const {rows: [tutor]} = await client.query(`
        SELECT tutors.id,
               tutors.short_name,
               tutors.full_name,
               lr.personality               AS legacy_personality,
               lr.exams                     AS legacy_exams,
               lr.quality                   AS legacy_quality,
               lr.personality_count         AS legacy_personality_count,
               lr.exams_count               AS legacy_exams_count,
               lr.quality_count             AS legacy_quality_count,
               lr.rating_count              AS legacy_rating_count,
               lr.avg_rating                AS legacy_avg_rating,
               (SELECT COUNT(*)::INT
                FROM reviews
                WHERE tutor_id = tutors.id) AS reviews_count,
               (SELECT COUNT(*)::INT
                FROM quotes
                WHERE tutor_id = tutors.id) AS quotes_count,
               (SELECT COUNT(*)::INT
                FROM materials
                WHERE tutor_id = tutors.id) AS materials_count,
               (SELECT json_agg(json_build_object(
                       'url', url,
                       'alt_url', alt_url
                   ))
                FROM files
                WHERE tutor_id = tutors.id) AS images,
               r.punctuality::FLOAT         as punctuality,
               r.exams::FLOAT               as exams,
               r.quality::FLOAT             as quality,
               r.personality::FLOAT         as personality,
               r.rating_count::INT          as rating_count,
               r.avg_rating::FLOAT          as avg_rating
        FROM tutors
                 INNER JOIN legacy_ratings lr
                            ON lr.tutor_id = tutors.id
                 INNER JOIN LATERAL (SELECT AVG(punctuality)::FLOAT                                       as punctuality,
                                    AVG(exams)::FLOAT                                             AS exams,
                                    AVG(quality)::FLOAT                                           AS quality,
                                    AVG(personality)::FLOAT                                       AS personality,
                                    COUNT(*)::INT                                                 AS rating_count,
                                    AVG((punctuality + exams + quality + personality) / 4)::FLOAT AS avg_rating,
                                    tutor_id
                             FROM rates
                             GROUP BY tutor_id) as r
                            ON r.tutor_id = tutors.id
        WHERE tutors.id = $1
    `, [id]);


    if (!tutor) {
        res.status(404).json({status: "not found"});
        return;
    }

    res.status(200).json({tutor});
}
