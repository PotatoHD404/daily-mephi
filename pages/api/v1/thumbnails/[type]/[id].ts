import type {NextApiRequest, NextApiResponse} from "next";

import path from 'path'

import {getTutor} from "../../tutors/[id]";
import ejs from "ejs";
import {promises as fs} from "fs";
import sharp from "sharp";
import {UUID_REGEX} from "../../tutors/[id]/materials";
// import ejs template from file


// export const config = {
//     runtime: 'experimental-edge',
// }


path.resolve(process.cwd(), 'fonts', 'fonts.conf')
path.resolve(process.cwd(), 'fonts', 'Montserrat-Medium.ttf')

function getNoun(number: number, one: string, two: string, five: string) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const {id, type} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX) || !type || typeof type !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    let rendered: Buffer;
    if(type == "tutors") {
        const tutor = await getTutor(id);
        if(!tutor) {
            res.status(404).json({status: "not found"});
            return;
        }
        let avatarString: string = "";
        if(tutor.images.length > 0) {
            // const avatarUrl = "https://logos-world.net/wp-content/uploads/2021/08/Among-Us-Logo.png";
            // fetch image from url and convert it to buffer
            avatarString = await fetch(tutor.images[0])
                .then((res) => res.arrayBuffer())
                .then((buffer) => Buffer.from(buffer))
                .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
        }
        // const fontString = await fs.readFile(path.resolve(process.cwd(), 'fonts', 'Roboto-Medium.ttf')).then
        // (buffer => buffer.toString('base64'));
        sharp.cache(false);
        // sharp.simd(false);
        sharp.concurrency(1);
        rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'tutor.ejs'), {
            tutor_name: tutor.lastName + " " + (tutor.firstName ? tutor.firstName[0] + "." : "") +
                (tutor.fatherName ? tutor.fatherName[0] + "." : ""),
            mephist_rating: tutor.legacyRating ?? "-",
            daily_rating: tutor.rating ?? "-",
            reviews: getNoun(tutor.reviewsCount, "Отзыв", "Отзыва", "Отзывов"),
            reviews_count: tutor.reviewsCount,
            materials: getNoun(tutor.materialsCount, "Материал", "Материала", "Материалов"),
            materials_count: tutor.materialsCount,
            quotes: getNoun(tutor.quotesCount, "Цитата", "Цитаты", "Цитат"),
            quotes_count: tutor.quotesCount,
            image: avatarString,
            font_path: process.env.LOCAL == "true" ?
                "'cloud-functions/main/fonts/Montserrat-Medium.ttf'" :
                "'Montserrat-Medium.ttf'",
        }).then((html) => Buffer.from(html));
    }
    // else if(type == "material") {
    //     const material = await getMaterial(id);
    //     rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'material.ejs'), {
    //         material_name: "",
    //         tutor_name: "",
    //         mephist_rating: "",
    //         daily_rating: "",
    //         reviews: "",
    //         reviews_count: "",
    //         materials: "",
    //         materials_count: "",
    //         rating: "",
    //         rating_value: "Текст",
    //         image: "",
    //         font_path: process.env.LOCAL == "true" ?
    //             "'cloud-functions/main/fonts/Montserrat-Medium.ttf'" :
    //             "'Montserrat-Medium.ttf'",
    //     }).then((html) => Buffer.from(html));
    // }
    // else if(type == "review") {
    //     const review = await getReview(id);
    //     rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'review.ejs'), {
    //         material_name: "",
    //         tutor_name: "",
    //         mephist_rating: "",
    //         daily_rating: "",
    //         reviews: "",
    //         reviews_count: "",
    //         materials: "",
    //         materials_count: "",
    //         rating: "",
    //         rating_value: "Текст",
    //         image: "",
    //         font_path: process.env.LOCAL == "true" ?
    //             "'cloud-functions/main/fonts/Montserrat-Medium.ttf'" :
    //             "'Montserrat-Medium.ttf'",
    //     }).then((html) => Buffer.from(html));
    // }
    // else if (type == "quote") {
    //     const quote = await getQuote(id);
    //     rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'quote.ejs'), {
    //         material_name: "",
    //         tutor_name: "",
    //         mephist_rating: "",
    //         daily_rating: "",
    //         reviews: "",
    //         reviews_count: "",
    //         materials: "",
    //         materials_count: "",
    //         rating: "",
    //         rating_value: "Текст",
    //         image: "",
    //         font_path: process.env.LOCAL == "true" ?
    //             "'cloud-functions/main/fonts/Montserrat-Medium.ttf'" :
    //             "'Montserrat-Medium.ttf'",
    //     }).then((html) => Buffer.from(html));
    // }
    else {
        res.status(400).json({status: "bad request"});
        return;
    }
    const image = sharp(rendered).png();
    res.setHeader('Content-Type', 'image/png');
    image.cork();
    image.pipe(res);
    image.uncork();
}
