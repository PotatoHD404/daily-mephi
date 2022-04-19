import type {NextApiRequest, NextApiResponse} from "next";
import getSvg from "../../../components/getSvg";
import sharp from 'sharp';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Buffer>
) {
    const svg = getSvg('Test', 'Test2');

    // const roundedCornerResizer = sharp(roundedCorners).png();
    // let doc = new DOMParser().parseFromString(svg, "text/xml");
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/svg+xml");
    // res.setHeader(
    //     "Cache-Control",
    //     "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
    // );
    return res.end(svg);
}