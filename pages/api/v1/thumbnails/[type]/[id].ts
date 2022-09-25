import type {NextApiRequest, NextApiResponse} from "next";

import path from 'path'

import {getTutor} from "../../tutors/[id]";
import ejs from "ejs";
import sharp from "sharp";
import {UUID_REGEX} from "../../tutors/[id]/materials";
import prisma from "lib/database/prisma";
import {getTutorName} from "../../../../../lib/utils";
import {getWrappedText, italic, regular} from "../../../../../lib/textSize";
// import ejs template from file


// export const config = {
//     runtime: 'experimental-edge',
// }

const fontPath = process.env.LOCAL == "true" ?
    "'cloud-functions/main/fonts/Montserrat-Medium.ttf'" :
    "'Montserrat-Medium.ttf'";
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

function returnNotFound(res: NextApiResponse) {
    const image = sharp(path.resolve(process.cwd(), 'images', '404.png'));
    image.cork();
    image.pipe(res);
    image.uncork();
    res.status(404)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    let {id, type} = req.query;
    if (!id || typeof id !== "string" || !id.replace(".png", "").match(UUID_REGEX) || !type || typeof type !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    res.setHeader('Content-Type', 'image/png');
    id = id.replace(".png", "");
    let rendered: Buffer;
    sharp.cache(false);
    // sharp.simd(false);
    sharp.concurrency(1);
    if (type == "tutors") {
        const tutor = await getTutor(id);
        if (!tutor) {
            returnNotFound(res);
            return;
        }
        let avatarString: string = "";
        if (tutor.images.length > 0) {
            // const avatarUrl = "https://logos-world.net/wp-content/uploads/2021/08/Among-Us-Logo.png";
            // fetch image from url and convert it to buffer
            avatarString = await fetch(tutor.images[0])
                .then((res) => res.arrayBuffer())
                .then((buffer) => Buffer.from(buffer))
                .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
        }
        // const fontString = await fs.readFile(path.resolve(process.cwd(), 'fonts', 'Roboto-Medium.ttf')).then
        // (buffer => buffer.toString('base64'));

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
            font_path: fontPath,
        }).then((html) => Buffer.from(html));
    } else if (type == "materials") {
        const material = await prisma.material.findUnique({
            where: {
                id: id
            },
            select: {
                semesters: {
                    select: {
                        name: true
                    }
                },
                faculties: {
                    select: {
                        name: true
                    }
                },
                disciplines: {
                    select: {
                        name: true
                    }
                },
                header: true,
                description: true,
                user: {
                    select: {
                        name: true,
                        image: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
        });
        if (!material) {
            returnNotFound(res);
            return;
        }
        // const material = await getMaterial(id);
        let avatarString: string = "";
        if (material.user?.image) {
            avatarString = await fetch(material.user.image.url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => Buffer.from(buffer))
                .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
        }


        rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'material.ejs'), {
            nickname: material.user?.name ?? "",
            header: material.header,
            description: material.description,
            semester: material.semesters[0]?.name ?? "",
            faculty: material.faculties[0]?.name ?? "",
            discipline: material.disciplines[0]?.name ?? "",
            image: avatarString,
            font_path: fontPath,
        }).then((html) => Buffer.from(html));
    } else if (type == "quotes") {
        const quote = await prisma.quote.findUnique({
            where: {
                id: id
            },
            select: {
                body: true,
                tutor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        fatherName: true,
                    }
                }
            }
        });

        if (!quote) {
            returnNotFound(res);
            return;
        }
        const wrappedBody = getWrappedText(italic, quote.body, 915, 8, 1.0);
        const tutorName = getTutorName(quote.tutor);
        const wrappedTutor = getWrappedText(regular, tutorName, 1200, 1, 1.33);
        // console.log(wrappedBody, quote.body);
        // console.log(wrappedTutor, tutorName);
        rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'quote.ejs'), {
            body: wrappedBody,
            tutor_name: wrappedTutor[0],
            font_path: fontPath
        }).then((html) => Buffer.from(html));
    } else if (type == "users") {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                name: true,
                image: {
                    select: {
                        url: true
                    }
                },
                role: true,
                rating: true,
                _count: {
                    select: {
                        reviews: true,
                        materials: true,
                        quotes: true,
                    }
                }
            }
        });
        if (!user) {
            returnNotFound(res);
            return;
        }
        let avatarString: string = "";
        if (user.image) {
            avatarString = await fetch(user.image.url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => Buffer.from(buffer))
                .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
        }
        rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'user.ejs'), {
            reviews: getNoun(user._count.reviews, "Отзыв", "Отзыва", "Отзывов"),
            reviews_count: user._count.reviews,
            materials: getNoun(user._count.materials, "Материал", "Материала", "Материалов"),
            materials_count: user._count.materials,
            quotes: getNoun(user._count.quotes, "Цитата", "Цитаты", "Цитат"),
            quotes_count: user._count.quotes,
            nickname: user.name,
            user_type: user.role == "tutor" ? "Преподаватель" : "Студент",
            rating: user.rating,
            image: avatarString,
            font_path: fontPath,
        }).then((html) => Buffer.from(html));
    } else if (type == "reviews") {
        const review = await prisma.review.findUnique({
            where: {
                id: id
            },
            select: {
                tutor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        fatherName: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                },
                header: true,
                body: true,
                user: {
                    select: {
                        name: true,
                        image: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
        });
        if (!review) {
            returnNotFound(res);
            return;
        }

        let avatarString: string = "";
        if (review.user?.image) {
            avatarString = await fetch(review.user.image.url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => Buffer.from(buffer))
                .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
        }
        let tutorAvatarString: string = "";
        if (review.tutor.images.length > 0) {
            // const avatarUrl = "https://logos-world.net/wp-content/uploads/2021/08/Among-Us-Logo.png";
            // fetch image from url and convert it to buffer
            tutorAvatarString = await fetch(review.tutor.images[0].url)
                .then((res) => res.arrayBuffer())
                .then((buffer) => Buffer.from(buffer))
                .then((buffer) => "data:image/png;base64," + buffer.toString('base64'));
        }
        rendered = await ejs.renderFile(path.resolve(process.cwd(), 'thumbnails', 'review.ejs'), {
            nickname: review.user?.name ?? "",
            header: review.header,
            body: review.body,
            tutor_name: review.tutor.lastName + " " + (review.tutor.firstName ? review.tutor.firstName[0] + "." : "") +
                (review.tutor.fatherName ? review.tutor.fatherName[0] + "." : ""),
            tutor_image: tutorAvatarString,
            image: avatarString,
            font_path: fontPath,
        }).then((html) => Buffer.from(html));
    } else {
        returnNotFound(res);
        return;
    }

    const image = sharp(rendered).png();

    image.cork();
    image.pipe(res);
    image.uncork();
}
