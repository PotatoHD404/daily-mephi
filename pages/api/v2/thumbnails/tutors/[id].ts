import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/renderAndSend";
import {NextApiRequest, NextApiResponse} from "next";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import TutorThumbnail from "components/thumbnails/tutor";
import {UUID_REGEX} from "../../../../../lib/constants/uuidRegex";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let {id: tutorId} = req.query;

    // Input validation (optional, you can use zod if you prefer)
    if (typeof tutorId !== 'string') {
        res.status(400).end('Invalid input');
        return;
    }

    // remove .png at the end if it exists
    if (tutorId.endsWith('.png')) {
        tutorId = tutorId.slice(0, -4);
    }

    // check if is uuid
    if (!tutorId.match(UUID_REGEX)) {
        res.status(400).end('Invalid input');
        return;
    }


    try {
        const tutor = await prisma.tutor.findUnique({
            where: {
                id: tutorId
            },
            select: {
                id: true,
                shortName: true,
                rating: {
                    select: {
                        avgRating: true,
                    }
                },
                legacyRating: {
                    select: {
                        avgRating: true,
                    }
                },
                reviewsCount: true,
                quotesCount: true,
                materialsCount: true,
                images: {
                    select: {
                        url: true,
                    }
                },
            }
        });
        if (!tutor) {
            res.status(404).end('Material not found');
            return;
        }

        const url = normalizeUrl(tutor.images[0]?.url, "/images/dead_cat.svg", true);
        const image_data = await imageToBase64(url);
        const element = TutorThumbnail({
            name: tutor.shortName,
            rating: tutor?.rating?.avgRating ?? -1,
            legacy_rating: tutor.legacyRating?.avgRating ?? -1,
            reviews: tutor.reviewsCount,
            quotes: tutor.quotesCount,
            materials: tutor.materialsCount,
            image_url: image_data
        })
        await renderAndSend(element, res);
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
}