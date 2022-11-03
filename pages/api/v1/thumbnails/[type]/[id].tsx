import type {NextApiRequest, NextApiResponse} from "next";

import prisma from "lib/database/prisma";
import { ImageResponse } from '@vercel/og';
import {getWrappedText, italic, regular} from "lib/textSize";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import { NextRequest } from "next/server";
// import ejs template from file
// get base64 from dead cat
// export const config = {
//     runtime: 'experimental-edge',
// }

export default function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  
      return new ImageResponse(
        (
          <div>
            
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }
      
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

// function returnNotFound(res: NextApiResponse) {
//     const image = sharp(path.resolve(process.cwd(), 'images', '404.png'));
//     image.cork();
//     image.pipe(res);
//     image.uncork();
//     res.status(404)
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<object>
// ) {

//     let {id, type} = req.query;
//     if (!id || typeof id !== "string" || !id.replace(".png", "").match(UUID_REGEX) || !type || typeof type !== "string") {
//         res.status(400).json({status: "bad request"});
//         return;
//     }
//     res.setHeader('Content-Type', 'image/png');
//     id = id.replace(".png", "");
//     let rendered: Buffer;
//     sharp.cache(false);
//     // sharp.simd(false);
//     sharp.concurrency(1);
//     if (type == "tutors") {
//         const tutor = await prisma.tutor.findUnique(
//             {
//                 where: {
//                     id
//                 },
//                 select: {
//                     id: true,
//                     shortName: true,
//                     images: {
//                         select: {
//                             url: true
//                         }
//                     },
//                     // reviewsCount: true,
//                     // quotesCount: true,
//                     // materialsCount: true,
//                     legacyRating: {
//                         select: {
//                             avgRating: true
//                         }
//                     },
//                     // rating: {
//                     //     select: {
//                     //         avgRating: true
//                     //     }
//                     // }
//                 }
//             }
//         );
//         if (!tutor) {
//             returnNotFound(res);
//             return;
//         }
//         let avatarString: string = "";
//         if (tutor.images.length > 0) {
//             // const avatarUrl = "https://logos-world.net/wp-content/uploads/2021/08/Among-Us-Logo.png";
//             // fetch image from url and convert it to buffer
//             avatarString = await fetch(tutor.images[0].url)
//                 .then((res) => res.arrayBuffer())
//                 .then((buffer) => Buffer.from(buffer))
//                 .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
//         }
//         // const fontString = await fs.readFile(path.resolve(process.cwd(), 'fonts', 'Roboto-Medium.ttf')).then
//         // (buffer => buffer.toString('base64'));

//         // rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'tutor.ejs'), {
//         //     tutor_name: tutor.shortName,
//         //     mephist_rating: tutor.legacyRating?.avgRating ?? "-",
//         //     daily_rating: tutor.rating?.avgRating ?? "-",
//         //     reviews: getNoun(tutor.reviewsCount, "Отзыв", "Отзыва", "Отзывов"),
//         //     reviews_count: tutor.reviewsCount,
//         //     materials: getNoun(tutor.materialsCount, "Материал", "Материала", "Материалов"),
//         //     materials_count: tutor.materialsCount,
//         //     quotes: getNoun(tutor.quotesCount, "Цитата", "Цитаты", "Цитат"),
//         //     quotes_count: tutor.quotesCount,
//         //     image: avatarString,
//         //     font_path: fontPath,
//         // }).then((html) => Buffer.from(html));
//     } else if (type == "materials") {
//         const material = await prisma.material.findUnique({
//             where: {
//                 id: id
//             },
//             select: {
//                 semesters: {
//                     select: {
//                         name: true
//                     }
//                 },
//                 faculties: {
//                     select: {
//                         name: true
//                     }
//                 },
//                 disciplines: {
//                     select: {
//                         name: true
//                     }
//                 },
//                 title: true,
//                 text: true,
//                 user: {
//                     select: {
//                         name: true,
//                         image: {
//                             select: {
//                                 url: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//         if (!material) {
//             returnNotFound(res);
//             return;
//         }
//         // const material = await getMaterial(id);
//         let avatarString: string = "";
//         if (material.user?.image) {
//             avatarString = await fetch(material.user.image.url)
//                 .then((res) => res.arrayBuffer())
//                 .then((buffer) => Buffer.from(buffer))
//                 .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
//         }


//         rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'material.ejs'), {
//             nickname: material.user?.name ?? "",
//             header: material.title,
//             description: material.text,
//             semester: material.semesters[0]?.name ?? "",
//             faculty: material.faculties[0]?.name ?? "",
//             discipline: material.disciplines[0]?.name ?? "",
//             image: avatarString,
//             font_path: fontPath,
//         }).then((html) => Buffer.from(html));
//     } else if (type == "quotes") {
//         const quote = await prisma.quote.findUnique({
//             where: {
//                 id: id
//             },
//             select: {
//                 text: true,
//                 tutor: {
//                     select: {
//                         shortName: true,
//                     }
//                 }
//             }
//         });

//         if (!quote) {
//             returnNotFound(res);
//             return;
//         }
//         const wrappedBody = getWrappedText(italic, quote.text, 915, 8, 1.0);
//         const wrappedTutor = getWrappedText(regular, quote.tutor.shortName, 1200, 1, 1.33);
//         // console.log(wrappedBody, quote.body);
//         // console.log(wrappedTutor, tutorName);
//         rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'quote.ejs'), {
//             body: wrappedBody,
//             tutor_name: wrappedTutor[0],
//             font_path: fontPath
//         }).then((html) => Buffer.from(html));
//     } else if (type == "users") {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: id
//             },
//             select: {
//                 name: true,
//                 image: {
//                     select: {
//                         url: true
//                     }
//                 },
//                 role: true,
//                 rating: true,
//                 // reviewsCount: true,
//                 // materialsCount: true,
//                 // quotesCount: true,
//             }
//         });
//         if (!user) {
//             returnNotFound(res);
//             return;
//         }
//         // TODO: add dead cat
//         let avatarString: string = "";
//         if (user.image) {
//             avatarString = await fetch(user.image.url)
//                 .then((res) => res.arrayBuffer())
//                 .then((buffer) => Buffer.from(buffer))
//                 .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
//         }
//         // rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'user.ejs'), {
//         //     reviews: getNoun(user.reviewsCount, "Отзыв", "Отзыва", "Отзывов"),
//         //     reviews_count: user.reviewsCount,
//         //     materials: getNoun(user.materialsCount, "Материал", "Материала", "Материалов"),
//         //     materials_count: user.materialsCount,
//         //     quotes: getNoun(user.quotesCount, "Цитата", "Цитаты", "Цитат"),
//         //     quotes_count: user.quotesCount,
//         //     nickname: user.name,
//         //     user_type: user.role == "tutor" ? "Преподаватель" : "Студент",
//         //     rating: user.rating,
//         //     image: avatarString,
//         //     font_path: fontPath,
//         // }).then((html) => Buffer.from(html));
//     } else if (type == "reviews") {
//         const review = await prisma.review.findUnique({
//             where: {
//                 id: id
//             },
//             select: {
//                 tutor: {
//                     select: {
//                         firstName: true,
//                         lastName: true,
//                         fatherName: true,
//                         images: {
//                             select: {
//                                 url: true
//                             }
//                         }
//                     }
//                 },
//                 title: true,
//                 text: true,
//                 user: {
//                     select: {
//                         name: true,
//                         image: {
//                             select: {
//                                 url: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//         if (!review) {
//             returnNotFound(res);
//             return;
//         }

//         let avatarString: string = "";
//         if (review.user?.image) {
//             avatarString = await fetch(review.user.image.url)
//                 .then((res) => res.arrayBuffer())
//                 .then((buffer) => Buffer.from(buffer))
//                 .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
//         }
//         let tutorAvatarString: string = "";
//         if (review.tutor.images.length > 0) {
//             // const avatarUrl = "https://logos-world.net/wp-content/uploads/2021/08/Among-Us-Logo.png";
//             // fetch image from url and convert it to buffer
//             tutorAvatarString = await fetch(review.tutor.images[0].url)
//                 .then((res) => res.arrayBuffer())
//                 .then((buffer) => Buffer.from(buffer))
//                 .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
//         }
//         rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'review.ejs'), {
//             nickname: review.user?.name ?? "",
//             header: review.title,
//             body: review.text,
//             tutor_name: review.tutor.lastName + " " + (review.tutor.firstName ? review.tutor.firstName[0] + "." : "") +
//                 (review.tutor.fatherName ? review.tutor.fatherName[0] + "." : ""),
//             tutor_image: tutorAvatarString,
//             image: avatarString,
//             font_path: fontPath,
//         }).then((html) => Buffer.from(html));
//     } else {
//         returnNotFound(res);
//         return;
//     }

//     // @ts-ignore
//     const image = sharp(rendered).png();

//     image.cork();
//     image.pipe(res);
//     image.uncork();
// }
