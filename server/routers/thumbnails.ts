import {z} from 'zod';
import {t} from 'server/trpc';
import satori, {SatoriOptions} from 'satori';
import {Resvg, ResvgRenderOptions} from '@resvg/resvg-js'
import {NextApiResponse} from "next";
import Material from 'components/thumbnails/material';
import QuoteThumbnail from 'components/thumbnails/quote';
import ReviewThumbnail from 'components/thumbnails/review';
import TutorThumbnail from 'components/thumbnails/tutor';
import UserThumbnail from 'components/thumbnails/user';
import Tutor from "images/tutor.png";
import DeadCat from "../../images/dead_cat.svg";
import {imageToBase64, normalizeUrl} from "../../lib/react/imageToBase64";


async function renderAndSend(element: JSX.Element, res: NextApiResponse) {
    // const fontPath = join(process.cwd(), 'public', 'fonts', 'Montserrat.ttf')
    // let fontData = await fs.readFile(fontPath)
    let fontData = await fetch("https://themes.googleusercontent.com/static/fonts/montserrat/v3/zhcz-_WihjSQC0oHJ9TCYC3USBnSvpkopQaUR-2r7iU.ttf")
        .then(r => r.arrayBuffer())
        .then(r => Buffer.from(r))

    const opts1: SatoriOptions = {
        fonts: [{
            name: 'Montserrat',
            data: fontData,
            weight: 400,
            style: 'normal',
        },],
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
        imageRendering: 1,
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
        .output(z.any())
        .query(async ({ctx: {prisma, res}, input: {id: materialId}}) => {
            const url = normalizeUrl(Tutor, DeadCat);
            const image_data = await imageToBase64(url);
            const element = Material({
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
    getQuote: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/thumbnails/quotes/{id}.png',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma, res}, input: {id: quoteId}}) => {
            const element = QuoteThumbnail()
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
        .output(z.any())
        .query(async ({ctx: {prisma, res}, input: {id: reviewId}}) => {
            const element = ReviewThumbnail()
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
        .output(z.any())
        .query(async ({ctx: {prisma, res}, input: {id: tutorId}}) => {
            const element = TutorThumbnail()
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
        .output(z.any())
        .query(async ({ctx: {prisma, res}, input: {id: userId}}) => {
            const element = UserThumbnail()
            await renderAndSend(element, res);
        }),

});
