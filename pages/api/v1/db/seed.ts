// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import kn from "knex";
import {knexSnakeCaseMappers} from "lib/database/objection"

import json from "parsing/combined/data.json"
import tutor_imgs from "parsing/tutor_imgs.json"
import mephist_imgs from "parsing/mephist_imgs.json"
import mephist_fils from "parsing/mephist_files.json"
import filesJ from "parsing/File.json"
// import {LegacyRating, Material, Tutor, Quote, Review, PrismaClient, Prisma} from '@prisma/client';
// import prisma from "../../../../lib/database/prisma";

function strToDateTime(dtStr: string): Date {
    if (!dtStr) return new Date()
    let dateParts = dtStr.split(".");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], +timeParts[0], +timeParts[1], +timeParts[2]);
}

function strToDate(dtStr: string): Date {
    if (!dtStr) return new Date()
    let dateParts = dtStr.split("/");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}


interface JsonQuote {
    "Оценка": string;
    "Текст": string;
    "Ник и дата": string;
}

interface JsonReview {
    "Название": string;
    "Текст": string;
    "Ник": string;
    "Дата": string;
    "mark": string;
    "votesNumber": string;
}

interface JsonTutor {
    "url": string | null;
    "skypeLink": string | null;
    "cafedras": string[];
    "directions": string[];
    "name": string;
    "lastName": string | null;
    "nickName": string | null;
    "fatherName": string | null;
    "reviews": JsonReview[];
    "mailReviews": {
        [name: string]: string
    };
    "mailNames": string[];
    "quotes": JsonQuote[];
    "mailMark": {
        "value": string,
        "count": string
    };
    "personality": {
        "value": string,
        "count": string
    };
    "quality": {
        "value": string,
        "count": string
    };
    "tests": {
        "value": string,
        "count": string
    };
    "photo": string[];
    "materials": string[];
}

interface JsonMaterial {
    'Тип материала': string | null;
    'Предмет': string | null;
    'Факультет': string | null;
    'Семестр': string | null;
    'Преподаватель': string | null;
    'Описание': string | null;
    'Прислал': string | null;
    'Дата добавления': string;
    'Ссылка': string;
    'Название': string | null;
}

interface JsonType {
    cafedras: {
        [name: string]: {
            tutors: {
                [id: string]: {
                    [name: string]: string[]
                }
            }
        }
    }[]
    tutors: {
        [id: string]: JsonTutor
    }[]
    materials: {
        [id: string]: JsonMaterial
    }[]
}

interface FilesJson {
    status: string;
    fileMap: {
        [name: string]: string
    }
}

interface JsonFile {
    "id": string,
    "url": string,
    "createdAt": string,
    "filename": string,
    "isImage": boolean,
    "userId": string | null,
    "tutorId": string | null,
    "materialId": string | null
}

interface Tutor {
    id: string,
    first_name: string | null,
    last_name: string | null,
    father_name: string | null,
    nick_name: string | null,
    url: string | null,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
    full_name: string | null,
    short_name: string | null,
}

interface User {
    id: string,
    name: string | null,
    image_id: string | null,
    role: string,
    email: string | null,
    email_verified: Date | null,
    created_at: Date,
    updated_at: Date,
    banned: boolean,
    banned_reason: string | null,
    banned_until: Date | null,
    banned_at: Date | null,
    rating: number,
    bio: string | null,
}

interface File {
    id: string,
    url: string,
    alt_url: string | null,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
    filename: string,
    user_id: string | null,
    tutor_id: string | null,
    material_id: string | null,
    tag: string | null,
    size: number,
}

interface LegacyRating {
    id: string,
    personality: number,
    personality_count: number,
    exams: number,
    exams_count: number,
    quality: number,
    quality_count: number,
    tutor_id: string,
    avg_rating: number,
    rating_count: number,
}

interface VerificationToken {
    identifier: string,
    token: string,
    expires: Date,
    created_at: Date,
    updated_at: Date,
}

interface Internal {
    name: string,
    value: string,
    expires: Date | null,
    created_at: Date,
    updated_at: Date,
}

interface Quote {
    id: string,
    text: string,
    tutor_id: string,
    user_id: string | null,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
}

interface News {
    id: string,
    text: string,
    title: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
}

interface Review {
    id: string,
    title: string,
    text: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
    legacy_nickname: string | null,
    user_id: string | null,
    tutor_id: string,
}

interface Account {
    id: string,
    user_id: string,
    type: string,
    provider: string,
    provider_account_id: string,
    refresh_token: string | null,
    access_token: string | null,
    expires_at: number | null,
    token_type: string | null,
    scope: string | null,
    id_token: string | null,
    session_state: string | null,
    created_at: Date,
    updated_at: Date,
}

interface Session {
    id: string,
    session_token: string,
    user_id: string,
    expires: Date,
    created_at: Date,
    updated_at: Date,
}

interface Material {
    id: string,
    text: string | null,
    title: string | null,
    user_id: string | null,
    tutor_id: string | null,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
}

interface Rate {
    id: string,
    punctuality: number,
    personality: number,
    exams: number,
    quality: number,
    tutor_id: string,
    user_id: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
}

interface Semester {
    id: string,
    name: string,
}

interface Discipline {
    id: string,
    name: string,
}

interface Faculty {
    id: string,
    name: string,
}

interface Document {
    id: string,
    data: string,
    user_id: string | null,
    tutor_id: string | null,
    material_id: string | null,
    review_id: string | null,
    quote_id: string | null,
    news_id: string | null,
    type: string,
    created_at: Date,
    updated_at: Date,
}

interface Comment {
    id: string,
    text: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
    user_id: string,
    review_id: string | null,
    material_id: string | null,
    news_id: string | null,
    parent_id: string | null,
}

interface MaterialSemester {
    id: string,
    material_id: string,
    semester_id: string,
}

interface MaterialDiscipline {
    id: string,
    discipline_id: string,
    material_id: string,
}

interface MaterialFaculty {
    id: string,
    faculty_id: string,
    material_id: string,
}

interface TutorDiscipline {
    id: string,
    disciplineId: string,
    tutor_id: string,
}

interface TutorFaculty {
    id: string,
    tutor_id: string,
    faculty_id: string,
}

interface Reaction {
    id: string,
    user_id: string,
    quote_id: string | null,
    material_id: string | null,
    review_id: string | null,
    comment_id: string | null,
    news_id: string | null,
    created_at: Date,
    updated_at: Date,
    liked: boolean,
}

// type LegacyRatingDTO = Omit<LegacyRating, "id" | "tutorId">;
// type QuoteDTO = Omit<Quote, "id" | "tutorId" | "userId">;
// type MaterialDTO =
//     Omit<Material, "id" | "tutorId" | "userId"> & {
//     faculties: { connect: { id: string }[] } | undefined,
//     disciplines: { connect: { id: string } } | undefined,
//     semesters: { connect: { id: string }[] },
//     files: {connect: {id: string}[]}
// };
// type ReviewDTO = Omit<Review, "id" | "tutorId" | "userId">;
// type Semester =
//     "Б1"
//     | "Б2"
//     | "Б3"
//     | "Б4"
//     | "Б5"
//     | "Б6"
//     | "Б7"
//     | "Б8"
//     | "М1"
//     | "М2"
//     | "М3"
//     | "М4"
//     | "А1"
//     | "А2"
//     | "А3"
//     | "А4"
//     | "А5"
//     | "А6"
//     | "А7"
//     | "А8"
// type TutorDTO =
//     Omit<Tutor, "id" | "updated"> & {
//     legacyRating: { create: LegacyRatingDTO },
//     quotes: { create: QuoteDTO[] },
//     materials: { create: MaterialDTO[] },
//     reviews: { create: ReviewDTO[] },
//     faculties: { connect: { id: string }[] },
//     disciplines: { connect: { id: string }[] },
//     images: { connect: { id: string }[] }
// };
// type FileDTO = {
//     status: string,
//     fileMap: { [id: string]: string }
// };

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<object>
// ) {
//     if (process.env.LOCAL !== "true") {
//         res.status(403).json({status: "not allowed"});
//         return;
//     }
//     const tutors: TutorDTO[] = []
//
//     // await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
//     const data = json as unknown as JsonType;
//
//     const tutor_images: FileDTO = tutor_imgs;
//     const mephist_images: FileDTO = mephist_imgs;
//     const mephist_files: FileDTO = mephist_fils;
//
//     const newTutors = new Set<string>();
//     const disciplines = new Set<string>();
//     const faculties = new Set<string>();
//     const addedMaterials = new Set<string>();
//     const semestersMapping: { [id: string]: string } = {
//         "Б1": "01",
//         "Б2": "02",
//         "Б3": "03",
//         "Б4": "04",
//         "Б5": "05",
//         "Б6": "06",
//         "Б7": "07",
//         "Б8": "08",
//         "М1": "09",
//         "М2": "10",
//         "М3": "11",
//         "М4": "12"
//     };
//
//     for (const {tutors} of Object.values(data.cafedras)) {
//         for (const id of Object.keys(tutors)) {
//             newTutors.add(id)
//         }
//         for (const directions of Object.values(tutors)) {
//
//             for (const direction of Object.keys(directions)) {
//                 disciplines.add(direction)
//             }
//         }
//     }
//
//     for (const material of Object.values(data.materials)) {
//         const jsonMaterial = material as unknown as JsonMaterial;
//         jsonMaterial.Факультет?.split("; ").forEach(faculty => faculties.add(faculty.trim()));
//         if (jsonMaterial.Предмет) {
//             disciplines.add(jsonMaterial.Предмет)
//         }
//     }
//
//     await prisma.discipline.deleteMany();
//     await prisma.faculty.deleteMany();
//     await prisma.semester.deleteMany();
//     await prisma.material.deleteMany();
//
//     await prisma.discipline.createMany({
//         data: Array.from(disciplines).map(el => {
//             return {name: el}
//         }),
//         skipDuplicates: true
//     })
//
//     await prisma.faculty.createMany({
//         data: Array.from(faculties).map(el => {
//             return {name: el}
//         }),
//         skipDuplicates: true
//     })
//
//     await prisma.semester.createMany({
//         data: Object.keys(semestersMapping).map(el => {
//             return {name: el}
//         }),
//         skipDuplicates: true
//     })
//     const facultyModels = (await prisma.faculty.findMany()).reduce((obj: { [name: string]: string }, el) => {
//         obj[el.name] = el.id;
//         return obj;
//     }, {});
//     const disciplineModels = (await prisma.discipline.findMany()).reduce((obj: { [name: string]: string }, el) => {
//         obj[el.name] = el.id;
//         return obj;
//     }, {});
//     const semesterModels = (await prisma.semester.findMany()).reduce((obj: { [name: string]: string }, el) => {
//         obj[semestersMapping[el.name]] = el.id;
//         return obj;
//     }, {});
//
//     for (let [id, tutorData] of Object.entries(data.tutors)) {
//         const jsonTutor = tutorData as unknown as JsonTutor;
//         const tutor: TutorDTO = {
//             firstName: jsonTutor.name,
//             lastName: jsonTutor.lastName,
//             fatherName: jsonTutor.fatherName,
//             nickName: jsonTutor.nickName,
//             url: jsonTutor.url,
//             legacyRating: {
//                 create: {
//                     personality: Number(jsonTutor.personality.value),
//                     personalityCount: Number(jsonTutor.personality.count),
//                     exams: Number(jsonTutor.tests.value),
//                     examsCount: Number(jsonTutor.tests.count),
//                     quality: Number(jsonTutor.quality.value),
//                     qualityCount: Number(jsonTutor.quality.count)
//                 }
//             },
//             quotes: {create: []},
//             materials: {create: []},
//             reviews: {create: []},
//             faculties: {connect: []},
//             disciplines: {connect: []},
//             images: tutor_images["fileMap"][`${id}.jpg`] ? {connect: [{id: tutor_images["fileMap"][`${id}.jpg`]}]} : {connect: []}
//         }
//
//         for (const [key, value] of Object.entries(mephist_images.fileMap)) {
//             if (key.startsWith(id + "-")) {
//                 tutor.images.connect.push({id: value})
//             }
//         }
//
//         for (const quote of jsonTutor.quotes) {
//             tutor.quotes.create.push({
//                 body: quote.Текст,
//                 uploaded: strToDateTime(quote["Ник и дата"].split(' ').slice(-2).join(' '))
//             })
//         }
//         for (const materialId of jsonTutor.materials) {
//             const jsonMaterial = data.materials[materialId as any] as unknown as JsonMaterial;
//             const files: { id: string }[] = [];
//             for (const [key, value] of Object.entries(mephist_files.fileMap)) {
//                 if (key.startsWith(materialId + "-")) {
//                     files.push({id: value})
//                 }
//             }
//             tutor.materials.create.push({
//                 description: jsonMaterial.Описание,
//                 header: jsonMaterial.Название === null || jsonMaterial.Название === "" ? "Без названия" : jsonMaterial.Название,
//                 faculties: {
//                     connect: jsonMaterial.Факультет?.split("; ").map(el => {
//                         return {
//                             id: facultyModels[el.trim()]
//                         }
//                     }) || []
//                 },
//                 disciplines: jsonMaterial.Предмет !== null ? {connect: {id: disciplineModels[jsonMaterial.Предмет]}} : undefined,
//                 uploaded: new Date(jsonMaterial["Дата добавления"]),
//                 semesters: {
//                     connect: jsonMaterial.Семестр && !jsonMaterial.Семестр.split("; ").includes("Аспирантура") ?
//                         jsonMaterial.Семестр.split("; ").map(el => {
//                             return {id: semesterModels[el]}
//                         }) : []
//                 },
//                 files: {connect: files}
//             })
//             addedMaterials.add(materialId)
//         }
//         for (const review of jsonTutor.reviews) {
//             const jsonReview = review as unknown as JsonReview;
//             tutor.reviews.create.push({
//                 body: jsonReview.Текст,
//                 header: jsonReview.Название === null || jsonReview.Название === "" ? "Без названия" : jsonReview.Название,
//                 legacyNickname: jsonReview.Ник,
//                 uploaded: strToDate(jsonReview.Дата)
//             })
//
//         }
//
//         for (const [name, review] of Object.entries(jsonTutor.mailReviews)) {
//             tutor.reviews.create.push({
//                 body: review,
//                 header: "Отзыв с мифиста",
//                 legacyNickname: name,
//                 uploaded: new Date("01/01/2005")
//             })
//         }
//         if (!newTutors.has(id)) {
//             for (const el of Object.values(tutorData.directions)) {
//                 disciplines.add(el)
//             }
//         } else {
//             for (const el of Object.values(tutorData.directions)) {
//                 faculties.add(el)
//             }
//         }
//         tutors.push(tutor)
//     }
//
//     for (const [id, value] of Object.entries(data.materials)) {
//         if (!addedMaterials.has(id)) {
//             const jsonMaterial = value as unknown as JsonMaterial;
//             const els = Object.entries(mephist_files["fileMap"]).filter(([key]) => key.startsWith(id + "-"))
//             await prisma.material.create({
//                     data: {
//                         files: {connect: els.length ? els.map(([key, value]) => ({id: value})) : undefined}, description: jsonMaterial.Описание,
//                         header: jsonMaterial.Название === null || jsonMaterial.Название === "" ? "Без названия" : jsonMaterial.Название,
//                         faculties: {
//                             connect: jsonMaterial.Факультет?.split("; ").map(el => {
//                                 return {
//                                     id: facultyModels[el.trim()]
//                                 }
//                             }) || []
//                         },
//                         disciplines: jsonMaterial.Предмет !== null ? {connectOrCreate: {where: {name: jsonMaterial.Предмет}, create: {name: jsonMaterial.Предмет}}} : undefined,
//                         uploaded: new Date(jsonMaterial["Дата добавления"]),
//                         semesters: {
//                             connect: jsonMaterial.Семестр && !jsonMaterial.Семестр.split("; ").includes("Аспирантура") ?
//                                 jsonMaterial.Семестр.split("; ").map(el => {
//                                     return {id: semesterModels[el]}
//                                 }) : []
//                         },
//                     }
//                 }
//             )
//         }
//     }
//
//     await prisma.tutor.deleteMany();
//     await prisma.quote.deleteMany();
//     for (const tutor of tutors) {
//         console.log(JSON.stringify(tutor))
//
//         const newTutor = await prisma.tutor.create({
//             data: tutor,
//         })
//         console.log(newTutor)
//     }
//     // });
//     res.status(200).json({tutors});
//
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {

    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }

    const knex = kn({
        client: "pg",
        connection: process.env.POSTGRESQL_URL,

        ...knexSnakeCaseMappers()
    });
    knex.initialize();
    const data: JsonType = json as unknown as JsonType;
    const tutor_images: FilesJson = tutor_imgs as FilesJson;
    const mephist_images: FilesJson = mephist_imgs as FilesJson;
    const mephist_files: FilesJson = mephist_fils as FilesJson;
    const files_file: JsonFile[] = filesJ as JsonFile[];


    const newTutors = new Set<string>();
    const disciplines = new Set<string>();
    const faculties = new Set<string>();
    const addedMaterials = new Set<string>();
    const semestersMap: { [id: string]: string } = {
        "Б1": "01",
        "Б2": "02",
        "Б3": "03",
        "Б4": "04",
        "Б5": "05",
        "Б6": "06",
        "Б7": "07",
        "Б8": "08",
        "М1": "09",
        "М2": "10",
        "М3": "11",
        "М4": "12"
    };

    for (const {tutors} of Object.values(data.cafedras)) {
        for (const id of Object.keys(tutors)) {
            newTutors.add(id)
        }
        for (const directions of Object.values(tutors)) {

            for (const direction of Object.keys(directions)) {
                disciplines.add(direction)
            }
        }
    }

    for (const material of Object.values(data.materials)) {
        const jsonMaterial = material as unknown as JsonMaterial;
        jsonMaterial.Факультет?.split("; ").forEach(faculty => faculties.add(faculty.trim()));
        if (jsonMaterial.Предмет) {
            disciplines.add(jsonMaterial.Предмет)
        }
    }


    await Promise.all([
        knex("disciplines").del(),
        knex("faculties").del(),
        knex("semesters").del(),
        knex("materials").del(),
        knex("tutors").del(),
        knex("quotes").del(),
        knex("files").del()
    ]);

    // await prisma.discipline.createMany({
    //     data: Array.from(disciplines).map(el => {
    //         return {name: el}
    //     }),
    //     skipDuplicates: true
    // })
    // rewrite code above to use knex instead of prisma
    const [disciplinesMapping, facultiesMapping, semestersMapping, filesMapping] = await Promise.all([
        knex<Discipline>("disciplines").insert(Array.from(disciplines).map(el => {
            return {name: el}
        })).onConflict('name').ignore().returning('*').then(el => el.reduce((acc: { [name: string]: string }, el) => {
            acc[el.name] = el.id;
            return acc;
        }, {})),
        knex<Faculty>("faculties").insert(Array.from(faculties).map(el => {
            return {name: el}
        })).onConflict('name').ignore().returning('*').then(el => el.reduce((acc: { [name: string]: string }, el) => {
            acc[el.name] = el.id;
            return acc;
        }, {})),
        knex<Semester>("semesters").insert(Object.keys(semestersMap).map(el => {
            return {name: el}
        })).onConflict('name').ignore().returning('*').then(el => el.reduce((acc: { [name: string]: string }, el) => {
            acc[el.name] = el.id;
            return acc;
        }, {})),
        ...(() => {
            const arr = files_file.map(({id, url, createdAt, filename, isImage}) => {
                return {id, url, created_at: new Date(createdAt), filename, alt_url: isImage.toString()}
            });
            const chunks = [];
            while (arr.length) {
                chunks.push(arr.splice(0, 65535 / 5));
            }
            return chunks.map(el => knex<File>("files").insert(el).onConflict('id').ignore().returning('*'));
        })()
        // knex<File>("files").insert().onConflict('id').ignore().returning('*')
    ]);
    // split array of files into chunks of 65535 elements

    const promises = Object.entries(data.tutors).map(([id, tutor]) => {
        const jsonTutor = tutor as unknown as JsonTutor;
        const newTutor: Omit<Tutor, "full_name" | "short_name" | "id" | "created_at" | "updated_at" | "deleted_at"> = {
            first_name: jsonTutor.name,
            last_name: jsonTutor.lastName,
            father_name: jsonTutor.fatherName,
            nick_name: jsonTutor.nickName,
            url: jsonTutor.url,
        };

        async function createTutor() {
            // add disciplines


            const tutor = await knex<Tutor>("tutors").insert(newTutor).onConflict('id').ignore().returning(["id"]).then(el => el[0]);


            const images = tutor_images["fileMap"][`${id}.jpg`] ? [{id: tutor_images["fileMap"][`${id}.jpg`]}] : [];
            // add mephist_images to images
            images.push(...(Object.entries(mephist_images.fileMap).filter(
                ([key]) => key.startsWith(`${id}-`)).map(([, value]) => ({id: value}))));
            await Promise.all([
                (async () => {
                    if (!newTutors.has(id)) {
                        const arr = jsonTutor.directions.filter(el => !(el in disciplinesMapping)).map(el => {
                            return {name: el}
                        });

                        if (arr.length) {
                            await knex<Discipline>("disciplines").insert(arr).onConflict('name').ignore().returning('*').then(el => el.forEach(el => disciplinesMapping[el.name] = el.id));
                            await knex<TutorDiscipline>("tutors_disciplines").insert(arr.map(el => {
                                return {tutor_id: tutor.id, discipline_id: disciplinesMapping[el.name]}
                            }));
                        }
                    } else {
                        const arr = jsonTutor.directions.filter(el => !(el in facultiesMapping)).map(el => {
                            return {name: el}
                        })
                        if (arr.length) {
                            await knex<Faculty>("faculties").insert(arr).onConflict('name').ignore().returning('*').then(el => el.forEach(el => facultiesMapping[el.name] = el.id));
                            await knex<TutorFaculty>("tutors_faculties").insert(arr.map(el => {
                                return {tutor_id: tutor.id, faculty_id: facultiesMapping[el.name]}
                            }));
                        }
                    }
                })(),
                (async () => {
                    // add cafedras
                    await knex<Faculty>("faculties").insert(jsonTutor.cafedras.map(el => {
                        return {name: el}
                    })).onConflict('name').ignore().returning('*').then(el => el.forEach(el => facultiesMapping[el.name] = el.id));
                    jsonTutor.cafedras.length > 0 ? await knex<TutorFaculty>("tutors_faculties").insert(jsonTutor.cafedras.map(el => {
                        return {tutor_id: tutor.id, faculty_id: facultiesMapping[el]}
                    })) : [];
                })(),
                // add legacyRating
                knex<LegacyRating>("legacy_ratings").insert({
                    personality: Number(jsonTutor.personality.value),
                    personality_count: Number(jsonTutor.personality.count),
                    exams: Number(jsonTutor.tests.value),
                    exams_count: Number(jsonTutor.tests.count),
                    quality: Number(jsonTutor.quality.value),
                    quality_count: Number(jsonTutor.quality.count),
                    tutor_id: tutor.id
                }).onConflict('tutor_id').ignore(),
                // add images
                knex<File>("files").update({tutor_id: tutor.id}).whereIn('id', images.map(el => el.id)),
                // add quotes
                jsonTutor.quotes.length > 0 ? knex<Quote>("quotes").insert(jsonTutor.quotes.map(el => ({
                    text: el.Текст,
                    createdAt: strToDateTime(el["Ник и дата"].split(' ').slice(-2).join(' ')),
                    tutorId: tutor.id
                }))) : Promise.resolve([]),
            ]);
            // add materials and their files
            const materials = jsonTutor.materials.map(el => ({
                ...data.materials[el as any] as unknown as JsonMaterial,
                materialId: el
            }));
            const materialsModel = materials.length > 0 ? await knex<Material>("materials").insert(materials.map(el => ({
                title: el.Название === null || el.Название === "" ? "Без названия" : el.Название,
                text: el.Описание,
                createdAt: new Date(el["Дата добавления"]),
                tutorId: tutor.id
            }))).returning(["id"]) : [];
            // get array of files for material, then add them to db using materialsModel
            const materialFiles = materials.flatMap((el, i) => {
                const files: { id: string, materialNum: number }[] = [];
                for (const [key, value] of Object.entries(mephist_files.fileMap)) {
                    if (key.startsWith(el.materialId + "-")) {
                        files.push({id: value, materialNum: i});
                    }
                }
                return files;
            });
            // add disciplines to materials
            const materialDisciplines = materials.flatMap((el, i) => {
                const disciplines: { id: string, materialNum: number }[] = [];
                for (const [key, value] of Object.entries(disciplinesMapping)) {
                    if (key == el.Предмет) {
                        disciplines.push({id: value, materialNum: i});
                    }
                }
                return disciplines;
            });
            // add faculties to materials
            const materialFaculties = materials.flatMap((el, i) => {
                const faculties: { id: string, materialNum: number }[] = [];
                for (const [key, value] of Object.entries(facultiesMapping)) {
                    if (key == el.Факультет) {
                        faculties.push({id: value, materialNum: i});
                    }
                }
                return faculties;
            });
            // add semesters to materials
            const materialSemesters = materials.flatMap((el, i) => {
                const semesters: { id: string, materialNum: number }[] = [];
                for (const [key, value] of Object.entries(semestersMapping)) {
                    if (el.Семестр?.split("; ").includes(semestersMap[key.trim()])) {
                        semesters.push({id: value, materialNum: i});
                    }
                    // console.log(el.Семестр?.split("; "), semestersMap[key.trim()], key, semestersMap);
                }
                return semesters;
            });
            await Promise.all([
                ...materialFiles.map(el => knex<File>("files").update({material_id: materialsModel[el.materialNum].id}).where({id: el.id})),
                materialDisciplines.length > 0 ? knex<MaterialDiscipline>("materials_disciplines").insert(materialDisciplines.map(el => ({
                    material_id: materialsModel[el.materialNum].id,
                    discipline_id: el.id
                }))) : Promise.resolve([]),
                materialFaculties.length > 0 ? knex<MaterialFaculty>("materials_faculties").insert(materialFaculties.map(el => ({
                    material_id: materialsModel[el.materialNum].id,
                    faculty_id: el.id
                }))) : Promise.resolve([]),
                materialSemesters.length > 0 ? knex<MaterialSemester>("materials_semesters").insert(materialSemesters.map(el => ({
                    material_id: materialsModel[el.materialNum].id,
                    semester_id: el.id
                }))) : Promise.resolve([]),
            ]);

            // add reviews
            const reviews = jsonTutor.reviews.map(el =>
                ({
                    title: el.Название === null || el.Название === "" ? "Без названия" : el.Название,
                    text: el.Текст,
                    createdAt: strToDate(el.Дата),
                    legacyNickname: el.Ник,
                    tutorId: tutor.id
                })).concat(
                Object.entries(jsonTutor.mailReviews).map(([name, review]) => ({
                        text: review,
                        title: "Отзыв с мифиста",
                        legacyNickname: name,
                        createdAt: new Date("01/01/2005"),
                        tutorId: tutor.id
                    })
                ));
            reviews.length > 0 ? await knex<Review>("reviews").insert(reviews) : [];
            return tutor;
        }

        return createTutor;
    });
// split promises into chunks of 10
// const chunks = [];
// for (let i = 0; i < promises.length; i += 10) {
//     chunks.push(promises.slice(i, i + 10));
// }
// // execute chunks
// for (const chunk of chunks) {
//     await Promise.all(chunk);
// }
// execute first 10
    await Promise.all(promises.slice(0, 10).map(el => el()));

// res.status(200).json({rows: result.rows})
    res.status(200).json({status: "ok"});
}
