// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import json from "parsing/combined/data.json"
import {LegacyRating, Material, Tutor, Quote, Review} from '@prisma/client';
import prisma from "../../../../lib/database/prisma";

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

type LegacyRatingDTO = Omit<LegacyRating, "id" | "tutorId">;
type QuoteDTO = Omit<Quote, "id" | "tutorId">;
type MaterialDTO = Omit<Material, "id" | "facultyId" | "tutorId">;
type ReviewDTO = Omit<Review, "id" | "tutorId">;

type TutorDTO =
    Omit<Tutor, "id" | "updated">
    & { legacyRating: { create: LegacyRatingDTO }, quotes: { create: QuoteDTO[] }, materials: { create: MaterialDTO[] }, reviews: { create: ReviewDTO[] } };
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }
    const data = json as JsonType;
    const tutors: { [id: string]: TutorDTO } = {}

    const newTutors = new Set<string>();
    const disciplines = new Set<string>();
    const faculties = new Set<string>();
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
    await prisma.discipline.deleteMany();
    await prisma.faculty.deleteMany();

    const disciplineModels = await prisma.discipline.createMany({
        data: Array.from(disciplines).map(el => {
            return {name: el}
        })
    })

    const facultyModels = await prisma.faculty.createMany({
        data: Array.from(faculties).map(el => {
            return {name: el}
        })
    })
    console.log()

    for (let [id, tutorData] of Object.entries(data.tutors)) {
        const jsonTutor = tutorData as unknown as JsonTutor;
        tutors[id] = {
            firstName: jsonTutor.name,
            lastName: jsonTutor.lastName,
            fatherName: jsonTutor.fatherName,
            nickName: jsonTutor.nickName,
            url: jsonTutor.url,
            legacyRating: {
                create: {
                    personality: Number(jsonTutor.personality.value),
                    personalityCount: Number(jsonTutor.personality.count),
                    exams: Number(jsonTutor.tests.value),
                    examsCount: Number(jsonTutor.tests.count),
                    quality: Number(jsonTutor.quality.value),
                    qualityCount: Number(jsonTutor.quality.count)
                }
            },
            quotes: {create: []},
            materials: {create: []},
            reviews: {create: []}
        }
        for (const quote of jsonTutor.quotes) {
            tutors[id].quotes.create.push({
                body: quote.Текст,
                userId: null,
                uploaded: strToDateTime(quote["Ник и дата"].split(' ').slice(-2).join(' '))
            })
        }
        for (const materialId of jsonTutor.materials) {
            const jsonMaterial = data.materials[materialId as any] as unknown as JsonMaterial;
            tutors[id].materials.create.push({
                description: jsonMaterial.Описание,
                header: jsonMaterial.Название === null || jsonMaterial.Название === "" ? "Без названия" : jsonMaterial.Название,
                disciplineId: jsonMaterial.Предмет,
                userId: null,
                uploaded: new Date(jsonMaterial["Дата добавления"])
            })
        }
        for (const review of jsonTutor.reviews) {
            const jsonReview = review as unknown as JsonReview;
            tutors[id].reviews.create.push({
                body: jsonReview.Текст,
                userId: null,
                header: jsonReview.Название === null || jsonReview.Название === "" ? "Без названия" : jsonReview.Название,
                legacyNickname: jsonReview.Ник,
                uploaded: strToDate(jsonReview.Дата)
            })

        }
        for (const [name, review] of Object.entries(jsonTutor.mailReviews)) {
            tutors[id].reviews.create.push({
                body: review,
                userId: null,
                header: "Отзыв с мифиста",
                legacyNickname: name,
                uploaded: new Date("01/01/2004")
            })
        }
        if (!newTutors.has(id)) {
            for (const el of Object.values(tutorData.directions)) {
                disciplines.add(el)
            }
        } else {
            for (const el of Object.values(tutorData.directions)) {
                faculties.add(el)
            }
        }
    }
    await prisma.tutor.deleteMany();
    for (const tutor of Object.values(tutors)) {
        console.log(JSON.stringify(tutor))

        const newTutor = await prisma.tutor.create({
            data: tutor,
        })
        console.log(newTutor)
    }

    res.status(200).json({tutors});

}
