import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/thumbnails/utils/renderAndSend";
import {NextApiResponse} from "next";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import TutorThumbnail from "components/thumbnails/tutor";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(tutorId: string, res: NextApiResponse) {


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