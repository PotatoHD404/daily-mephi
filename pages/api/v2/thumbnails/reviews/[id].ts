import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/renderAndSend";
import {NextApiRequest, NextApiResponse} from "next";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import ReviewThumbnail from "components/thumbnails/review";
import {UUID_REGEX} from "../../../../../lib/constants/uuidRegex";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let {id: reviewId} = req.query;

    // Input validation (optional, you can use zod if you prefer)
    if (typeof reviewId !== 'string') {
        res.status(400).end('Invalid input');
        return;
    }

    // remove .png at the end if it exists
    if (reviewId.endsWith('.png')) {
        reviewId = reviewId.slice(0, -4);
    }

    // check if is uuid
    if (!reviewId.match(UUID_REGEX)) {
        res.status(400).end('Invalid input');
        return;
    }


    try {
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            },
            select: {
                id: true,
                text: true,
                updatedAt: true,
                likesCount: true,
                dislikesCount: true,
                title: true,
                tutor: {
                    select: {
                        shortName: true,
                        images: {
                            select: {
                                url: true,
                            }
                        },
                    }
                },
                user: {
                    select: {
                        nickname: true,
                        image: {
                            select: {
                                url: true,
                            }
                        },
                    }
                },
            }
        });
        if (!review) {
            res.status(404).end('Material not found');
            return;
        }
        const images =[review.user?.image?.url, review.tutor.images[0]?.url]
        const urls = images.map((image) => normalizeUrl(image, "/images/dead_cat.svg", true))
        const promises = urls.map((url) => imageToBase64(url))
        const [user_image_data, tutor_image_data] = await Promise.all(promises);
        const element = ReviewThumbnail({
            text: review.text,
            title: review.title,
            tutor_image_url: tutor_image_data,
            tutor_name: review.tutor.shortName,
            user_image_url: user_image_data,
            user_name: review?.user?.nickname ?? "",
        })
        await renderAndSend(element, res);
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
}