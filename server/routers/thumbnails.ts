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


async function getFontData(url: string) {
    return await fetch(normalizeUrl(url, null, true))
        .then(r => r.arrayBuffer())
        .then(r => Buffer.from(r));
}

async function renderAndSend(element: JSX.Element, res: NextApiResponse) {
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
            const url = normalizeUrl("/images/profile1.png", "/images/dead_cat.svg", true);
            const image_data = await imageToBase64(url);
            const element = MaterialThumbnail({
                image_url: image_data,
                name: "Burunduk",
                tags: ["Семестр 1", "Экзамен", "МатАнализ"],
                text: "Описание описание описание описание описание описание описание описание описание описание описание описание...",
                title: "Название"
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
            const element = QuoteThumbnail({
                name: "Трифоненков В.П.",
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
            const images = ["/images/profile1.png", "/images/tutor.png"]
            const urls = images.map((image) => normalizeUrl(image, "/images/dead_cat.svg", true))
            const promises = urls.map((url) => imageToBase64(url))
            const [user_image_data, tutor_image_data] = await Promise.all(promises);
            const element = ReviewThumbnail({
                text: "Описание описание описание описание описание описание описание описание описание описание описание описание...",
                title: "Название",
                tutor_image_url: tutor_image_data,
                tutor_name: "Трифоненков В.П.",
                user_image_url: user_image_data,
                user_name: "Burunduk"
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
            const url = normalizeUrl("/images/tutor.png", "/images/dead_cat.svg", true);
            const image_data = await imageToBase64(url);
            const element = TutorThumbnail({
                name: "Трифоненков В.П.",
                rating: 4.5,
                legacy_rating: 2.1,
                reviews: 5,
                quotes: 3,
                materials: 3,
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
            const url = normalizeUrl("/images/profile1.png", "/images/dead_cat.svg", true);
            const image_data = await imageToBase64(url);
            const element = UserThumbnail({
                name: "Burunduk",
                course: 3,
                image_url: image_data,
                materials: 3,
                quotes: 3,
                rating: 4.9,
                reviews: 5

            })
            await renderAndSend(element, res);
        }),

});
