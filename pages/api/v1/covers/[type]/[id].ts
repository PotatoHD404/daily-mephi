import type {NextApiRequest, NextApiResponse} from "next";

import path from 'path'

import {getTutor} from "../../tutors/[id]";
import ejs from "ejs";
import {promises as fs} from "fs";
import sharp from "sharp";
// import ejs template from file


// export const config = {
//     runtime: 'experimental-edge',
// }


path.resolve(process.cwd(), 'fonts', 'fonts.conf')
path.resolve(process.cwd(), 'fonts', 'Montserrat-Medium.ttf')


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const avatarUrl = "https://logos-world.net/wp-content/uploads/2021/08/Among-Us-Logo.png";
    // fetch image from url and convert it to buffer
    const avatarString = await fetch(avatarUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => Buffer.from(buffer))
        .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
    // const fontString = await fs.readFile(path.resolve(process.cwd(), 'fonts', 'Roboto-Medium.ttf')).then
    // (buffer => buffer.toString('base64'));
    sharp.cache(false);
    // sharp.simd(false);
    sharp.concurrency(1);
    const rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'tutor.ejs'), {
        tutor_name: "",
        mephist_rating: "",
        daily_rating: "",
        reviews: "",
        reviews_count: "",
        materials: "",
        materials_count: "",
        rating: "",
        rating_value: "Текст",
        image: avatarString,
        font_path: process.env.LOCAL == "true" ?
            "'./../cloud-functions/main/fonts/Montserrat-Medium.ttf'" :
            "'Montserrat-Medium.ttf'",
    }).then((html) => Buffer.from(html));

    // convert to image
    const image = sharp(rendered).png();
    // set headers
    res.setHeader('Content-Type', 'image/png');
    // res.setHeader('Content-Type', 'image/svg+xml');
    // res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    // send image
    // image.png().pipe(res);
    // res.end(rendered);
    // let svg = getTutorSvg({
    //     tutor_name: "",
    //     mephist_rating: "",
    //     daily_rating: "",
    //     reviews: "",
    //     reviews_count: "",
    //     materials: "",
    //     materials_count: "",
    //     rating: "",
    //     rating_value: "",
    //     image: ""
    // });
    // if(process.env.LOCAL == "true") {
    image.cork();
    image.pipe(res);
    image.uncork();
    // clear cache

    // image.uncork()
    // image._destroy(new Error(), () => {});
    // image
    // delete sharp;
    // }
    // await image.toFile('tmp/result.png');
    // // read file to buffer
    // const buffer = await fs.readFile('tmp/result.png');
    // send buffer
    // res.end(buffer);


    // res.end();
    // res.status(200).json({status: process.memoryUsage() });
}
