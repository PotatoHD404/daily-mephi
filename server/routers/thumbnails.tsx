import {z} from 'zod';
import {t} from 'lib/trpc';
import core from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import {NextApiRequest, NextApiResponse} from "next";
import MaterialThumbnail from 'components/thumbnails/material';
import ReactDOMServer from 'react-dom/server';

let _page: core.Page | null;

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
    if (isDev) {
        options = {
            args: [],
            executablePath: exePath,
            headless: true
        };
    } else {
        options = {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        };
    }
    const browser = await core.launch(options);
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

export default async function (
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

}
export const thumbnailsRouter = t.router({
    getTutor: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/tutors/{id}/thumbnail',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        .output(z.any())
        .query(async ({ctx: {prisma, res}, input: {id}}) => {
            // const screenshot = await getScreenshot("dead cat", "png", process.env.NODE_ENV === "development");
            // res.setHeader('Content-Type', 'image/png');
            // res.end(screenshot);

            // render sharp blank image width 2048x1170
            const element = <MaterialThumbnail/>
            const html = ReactDOMServer.renderToString(element);
            const rendered = Buffer.from(html);

            const image = await getScreenshot(rendered.toString(), "png", process.env.NODE_ENV === "development");
            res.setHeader('Content-Type', 'image/png');
            res.end(image);
        }),

});
