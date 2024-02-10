import {z} from 'zod';
import {t} from 'server/utils';
import {auth, MyAppUser} from "../../lib/auth/nextAuthOptions";
import {File, Material, PrismaClient} from '@prisma/client';
import {TRPCError} from "@trpc/server";
import * as fs from "fs";

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

interface Tutor {
    id: string,
    firstName: string | null,
    lastName: string | null,
    fatherName: string | null,
    nickname: string | null,
    url: string | null,
    updatedAt: Date,
    fullName: string,
    shortName: string,
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

interface Quote {
    id: string,
    text: string,
    tutorId: string,
    userId: string,
    createdAt: Date,
}

interface Review {
    id: string,
    title: string,
    text: string,
    createdAt: Date,
    legacyNickname: string,
    userId: string,
    tutorId: string,
}

type LegacyRatingDTO = Omit<LegacyRating, "id" | "tutorId">;
type QuoteDTO = Omit<Quote, "id" | "tutorId" | "userId">;
type MaterialDTO =
    Omit<Material, "id" | "tutorId" | "userId"> & {
    faculties: { connect: { id: string }[] } | undefined,
    disciplines: { connect: { id: string } } | undefined,
    semesters: { connect: { id: string }[] },
    files: { connect: { id: string }[] }
};
type ReviewDTO = Omit<Review, "id" | "tutorId" | "userId"> & { document: { create: { text: string, type: string } }, };
type TutorDTO =
    Omit<Tutor, "id" | "updated"> & {
    legacyRating: { create: LegacyRatingDTO },
    quotes: { create: QuoteDTO[] },
    materials: { create: any[] },
    reviews: { create: ReviewDTO[] },
    faculties: { connectOrCreate: { create: { name: string }, where: { name: string } }[] },
    disciplines: { connectOrCreate: { create: { name: string }, where: { name: string } }[] },
    images: { connect: { id: string }[] },
    document: { create: { text: string, type: string } },
    score: number,
    reviewsCount: number,
    materialsCount: number,
    quotesCount: number,
    ratesCount: number,
};
type FileDTO = {
    status: string,
    fileMap: { [id: string]: string }
};

let epoch = new Date(1970, 1, 1);

function epoch_seconds(date: Date) {
    return date.getSeconds() - epoch.getSeconds();
}

function score(likes: number, dislikes: number) {
    return likes - dislikes;
}

function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
}

function hot(likes: number, dislikes: number, date: Date) {
    let s = score(likes, dislikes);
    let order = getBaseLog(Math.max(Math.abs(s), 1), 10);
    let sign: number;
    if (s > 0) {
        sign = 1;
    } else if (s < 0) {
        sign = -1;
    } else {
        sign = 0;
    }
    let seconds = epoch_seconds(date) - 1134028003;
    return sign * order + seconds / 45000;
}

function confidence(likes: number, dislikes: number): number {
    const n = likes + dislikes;

    if (n === 0) {
        return 0;
    }

    const z = 1.281551565545;
    const p = likes / n;

    const left = p + 1 / (2 * n) * z * z;
    const right = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
    const under = 1 + 1 / n * z * z;

    return (left - right) / under;
}

function readJsonFile(filePath: string) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error(`Error reading file from disk: ${error}`);
    }
}

export const utilsRouter = t.router({
    disciplines: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/disciplines'
        }
    })
        .input(z.void())
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}}) => {
            return prisma.discipline.findMany({
                select: {
                    name: true
                },
                orderBy: [
                    {
                        name: 'asc'
                    }
                ]
            }).then(disciplines => disciplines.map(el => el.name));
        }),
    faculties: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/faculties'
        }
    })
        .input(z.void())
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}}) => {
            return prisma.faculty.findMany(
                {
                    select: {
                        name: true
                    },
                    orderBy: [
                        {
                            name: 'asc'
                        }
                    ]
                }
            ).then(faculties => faculties.map(el => el.name));
        }),
    semesters: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/semesters'
        }
    })
        .input(z.void())
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}}) => {
            return prisma.semester.findMany({
                select: {
                    name: true
                },
                orderBy: [
                    {
                        name: 'asc'
                    }
                ]
            }).then(semesters => semesters.map(el => el.name));
        }),
    getAvatars: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/get_avatars'
        }
    })
        .input(z.void())
        /* .output(z.any()) */
        .query(async ({ctx: {prisma}}) => {
            return prisma.file.findMany(
                {
                    where: {
                        tag: "avatar",
                        userId: null
                    },
                    select: {
                        url: true,
                        altUrl: true,
                    },
                }
            );
        }),
    top: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/top'
        }
    }).input(z.object({
        place: z.number().int().optional(),
        take: z.number().int().optional().default(10),
    }))
        /* .output(z.any()) */
        .query(async ({ctx: {prisma, req, res}, input: {place: inputPlace, take}}) => {
            const session = req && res ? await auth(req, res) : undefined;
            const sessionUser = session?.user as (MyAppUser) ?? null;
            const userCount = await prisma.user.count();
            let skip: number;
            let place = inputPlace ?? sessionUser?.place ?? 0;
            // show only take users
            // in such way that the user is in the middle
            if (userCount > take) {
                skip = Math.max(0, place - Math.floor(take / 2));
            } else {
                skip = 0;
            }
            return prisma.user.findMany({
                    select: {
                        nickname: true,
                        id: true,
                        image: {
                            select: {
                                url: true
                            }
                        },
                        place: true,
                        rating: true,
                    },
                    orderBy: [
                        {place: 'asc'},
                    ],
                    take,
                    skip
                }
            );
        }),
    seed: t.procedure.meta(
        {
            openapi: {
                method: 'GET',
                path: '/utils/seed'
            }
        }
    ).query(async () => {
        if (process.env.LOCAL !== "true") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You can perform this operation only locally"
            })
        }
        const prisma = new PrismaClient();

        const tutors: TutorDTO[] = []

        const data: JsonType = readJsonFile('parsing/combined/data.json');
        const tutor_images: FileDTO = readJsonFile('parsing/tutor_imgs.json');
        const mephist_images: FileDTO = readJsonFile('parsing/mephist_imgs.json')
        const mephist_files: FileDTO = readJsonFile('parsing/mephist_files.json');
        const all_files: File[] = (readJsonFile('parsing/File.json')).map((el: any) => {
            let tag: string = 'unknown';
            if (el.id in tutor_images.fileMap) {
                tag = 'home-avatar'
            } else if (el.id in mephist_images.fileMap) {
                tag = 'mephist-avatar'
            } else if (el.id in mephist_files.fileMap) {
                tag = 'material'
            } else if (el.url.startsWith('https://lh3.googleusercontent.com')) {
                tag = 'avatar'
            }
            return {
                ...el,
                createdAt: new Date(el.createdAt),
                tag
            }
        }) as File[];

        const clearDiscipline = (discipline: string, tokens: Record<string, boolean>) => {
            let res = discipline;
            Object.entries(tokens).forEach(([token, start]) => {
                const arr = res.split(token)
                if (arr.length === 1) {
                    return;
                }
                if (start) {
                    arr.shift();
                } else {
                    arr.pop();
                }
                res = arr.join(token);
            })
            return res;
        }
        const clearDisciplineRegex = new RegExp(
            "([Пп]одгруппа |[Пп]оток |(?:дистант|очно)(?:[ ,]|$)|[0-9]-[A-ZА-Я] [0-9]|" +
            "[0-9][A-ZА-Я] {1,2}[0-9]{1,2}|[0-9]-[A-ZА-Я]{2} [0-9]|" +
            "[0-9]-[A-ZА-Я][0-9] [0-9]|[0-9][A-ZА-Я]{2} [0-9]|" +
            "[0-9][A-ZА-Я]_[0-9] {2}[0-9])",
            "g"
        );
        const newTutors = new Set<string>();
        const disciplines = new Set<string>();
        const faculties = new Set<string>();
        const addedMaterials = new Set<string>();
        const semestersMapping: Record<string, string> = {
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
        const reversedSemestersMapping: Record<string, string> = {};

        Object.entries(semestersMapping).forEach(([key, value]) => {
            reversedSemestersMapping[value] = key;
        });
        const tutorFaculties: Record<string, Set<string>> = {}
        const tutorDisciplines: Record<string, Set<string>> = {}
        for (const [cafedra, tutorsData] of Object.entries(data.cafedras)) {
            faculties.add(cafedra)
            for (const [id, directions] of Object.entries(tutorsData.tutors)) {
                if (!tutorFaculties[id]) {
                    tutorFaculties[id] = new Set()
                }
                tutorFaculties[id].add(cafedra)
                if (!tutorDisciplines[id]) {
                    tutorDisciplines[id] = new Set()
                }
                newTutors.add(id)
                for (let direction of Object.keys(directions)) {
                    direction.split('; ').map((direction) => {
                        const tmp = clearDiscipline(direction,
                            {
                                '_': true,
                            })
                        return tmp.split(clearDisciplineRegex)[0];
                    }).forEach(direction => {
                        disciplines.add(direction)
                        tutorDisciplines[id].add(direction);
                    })

                }
            }
        }
        for (const material of Object.values(data.materials)) {
            const jsonMaterial = material as unknown as JsonMaterial;
            jsonMaterial.Факультет?.split("; ").forEach(faculty => faculties.add(faculty.trim()));
        }
        await prisma.file.deleteMany({})
        await prisma.discipline.deleteMany({})
        await prisma.faculty.deleteMany({})
        await prisma.semester.deleteMany({})
        await prisma.tutor.deleteMany({})
        await prisma.material.deleteMany({})
        await prisma.quote.deleteMany({})

        await prisma.file.createMany({
            data: all_files,
            skipDuplicates: true
        })
        await prisma.semester.createMany({
            data: Object.keys(semestersMapping).map(el => ({name: el})),
            skipDuplicates: true
        })

        for (let [id, tutorData] of Object.entries(data.tutors)) {
            const jsonTutor = tutorData as unknown as JsonTutor;
            const {lastName, name, fatherName} = jsonTutor;
            const fullNameParts = [lastName, name, fatherName].filter(part => !!part);
            const fullName = fullNameParts.join(' ');

            // Short Name Calculation
            let shortName = '';
            if (lastName) {
                shortName += lastName;
            }
            if (name) {
                shortName += (shortName ? ` ${name.charAt(0)}.` : `${name.charAt(0)}.`);
            }
            if (fatherName) {
                shortName += (shortName ? ` ${fatherName.charAt(0)}.` : `${fatherName.charAt(0)}.`);
            }
            const legacyRating = {
                create: {
                    personality: Number(jsonTutor.personality.value),
                    personalityCount: Number(jsonTutor.personality.count),
                    exams: Number(jsonTutor.tests.value),
                    examsCount: Number(jsonTutor.tests.count),
                    quality: Number(jsonTutor.quality.value),
                    qualityCount: Number(jsonTutor.quality.count),
                    avgRating: (Number(jsonTutor.personality.value) + Number(jsonTutor.tests.value) + Number(jsonTutor.quality.value)) / 3,
                    ratingCount: Math.max(Number(jsonTutor.personality.count), Number(jsonTutor.tests.count), Number(jsonTutor.quality.count)),
                }
            }
            const tutor: TutorDTO = {
                firstName: jsonTutor.name,
                lastName: jsonTutor.lastName,
                fatherName: jsonTutor.fatherName,
                fullName: fullName,
                shortName: shortName,
                updatedAt: new Date(),
                nickname: jsonTutor.nickName,
                url: jsonTutor.url,
                legacyRating,
                score: (Math.abs(legacyRating.create.avgRating) + 0.01) * (jsonTutor.reviews.length + jsonTutor.materials.length + jsonTutor.quotes.length + 0.01) / 3,
                quotes: {create: []},
                materials: {create: []},
                reviews: {create: []},
                faculties: {connectOrCreate: []},
                disciplines: {connectOrCreate: []},
                reviewsCount: jsonTutor.reviews.length,
                materialsCount: jsonTutor.materials.length,
                quotesCount: jsonTutor.quotes.length,
                ratesCount: 0,
                images: tutor_images["fileMap"][`${id}.jpg`] ? {connect: [{id: tutor_images["fileMap"][`${id}.jpg`]}]} : {connect: []},
                document: {
                    create: {
                        text: [jsonTutor.name, jsonTutor.lastName, jsonTutor.fatherName].filter(el => !!el).join(' '),
                        type: 'tutor'
                    }
                },
            }

            for (const [key, value] of Object.entries(mephist_images.fileMap)) {
                if (key.startsWith(id + "-")) {
                    tutor.images.connect.push({id: value})
                }
            }

            for (const quote of jsonTutor.quotes) {
                tutor.quotes.create.push({
                    // @ts-ignore
                    document: {
                        create: {
                            text: quote.Текст,
                            type: 'quote'
                        }
                    },
                    score: +(quote.Оценка ?? 0),
                    text: quote.Текст,
                    createdAt: strToDateTime(quote["Ник и дата"].split(' ').slice(-2).join(' '))
                })
            }
            if (tutorFaculties[id]) {
                tutor.faculties.connectOrCreate = [...tutorFaculties[id]].map(el => {
                    return {
                        create: {name: el},
                        where: {name: el}
                    }
                })
                tutor.disciplines.connectOrCreate = [...tutorDisciplines[id]].map(el => {
                    return {
                        create: {name: el},
                        where: {name: el}
                    }
                })
            }
            for (const materialId of jsonTutor.materials) {
                const jsonMaterial = data.materials[materialId as any] as unknown as JsonMaterial;
                const files: { id: string }[] = [];
                for (const [key, value] of Object.entries(mephist_files.fileMap)) {
                    if (key.startsWith(materialId + "-")) {
                        files.push({id: value})
                    }
                }
                if (jsonMaterial.Предмет !== null) {
                    tutor.faculties.connectOrCreate = [{
                        create: {name: jsonMaterial.Предмет},
                        where: {name: jsonMaterial.Предмет}
                    }]
                }
                tutor.materials.create.push({
                    document: {
                        create: {
                            text: [jsonMaterial.Описание, jsonMaterial.Название].filter(el => !!el).join(' '),
                            type: 'material'
                        }
                    },
                    text: jsonMaterial.Описание,
                    title: jsonMaterial.Название === null || jsonMaterial.Название === "" ? "Без названия" : jsonMaterial.Название,
                    faculties: {
                        connectOrCreate: jsonMaterial.Факультет?.split("; ").map(el => {
                            return {
                                where: {name: el.trim()},
                                create: {name: el.trim()}
                            }
                        }) || []
                    },
                    disciplines: jsonMaterial.Предмет !== null ? {
                        connectOrCreate: {
                            create: {name: jsonMaterial.Предмет},
                            where: {name: jsonMaterial.Предмет}
                        }
                    } : undefined,
                    createdAt: new Date(jsonMaterial["Дата добавления"]),
                    semesters: {
                        connect: jsonMaterial.Семестр && !jsonMaterial.Семестр.split("; ").includes("Аспирантура") ?
                            jsonMaterial.Семестр.split("; ").map(el => {
                                return {name: reversedSemestersMapping[el]}
                            }) : []
                    },
                    files: {connect: files}
                })
                addedMaterials.add(materialId)
            }
            for (const review of jsonTutor.reviews) {
                const jsonReview = review as unknown as JsonReview;
                tutor.reviews.create.push({
                    document: {
                        create: {
                            text: [jsonReview.Название, jsonReview.Текст].filter(el => !!el).join(' '),
                            type: 'review'
                        }
                    },
                    text: jsonReview.Текст,
                    title: jsonReview.Название === null || jsonReview.Название === "" ? "Без названия" : jsonReview.Название,
                    legacyNickname: jsonReview.Ник,
                    createdAt: strToDate(jsonReview.Дата)
                })

            }

            for (const [name, review] of Object.entries(jsonTutor.mailReviews)) {
                tutor.reviews.create.push({
                    document: {
                        create: {
                            text: [review].filter(el => !!el).join(' '),
                            type: 'review'
                        }
                    },
                    text: review,
                    title: "Отзыв с мифиста",
                    legacyNickname: name,
                    createdAt: new Date("01/01/2005")
                })
            }
            if (!newTutors.has(id)) {
                for (const el of Object.values(tutorData.directions)) {
                    tutor.disciplines.connectOrCreate.push({create: {name: el}, where: {name: el}})
                }
            } else {
                // for (const el of Object.values(tutorData.directions)) {
                //     tutor.faculties.connectOrCreate.push({create: {name: el}, where: {name: el}})
                // }
            }
            tutors.push(tutor)
        }

        for (const tutor of tutors) {

            await prisma.tutor.create({
                data: tutor,
            });
        }
        return prisma.tutor.findMany();
    })
});