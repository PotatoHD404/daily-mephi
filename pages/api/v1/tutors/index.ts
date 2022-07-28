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
        updated: Date,
        nickName: string | null,
        legacyRating: number,
        rating: number,
        reviewsCount: number,
        materialsCount: number,
    }[] = await prisma.$queryRaw`
SELECT
Tutor.id as id,
firstName,
lastName,
fatherName,
updated,
nickName,
(IFNULL(LegacyRating.exams / NULLIF(LegacyRating.examsCount, 0), 0) + IFNULL(LegacyRating.quality / NULLIF(LegacyRating.qualityCount, 0), 0) + IFNULL(LegacyRating.personality / NULLIF(LegacyRating.personalityCount, 0), 0)) / 3 AS legacyRating,
(IFNULL(AVG(Rate.quality), 0) + IFNULL(AVG(Rate.exams), 0) + IFNULL(AVG(Rate.personality), 0) + IFNULL(AVG(Rate.punctuality), 0)) / 4 AS rating,
COUNT(Review.id) as reviewsCount,
COUNT(Material.id) as materialsCount,
File.images AS images
FROM Tutor
LEFT JOIN LegacyRating
ON
LegacyRating.tutorId = Tutor.id
LEFT JOIN Rate
ON
Rate.tutorId = Tutor.id
LEFT JOIN Review
ON
Review.tutorId = Tutor.id
LEFT JOIN Material
ON
Material.tutorId = Tutor.id
LEFT JOIN (
    SELECT Tutor.id as id, IF(COUNT(File.url) = 0, JSON_ARRAY(), JSON_ARRAYAGG(File.url)) as images
    FROM Tutor
    LEFT JOIN File
    ON
    File.tutorId = Tutor.id
    GROUP BY Tutor.id
    LIMIT 3
) as File
ON File.id = Tutor.id
GROUP BY Tutor.id
ORDER BY rating DESC, legacyRating DESC
LIMIT 20;
`
    result = result.map(item => {
        item.legacyRating = Number(item.legacyRating.toFixed(2))
        item.rating = Number(item.rating.toFixed(2))
        item.reviewsCount = Number(item.reviewsCount)
        item.materialsCount = Number(item.materialsCount)
        return item
    });
    res.status(200).json(result);
}
