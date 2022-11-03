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

    const tutor = (await client.query(`
        SELECT tutors.id,
               tutors.short_name,
               tutors.full_name,
               lr.personality             AS legacy_personality,
               lr.exams                   AS legacy_exams,
               lr.quality                 AS legacy_quality,
               lr.personality_count       AS legacy_personality_count,
               lr.exams_count             AS legacy_exams_count,
               lr.quality_count           AS legacy_quality_count,
               lr.rating_count            AS legacy_rating_count,
               lr.avg_rating              AS legacy_avg_rating,
               reviews_count.count::INT   AS reviews_count,
               quotes_count.count::INT    AS quotes_count,
               materials_count.count::INT AS materials_count,
               r.punctuality::FLOAT       as punctuality,
               r.exams::FLOAT             as exams,
               r.quality::FLOAT           as quality,
               r.personality::FLOAT       as personality,
               r.rating_count::INT        as rating_count,
               r.avg_rating::FLOAT        as avg_rating,
               images.urls                AS images,
               images.alt_urls            AS alt_images
        FROM tutors
                 INNER JOIN (SELECT array_agg(url) AS urls, array_agg(alt_url) AS alt_urls
                             FROM files
                             WHERE tutor_id = $1) AS images
                            ON true
                 INNER JOIN legacy_ratings lr
                            ON lr.tutor_id = $1
                 INNER JOIN (SELECT COUNT(*) AS count
                             FROM reviews
                             WHERE tutor_id = $1) AS reviews_count
                            ON true
                 INNER JOIN (SELECT COUNT(*) AS count
                             FROM quotes
                             WHERE tutor_id = $1) AS quotes_count
                            ON true
                 INNER JOIN (SELECT COUNT(*) AS count
                             FROM materials
                             WHERE tutor_id = $1) AS materials_count
                            ON true
                 INNER JOIN (SELECT AVG(punctuality)                                       as punctuality,
                                    AVG(exams)                                             AS exams,
                                    AVG(quality)                                           AS quality,
                                    AVG(personality)                                       AS personality,
                                    COUNT(*)                                               AS rating_count,
                                    AVG((punctuality + exams + quality + personality) / 4) AS avg_rating
                             FROM rates
                             WHERE tutor_id = $1) AS r
                            ON true
        WHERE tutors.id = $1
    `, [id])).rows[0];


    if (!tutor) {
        res.status(404).json({status: "not found"});
        return;
    }

    res.status(200).json({tutor});
}
