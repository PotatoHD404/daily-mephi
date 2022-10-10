// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";


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
    const tutor = await prisma.tutor.findUnique({
        where: {
            id
        },
        select: tutorSelect
    });
    if (!tutor) {
        res.status(404).json({status: "not found"});
        return;
    }

    res.status(200).json(tutor);
}
