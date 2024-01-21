import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/renderAndSend";
import {NextApiRequest, NextApiResponse} from "next";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import UserThumbnail from "components/thumbnails/user";
import {UUID_REGEX} from "../../../../../lib/constants/uuidRegex";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let {id: userId} = req.query;

    // Input validation (optional, you can use zod if you prefer)
    if (typeof userId !== 'string') {
        res.status(400).end('Invalid input');
        return;
    }

    // remove .png at the end if it exists
    if (userId.endsWith('.png')) {
        userId = userId.slice(0, -4);
    }

    // check if is uuid
    if (!userId.match(UUID_REGEX)) {
        res.status(400).end('Invalid input');
        return;
    }


    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                nickname: true,
                image: {
                    select: {
                        url: true,
                    }
                },
                materialsCount: true,
                quotesCount: true,
                rating: true,
                reviewsCount: true,
            }
        });
        if (!user) {
            res.status(404).end('Material not found');
            return;
        }
        const url = normalizeUrl(user?.image?.url, "/images/dead_cat.svg", true);
        const image_data = await imageToBase64(url);
        const element = UserThumbnail({
            name: user.nickname ?? "",
            course: 3,
            image_url: image_data,
            materials: user.materialsCount,
            quotes: user.quotesCount,
            rating: user.rating,
            reviews: user.reviewsCount,

        })
        await renderAndSend(element, res);
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
}