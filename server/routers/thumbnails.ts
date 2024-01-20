import {z} from 'zod';
import {t} from 'server/utils';
import satori, {SatoriOptions} from 'satori';
import {Resvg, ResvgRenderOptions} from '@resvg/resvg-js'
import {NextApiResponse} from "next";
import MaterialThumbnail from 'server/components/thumbnails/material';
import QuoteThumbnail from 'server/components/thumbnails/quote';
import ReviewThumbnail from 'server/components/thumbnails/review';
import TutorThumbnail from 'server/components/thumbnails/tutor';
import UserThumbnail from 'server/components/thumbnails/user';
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import {TRPCError} from "@trpc/server";


async function getFontData(url: string) {
    return await fetch(normalizeUrl(url, null, true))
        .then(r => r.arrayBuffer())
        .then(r => Buffer.from(r));
}

async function renderAndSend(element: React.ReactElement, res: NextApiResponse) {
    // const fontPath = join(process.cwd(), 'public', 'fonts', 'Montserrat.ttf')
    // let fontData = await fs.readFile(fontPath)
    let fontsData = [
        {
            name: 'Montserrat',
            url: "/fonts/Montserrat-Medium.ttf",
            weight: 500 as const,
            style: 'normal' as const,
        },
        {
            name: 'Montserrat',
            url: "/fonts/Montserrat-SemiBold.ttf",
            weight: 600 as const,
            style: 'normal' as const,
        },
        {
            name: 'Montserrat',
            url: "/fonts/Montserrat-Bold.ttf",
            weight: 700 as const,
            style: 'normal' as const,
        },
        {
            name: 'Montserrat',
            url: "/fonts/Montserrat-MediumItalic.ttf",
            weight: 500 as const,
            style: 'italic' as const,
        }
    ]

    let promises = fontsData.map(async (font) => {
        let data = await getFontData(font.url)
        let returnData = {
            ...font,
            data: data
        }
        // @ts-ignore
        delete returnData.url
        return returnData
    })
    let fonts = await Promise.all(promises)

    const opts1: SatoriOptions = {
        fonts: fonts,
        width: 1200,
        height: 630,
        embedFont: true,
    }
    const svg = await satori(element, opts1)
    const opts2: ResvgRenderOptions = {
        fitTo: {
            mode: "original"
        },
        shapeRendering: 2,
        imageRendering: 0,
        textRendering: 2,
    }
    const resvg = new Resvg(svg, opts2)

    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    res.setHeader('Content-Type', 'image/png');
    res.end(pngBuffer)
}

export const thumbnailsRouter = t.router({
    getMaterial: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/thumbnails/materials/{id}.png',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma, res}, input: {id: materialId}}) => {

            const material = await prisma.material.findUnique({
                where: {
                    id: materialId
                },
                select: {
                    id: true,
                    title: true,
                    text: true,
                    tutor: {
                        select: {
                            shortName: true
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
                    faculties: {
                        select: {
                            name: true
                        }
                    },
                    disciplines: {
                        select: {
                            name: true
                        }
                    },
                    likesCount: true,
                    dislikesCount: true,
                    commentsCount: true,
                }
            });
            if (!material) {
                throw new TRPCError({code: 'NOT_FOUND', message: 'Material not found'});
            }

            const url = normalizeUrl(material.user?.image?.url, "/images/dead_cat.svg", true);
            const image_data = await imageToBase64(url);
            const element = MaterialThumbnail({
                image_url: image_data,
                name: material.user?.nickname ?? "",
                tags: material.disciplines.map((discipline) => discipline.name).concat(material.faculties.map((faculty) => faculty.name)),
                text: material.text ?? "",
                title: material.title,
            })


            await renderAndSend(element, res);
        }),
    getQuote: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/thumbnails/quotes/{id}.png',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma, res}, input: {id: quoteId}}) => {
            const quote = await prisma.quote.findUnique({
                where: {
                    id: quoteId
                },
                select: {
                    id: true,
                    text: true,
                    updatedAt: true,
                    likesCount: true,
                    dislikesCount: true,
                    tutor: {
                        select: {
                            shortName: true
                        }
                    }
                }
            })
            if (!quote) {
                throw new TRPCError({code: 'NOT_FOUND', message: 'Quote not found'});
            }
            const element = QuoteThumbnail({
                name: quote.tutor.shortName,
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum elit sit amet mi sollicitudin, vel rhoncus urna finibus. Nullam quis mauris at ante viverra vestibulum. Quisque vel semper quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum elit sit amet mi sollicitudin, vel rhoncus urna finibus. Nullam quis mauris at ante viverra vestibulum. Quisque vel semper quam. "
            })
            await renderAndSend(element, res);
        }),
    getReview: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/thumbnails/reviews/{id}.png',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma, res}, input: {id: reviewId}}) => {
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
                throw new TRPCError({code: 'NOT_FOUND', message: 'Review not found'});
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
        }),
    getTutor: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/thumbnails/tutors/{id}.png',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma, res}, input: {id: tutorId}}) => {
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
                throw new TRPCError({code: 'NOT_FOUND', message: 'Tutor not found'});
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
        }),
    getUser: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/thumbnails/users/{id}.png',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma, res}, input: {id: userId}}) => {
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
                throw new TRPCError({code: 'NOT_FOUND', message: 'User not found'});
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
        }),

});
