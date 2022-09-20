import type {NextApiRequest, NextApiResponse} from "next";
import getTutorSvg from "components/getTutorSvg";
import sharp from 'sharp';
import path from 'path'
import { base64Image } from "helpers/consts";

const imageBuffer = Buffer.from(base64Image, 'base64');
import {getTutor} from "../../tutors/[id]";
import {UUID_REGEX} from "../../tutors/[id]/materials";

// export const config = {
//     runtime: 'experimental-edge',
// }


path.resolve(process.cwd(), 'fonts', 'fonts.conf')
path.resolve(process.cwd(), 'fonts', 'Montserrat-Medium.ttf')



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    let {type, id} = req.query;
    if (!type || typeof type !== "string" || !id || typeof id !== "string" || !id.replace(".png", "").match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    id = id.replace(".png", "");
    let svg: string;
    switch (type) {
        case "tutors":
            // get tutor from prisma
            const tutor = await getTutor(id);
            if(tutor === undefined) {
                res.status(404).json({status: "not found"});
                return;
            }


            let image = tutor.images[0] ? tutor.images[0] : "";
            svg = getTutorSvg({
                tutor_name: "",
                mephist_rating: "",
                daily_rating: "",
                reviews: "",
                reviews_count: "",
                materials: "",
                materials_count: "",
                rating: "",
                rating_value: "",
                image
            });
            break;
        default:
            res.status(404).json({status: "not found"});
            return;
    }


    const buffer = Buffer.from(svg);

    const image = sharp(buffer).png();

    // 31536000
    // let doc = new DOMParser().parseFromString(svg, "text/xml");
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
        "Cache-Control",
        "public, immutable, no-transform, s-maxage=86400, max-age=86400"
    );
    let resultBuffer = await image.toBuffer();
    return res.end(resultBuffer);
}
