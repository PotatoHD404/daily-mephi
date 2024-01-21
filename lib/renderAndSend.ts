import {normalizeUrl} from "./react/imageToBase64";
import {NextApiResponse} from "next";
import satori, {SatoriOptions} from "satori";
import {Resvg, ResvgRenderOptions} from "@resvg/resvg-js";

export async function getFontData(url: string) {
    return await fetch(normalizeUrl(url, null, true))
        .then(r => r.arrayBuffer())
        .then(r => Buffer.from(r));
}

export async function renderAndSend(element: React.ReactElement, res: NextApiResponse) {
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