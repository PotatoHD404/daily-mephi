// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import kn from "knex";
// @ts-ignore
import json from "parsing/combined/data.json"
// @ts-ignore
import tutor_imgs from "parsing/tutor_imgs.json"
// @ts-ignore
import mephist_imgs from "parsing/mephist_imgs.json"
// @ts-ignore
import mephist_fils from "parsing/mephist_files.json"
import { not } from 'ajv/dist/compile/codegen';
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

interface Tutor {
    id: string,
    first_name: string | null,
    last_name: string | null,
    father_name: string | null,
    nick_name: string | null,
    url: string | null,
    updated_at: Date,
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
    rating: number,
    bio: string | null,
}

interface File {
    id: string,
    url: string,
    altUrl: string | null,
    createdAt: Date,
    filename: string,
    userId: string | null,
    tutorId: string | null,
    materialId: string | null,
    tag: string | null,
    size: number,
}

interface LegacyRating {
    id: string,
    personality: number,
    personalityCount: number,
    exams: number,
    examsCount: number,
    quality: number,
    qualityCount: number,
    tutorId: string,
    avgRating: number,
    ratingCount: number,
}

interface VerificationToken {
    identifier: string,
    token: string,
    expires: Date,
}

interface Internal {
    name: string,
    value: string,
    expires: Date | null,
}

interface Quote {
    id: string,
    text: string,
    tutorId: string,
    userId: string | null,
    createdAt: Date | null,
}

interface News {
    id: string,
    text: string,
    title: string,
    createdAt: Date,
}

interface Review {
    id: string,
    title: string,
    text: string,
    createdAt: Date,
    legacyNickname: string | null,
    userId: string | null,
    tutorId: string,
}

interface Account {
    id: string,
    userId: string,
    type: string,
    provider: string,
    providerAccountId: string,
    refresh_token: string | null,
    access_token: string | null,
    expires_at: number | null,
    token_type: string | null,
    scope: string | null,
    id_token: string | null,
    session_state: string | null,
}

interface Session {
    id: string,
    sessionToken: string,
    userId: string,
    expires: Date,
}

interface Material {
    id: string,
    text: string | null,
    title: string | null,
    userId: string | null,
    tutorId: string | null,
    createdAt: Date | null,
}

interface Rate {
    id: string,
    punctuality: number,
    personality: number,
    exams: number,
    quality: number,
    tutorId: string,
    userId: string,
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
    userId: string | null,
    tutorId: string | null,
    materialId: string | null,
    reviewId: string | null,
    quoteId: string | null,
    newsId: string | null,
    type: string,
    createdAt: Date,
}

interface Comment {
    id: string,
    text: string,
    createdAt: Date,
    userId: string,
    reviewId: string | null,
    materialId: string | null,
    newsId: string | null,
    parentId: string | null,
}

interface MaterialSemester {
    id: string,
    materialId: string,
    semesterId: string,
}

interface DisciplineMaterial {
    id: string,
    disciplineId: string,
    materialId: string,
}

interface FacultyMaterial {
    id: string,
    facultyId: string,
    materialId: string,
}

interface DisciplineTutor {
    id: string,
    disciplineId: string,
    tutorId: string,
}

interface FacultyTutor {
    id: string,
    tutorId: string,
    facultyId: string,
}

interface Reaction {
    id: string,
    userId: string,
    quoteId: string | null,
    materialId: string | null,
    reviewId: string | null,
    commentId: string | null,
    newsId: string | null,
    createdAt: Date,
    like: boolean,
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
        connection: process.env.POSTGRESQL_URL
    });
    knex.initialize();
    const data: JsonType = json as JsonType;
    const tutor_images: FilesJson = tutor_imgs as FilesJson;
    const mephist_images: FilesJson = mephist_imgs as FilesJson;
    const mephist_files: FilesJson = mephist_fils as FilesJson;


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
        knex("Discipline").del(),
        knex("Faculty").del(),
        knex("Semester").del(),
        knex("Material").del(),
        knex("Tutor").del(),
        knex("Quote").del(),
        knex("File").del()
    ]);

    // await prisma.discipline.createMany({
    //     data: Array.from(disciplines).map(el => {
    //         return {name: el}
    //     }),
    //     skipDuplicates: true
    // })
    // rewrite code above to use knex instead of prisma
    const [disciplinesMapping, facultiesMapping, semestersMapping, filesMapping] = await Promise.all([
        knex<Discipline>("Discipline").insert(Array.from(disciplines).map(el => {
            return {name: el}
        })).onConflict('name').ignore().returning('*').
        then(el => el.reduce((acc: {[name: string] : string}, el) => {
            acc[el.name] = el.id;
            return acc;
        }, {})),
        knex<Faculty>("Faculty").insert(Array.from(faculties).map(el => {
            return {name: el}
        })).onConflict('name').ignore().returning('*').
        then(el => el.reduce((acc: {[name: string] : string}, el) => {
            acc[el.name] = el.id;
            return acc;
        }, {})),
        knex<Semester>("Semester").insert(Object.keys(semestersMap).map(el => {
            return {name: el}
        })).onConflict('name').ignore().returning('*').
        then(el => el.reduce((acc: {[name: string] : string}, el) => {
            acc[el.name] = el.id;
            return acc;
        }, {})),
        knex<File>("File").insert(Object.entries({...mephist_files.fileMap, ...tutor_images.fileMap, ...mephist_images.fileMap}).map(([id, name]) => {
            return {id, name}
        })).onConflict('id').ignore().returning('*')
    ]);

    const promises = Object.entries(data.tutors).map(([id, tutor]) => {
        const jsonTutor = tutor as unknown as JsonTutor;
        const newTutor: Omit<Tutor, "fullName" | "shortName" | "id"> = {
            firstName: jsonTutor.name,
            lastName: jsonTutor.lastName,
            fatherName: jsonTutor.fatherName,
            nickName: jsonTutor.nickName,
            url: jsonTutor.url,
            updatedAt: new Date(),
        };

        async function createTutor() {
            // add disciplines
            if(!newTutors.has(id)) {
                await knex<Discipline>("Discipline").insert(jsonTutor.directions.filter(el => !(el in disciplinesMapping)).map(el => {
                    return {name: el}
                })).onConflict('name').ignore().returning('*').then(el => el.forEach(el => disciplinesMapping[el.name] = el.id));
            }
            else {
                await knex<Faculty>("Faculty").insert(jsonTutor.directions.filter(el => !(el in facultiesMapping)).map(el => {
                    return {name: el}
                })).onConflict('name').ignore().returning('*').then(el => el.forEach(el => facultiesMapping[el.name] = el.id));
            }
            await knex<Tutor>("Tutor").insert({...newTutor, id}).onConflict('id').ignore();


            const tutor = await knex<Tutor>("Tutor").insert(newTutor).onConflict('id').ignore().returning(["id"]).then(el => el[0]);

            const images = tutor_images["fileMap"][`${id}.jpg`] ? [{id: tutor_images["fileMap"][`${id}.jpg`]}] : [];
            // add mephist_images to images
            images.push(...(Object.entries(mephist_images.fileMap).filter(
                ([key]) => key.startsWith(`${id}-`)).map(([, value]) => ({id: value}))));
            await Promise.all([
            // add legacyRating
            knex<LegacyRating>("LegacyRating").insert({
                personality: Number(jsonTutor.personality.value),
                personalityCount: Number(jsonTutor.personality.count),
                exams: Number(jsonTutor.tests.value),
                examsCount: Number(jsonTutor.tests.count),
                quality: Number(jsonTutor.quality.value),
                qualityCount: Number(jsonTutor.quality.count),
                tutorId: tutor.id
            }).onConflict('tutorId').ignore(),
            // add images
            knex<File>("TutorImage").insert(images.map(el => ({tutorId: tutor.id, imageId: el.id}))),
            // add quotes
            knex<Quote>("Quote").insert(jsonTutor.quotes.map(el => ({text: el.Текст, createdAt: strToDateTime(el["Ник и дата"].split(' ').slice(-2).join(' ')), tutorId: tutor.id})))
            ]);
            // add materials and their files
            const materials = jsonTutor.materials.map(el => ({...data.materials[el as any] as unknown as JsonMaterial, materialId : el}));
            const materialsModel = await knex<Material>("Material").insert(materials.map(el => ({
                title: el.Название === null || el.Название === "" ? "Без названия" : el.Название,
                text: el.Описание,
                createdAt: new Date(el["Дата добавления"]),
                tutorId: tutor.id
            }))).returning(["id"]);
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
                if (key.startsWith(el.materialId + "-")) {
                    disciplines.push({id: value, materialNum: i});
                }
            }
            return disciplines;
            });
            // add faculties to materials
            const materialFaculties = materials.flatMap((el, i) => {
            const faculties: { id: string, materialNum: number }[] = [];
            for (const [key, value] of Object.entries(facultiesMapping)) {
                if (key.startsWith(el.materialId + "-")) {
                    faculties.push({id: value, materialNum: i});
                }
            }
            return faculties;
            });
            // add semesters to materials
            const materialSemesters = materials.flatMap((el, i) => {
            const semesters: { id: string, materialNum: number }[] = [];
            for (const [key, value] of Object.entries(semestersMapping)) {
                if (key.startsWith(el.materialId + "-")) {
                    semesters.push({id: value, materialNum: i});
                }
            }
            return semesters;
            });
            await Promise.all([
                ...materialFiles.map(el => knex<File>("MaterialFile").update({materialId: materialsModel[el.materialNum].id}).where({id: el.id})),
                ...materialDisciplines.map(el => knex<DisciplineMaterial>("MaterialDiscipline").insert({materialId: materialsModel[el.materialNum].id, disciplineId: el.id})),
                ...materialFaculties.map(el => knex<FacultyMaterial>("MaterialFaculty").insert({materialId: materialsModel[el.materialNum].id, facultyId: el.id})),
                ...materialSemesters.map(el => knex<MaterialSemester>("MaterialSemester").insert({materialId: materialsModel[el.materialNum].id, semesterId: el.id}))
            ]);

            // add reviews
            await knex<Review>("Review").insert(
                jsonTutor.reviews.map(el =>
                     ({title: el.Название === null || el.Название === "" ? "Без названия" : el.Название, text: el.Текст,
                      createdAt: strToDate(el.Дата),
                       legacyNickname: el.Ник,
                        tutorId : tutor.id})).concat(
                            Object.entries(jsonTutor.mailReviews).map(([name, review]) => ({
                                                text: review,
                title: "Отзыв с мифиста",
                legacyNickname: name,
                createdAt: new Date("01/01/2005"),
                tutorId: tutor.id
                            })
                            )));            
            return tutor;
        }
        return createTutor;
    });
    // split promises into chunks of 10
    const chunks = [];
    for (let i = 0; i < promises.length; i += 10) {
        chunks.push(promises.slice(i, i + 10));
    }
    // execute chunks
    for (const chunk of chunks) {
        await Promise.all(chunk);
    }






    // res.status(200).json({rows: result.rows})
    res.status(200).json({status: "ok"});
}
