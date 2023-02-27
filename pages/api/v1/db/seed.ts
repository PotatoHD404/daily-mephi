// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import kn from "knex";
import {knexSnakeCaseMappers} from "lib/database/objection"

import json from "parsing/combined/data.json"
import tutor_imgs from "parsing/tutor_imgs.json"
import mephist_imgs from "parsing/mephist_imgs.json"
import mephist_fils from "parsing/mephist_files.json"
import filesJ from "parsing/File.json"
import { arrayBuffer } from 'stream/consumers';
import Tutor from 'components/tutor';
import { faker } from "@faker-js/faker"

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

type a = Pick<Tutor, "id">

type b = Omit<Tutor, "id">

type c = string[]

type d = {[a: string]: string}

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


    const toDelete = [
        knex("disciplines").del(),
        knex("faculties").del(),
        knex("semesters").del(),
        knex("materials").del(),
        knex("tutors").del(),
        knex("quotes").del(),
        knex("files").del()
    ]
    // delete by 3 to avoid timeout
    for (let i = 0; i < toDelete.length; i += 3) {
        await Promise.all(toDelete.slice(i, i + 3))
    }

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

    let promises: (() => Promise<any>)[] = Object.entries(data.tutors).map(([id, tutor]) => {
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
                    const arr = jsonTutor.directions.map(el => {
                        return {name: el}
                    });
                    const filteredArr = arr.filter(el => !Object.keys(disciplinesMapping).includes(el.name));

                    if (filteredArr.length) {
                        await knex<Discipline>("disciplines").insert(filteredArr).onConflict('name').ignore().returning('*').then(el => el.forEach(el => {
                            disciplinesMapping[el.name] = el.id;
                        }));
                    }

                    if (arr.length) {
                        while (arr.map(el => el.name).some(el => !Object.keys(disciplinesMapping).includes(el))) {
                            await new Promise(resolve => setTimeout(resolve, 10));
                        }
                        await knex<TutorDiscipline>("tutors_disciplines").insert(arr.map(el => {
                            return {tutor_id: tutor.id, discipline_id: disciplinesMapping[el.name]}
                        }));
                    }

                })(),
                (async () => {
                    // add cafedras
                    const arr = jsonTutor.cafedras.filter(el => el !== null).map(el => {
                        return {name: el}
                    });
                    const filteredArr = arr.filter(el => !Object.keys(facultiesMapping).includes(el.name));
                    if (filteredArr.length) {
                        await knex<Faculty>("faculties").insert(filteredArr).onConflict('name').ignore().returning('*').then(el => el.forEach(el => {
                            facultiesMapping[el.name] = el.id;
                        }));
                    }

                    if (arr.length) {
                        while (arr.map(el => el.name).some(el => !Object.keys(facultiesMapping).includes(el))) {
                            await new Promise(resolve => setTimeout(resolve, 10));
                        }
                        jsonTutor.cafedras.length > 0 ? await knex<TutorFaculty>("tutors_faculties").insert(jsonTutor.cafedras.map(el => {
                            return {tutor_id: tutor.id, faculty_id: facultiesMapping[el]}
                        })) : [];
                    }
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
                ).filter(el => el.text !== "" && el.text !== " " && el.text !== "\n" && el.text !== "\n\n"));
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
    // await Promise.all(promises.slice(0, 10).map(el => el()));
// execute all by 10


const num = 10;
for (let i = 0; i < promises.length; i += num) {
    await Promise.all(promises.slice(i, i + num).map(el => el()));
}

promises = []

// add users and their accounts

// generate two users using faker js

const users: User[] = [];
// id: string,
// name: string | null,
// image_id: string | null,
// role: string,
// email: string | null,
// email_verified: Date | null,
// created_at: Date,
// updated_at: Date,
// banned: boolean,
// banned_reason: string | null,
// banned_until: Date | null,
// banned_at: Date | null,
// rating: number,
// bio: string | null,
for (let i = 0; i < 300; i++) {
    const user = {
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        role: "default",
        image_id: null,
        name: faker.internet.userName(),
        email_verified: null,
        bio: faker.lorem.paragraph(2).slice(0, 150),
        banned: false,
        banned_reason: null,
        banned_until: null,
        banned_at: null,
    };
    users.push(user);
}
await knex<User>("users").insert(users);

// add accounts
const accounts: Account[] = [];

for (const user of users) {
    const account = {
        id: faker.datatype.uuid(),
        user_id: user.id,
        provider: "home",
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        type: "oauth",
        provider_account_id: faker.datatype.uuid(),
        scope: null,
        id_token: null,
        session_state: null,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
    };
    accounts.push(account);
}

await knex<Account>("accounts").insert(accounts);

// add news

const news: News[] = [];

for (let i = 0; i < 100; i++) {
    const newsItem = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraphs(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        deleted_at: null,
    };
    news.push(newsItem);
}

await knex<News>("news").insert(news);

// get reviews

const [ reviews, materials, quotes, tutors ] = await Promise.all([
    knex<Review>("reviews").select("*").limit(2000),
    knex<Material>("materials").select("*").limit(2000),
    knex<Quote>("quotes").select("*").limit(2000),
    knex<Tutor>("tutors").select("*").limit(2000),
]);

// add comments to news

const comments: Comment[] = [];

for (let i = 0; i < 100; i++) {
    const comment = {
        id: faker.datatype.uuid(),
        text: faker.lorem.paragraph(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        deleted_at: null,
        user_id: faker.helpers.arrayElement(users).id,
        news_id: faker.helpers.arrayElement(news).id,
        parent_id: null,
        review_id: null,
        material_id: null,
    };
    comments.push(comment);
}

// add comments to reviews

for (let i = 0; i < 100; i++) {
    const comment = {
        id: faker.datatype.uuid(),
        text: faker.lorem.paragraph(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        deleted_at: null,
        user_id: faker.helpers.arrayElement(users).id,
        news_id: null,
        parent_id: null,
        review_id: faker.helpers.arrayElement(reviews).id,
        material_id: null,
    };
    comments.push(comment);
}

// add comments to materials

for (let i = 0; i < 100; i++) {
    const comment = {
        id: faker.datatype.uuid(),
        text: faker.lorem.paragraph(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        deleted_at: null,
        user_id: faker.helpers.arrayElement(users).id,
        news_id: null,
        parent_id: null,
        review_id: null,
        material_id: faker.helpers.arrayElement(materials).id,
    };
    comments.push(comment);
}

// add comments to comments

for (let i = 0; i < 2000; i++) {
    const comment = {
        id: faker.datatype.uuid(),
        text: faker.lorem.paragraph(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        deleted_at: null,
        user_id: faker.helpers.arrayElement(users).id,
        news_id: null,
        parent_id: faker.helpers.arrayElement(comments).id,
        review_id: null,
        material_id: null,
    };
    comments.push(comment);
}


await knex<Comment>("comments").insert(comments);

// add reactions to comments

const reactions: Reaction[] = [];

for (let i = 0; i < 2000; i++) {
    const reaction = {
        id: faker.datatype.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        comment_id: faker.helpers.arrayElement(comments).id,
        review_id: null,
        material_id: null,
        news_id: null,
        quote_id: null,
        liked: faker.helpers.arrayElement([true, false]),
    };
    reactions.push(reaction);
}

// add reactions to reviews

for (let i = 0; i < 100; i++) {
    const reaction = {
        id: faker.datatype.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        comment_id: null,
        review_id: faker.helpers.arrayElement(reviews).id,
        material_id: null,
        news_id: null,
        quote_id: null,
        liked: faker.helpers.arrayElement([true, false]),
    };
    reactions.push(reaction);
}

// add reactions to materials

for (let i = 0; i < 100; i++) {
    const reaction = {
        id: faker.datatype.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        comment_id: null,
        review_id: null,
        material_id: faker.helpers.arrayElement(materials).id,
        news_id: null,
        quote_id: null,
        liked: faker.helpers.arrayElement([true, false]),
    };
    reactions.push(reaction);
}

// add reactions to news

for (let i = 0; i < 100; i++) {
    const reaction = {
        id: faker.datatype.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        comment_id: null,
        review_id: null,
        material_id: null,
        news_id: faker.helpers.arrayElement(news).id,
        quote_id: null,
        liked: faker.helpers.arrayElement([true, false]),
    };
    reactions.push(reaction);
}

// add reactions to quotes

for (let i = 0; i < 100; i++) {
    const reaction = {
        id: faker.datatype.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        comment_id: null,
        review_id: null,
        material_id: null,
        news_id: null,
        quote_id: faker.helpers.arrayElement(quotes).id,
        liked: faker.helpers.arrayElement([true, false]),
    };
    reactions.push(reaction);
}

// remove duplicates

const uniqueReactions = reactions.filter(
    (reaction, index, self) =>
        index === self.findIndex((r) => r.user_id === reaction.user_id &&
        ((r.comment_id === reaction.comment_id && r.comment_id !== null) ||
        (r.review_id === reaction.review_id && r.review_id !== null) ||
        (r.material_id === reaction.material_id && r.material_id !== null) ||
        (r.news_id === reaction.news_id && r.news_id !== null) ||
        (r.quote_id === reaction.quote_id && r.quote_id !== null))),
);
// TODO: fix bug, reactions that are unique are not inserted
await knex<Reaction>("reactions").insert(uniqueReactions);

// add rates to tutors

const rates: Rate[] = [];

for (let i = 0; i < 100; i++) {
    const rate = {
        id: faker.datatype.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        tutor_id: faker.helpers.arrayElement(tutors).id,
        punctuality: faker.datatype.number({ min: 1, max: 10 }),
        personality: faker.datatype.number({ min: 1, max: 10 }),
        exams: faker.datatype.number({ min: 1, max: 10 }),
        quality: faker.datatype.number({ min: 1, max: 10 }),
    };
    rates.push(rate);
}

// remove duplicates

const uniqueRates = rates.filter(
    (rate, index, self) =>
        index === self.findIndex((r) => r.user_id === rate.user_id && r.tutor_id === rate.tutor_id)
);

await knex<Rate>("rates").insert(uniqueRates);

// await promises[0]();

// for (let i = 0; i < promises.length; i += num) {
//     await Promise.all(promises.slice(i, i + num).map(el => el()));
// }

// res.status(200).json({rows: result.rows})
    res.status(200).json({status: "ok"});
}
