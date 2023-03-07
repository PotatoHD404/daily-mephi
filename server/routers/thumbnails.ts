import {z} from 'zod';
import {t} from 'server/trpc';
import puppeteer, {Page} from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import {NextApiResponse} from "next";
import Material from 'components/thumbnails/material';
import QuoteThumbnail from 'components/thumbnails/quote';
import ReviewThumbnail from 'components/thumbnails/review';
import TutorThumbnail from 'components/thumbnails/tutor';
import UserThumbnail from 'components/thumbnails/user';
import render from 'preact-render-to-string';
import Tutor from "images/tutor.png";
import DeadCat from "../../images/dead_cat.svg";
import {imageToBase64, normalizeUrl} from "../../lib/react/imageToBase64";

let _page: Page | null;

interface Options {
    args: string[];
    executablePath: string;
    headless: boolean;
}

const exePath = process.platform === 'win32'
    // ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ? 'C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe'
    : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    let options: Options;
    // console.log(`Chrome path ${await chromium.executablePath()}`)
    if (isDev) {
        options = {
            args: [],
            executablePath: exePath,
            headless: true
        };
    } else {
        options = {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        };
    }
    const browser = await puppeteer.launch(options);
    _page = await browser.newPage();
    return _page;
}

export type FileType = 'png' | 'jpeg';


export async function getScreenshot(html: string, type: FileType, isDev: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({width: 1200, height: 600});
    await page.setContent(html);
    return await page.screenshot({type});
}

async function renderAndSend(element: JSX.Element, res: NextApiResponse) {
    const html = render(element);
    const rendered = Buffer.from(html);

    const image = await getScreenshot(rendered.toString(), "png", process.env.NODE_ENV !== "production");
    res.setHeader('Content-Type', 'image/png');
    res.end(image)
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
            const element = await Material({
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
