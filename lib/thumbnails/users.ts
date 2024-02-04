import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/thumbnails/utils/renderAndSend";
import {NextApiResponse} from "next";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import UserThumbnail from "components/thumbnails/user";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(userId: string, res: NextApiResponse) {


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