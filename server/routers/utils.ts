import {z} from 'zod';
import {t} from 'server/utils';
import {auth, MyAppUser} from "../../lib/auth/nextAuthOptions";
import {File} from '@prisma/client';
import json from "parsing/combined/data.json"
import tutor_imgs from "parsing/tutor_imgs.json"
import mephist_imgs from "parsing/mephist_imgs.json"
import mephist_fils from "parsing/mephist_files.json"
import all_fils from "parsing/File.json"
import {TRPCError} from "@trpc/server";

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

interface Material {
    id: string,
    text: string | null,
    title: string,
    userId: string,
    tutorId: string,
    createdAt: Date,
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
type ReviewDTO = Omit<Review, "id" | "tutorId" | "userId">;
type Semester =
    "Б1"
    | "Б2"
    | "Б3"
    | "Б4"
    | "Б5"
    | "Б6"
    | "Б7"
    | "Б8"
    | "М1"
    | "М2"
    | "М3"
    | "М4"
    | "А1"
    | "А2"
    | "А3"
    | "А4"
    | "А5"
    | "А6"
    | "А7"
    | "А8"
type TutorDTO =
    Omit<Tutor, "id" | "updated"> & {
    legacyRating: { create: LegacyRatingDTO },
    quotes: { create: QuoteDTO[] },
    materials: { create: MaterialDTO[] },
    reviews: { create: ReviewDTO[] },
    faculties: { connect: { id: string }[] },
    disciplines: { connect: { id: string }[] },
    images: { connect: { id: string }[] }
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
    facilities: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/facilities'
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
            const session = await auth(req, res);
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
    ).query(async ({ctx: {prisma}}) => {
        if (process.env.LOCAL !== "true") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You can perform this operation only locally"
            })
        }
        const tutors: TutorDTO[] = []

        // await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
        const data = json as unknown as JsonType;

        const tutor_images: FileDTO = tutor_imgs;
        const mephist_images: FileDTO = mephist_imgs;
        const mephist_files: FileDTO = mephist_fils;
        const all_files: File[] = all_fils as unknown as File[];

        const newTutors = new Set<string>();
        const disciplines = new Set<string>();
        const faculties = new Set<string>();
        const addedMaterials = new Set<string>();
        const semestersMapping: { [id: string]: string } = {
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
            prisma.discipline.deleteMany(),
            prisma.file.deleteMany(),
            prisma.faculty.deleteMany(),
            prisma.semester.deleteMany(),
            prisma.material.deleteMany(),
            prisma.tutor.deleteMany(),
            prisma.quote.deleteMany()
        ]);

        await Promise.all([
            prisma.file.createMany({
                data: all_files,
                skipDuplicates: true
            }),
            prisma.discipline.createMany({
                data: Array.from(disciplines).map(el => ({name: el})),
                skipDuplicates: true
            }),
            prisma.faculty.createMany({
                data: Array.from(faculties).map(el => ({name: el})),
                skipDuplicates: true
            }),
            prisma.semester.createMany({
                data: Object.keys(semestersMapping).map(el => ({name: el})),
                skipDuplicates: true
            })
        ]);

// Fetch the created models concurrently
        const [facultyModels, disciplineModels, semesterModels] = await Promise.all([
            prisma.faculty.findMany(),
            prisma.discipline.findMany(),
            prisma.semester.findMany()
        ]).then(([faculties, disciplines, semesters]) => [
            faculties.reduce((obj: Record<string, string>, el) => {
                obj[el.name] = el.id;
                return obj;
            }, {}),
            disciplines.reduce((obj: Record<string, string>, el) => {
                obj[el.name] = el.id;
                return obj;
            }, {}),
            semesters.reduce((obj: Record<string, string>, el) => {
                obj[semestersMapping[el.name]] = el.id;
                return obj;
            }, {})
        ]);

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
            const tutor: TutorDTO = {
                firstName: jsonTutor.name,
                lastName: jsonTutor.lastName,
                fatherName: jsonTutor.fatherName,
                fullName: fullName,
                shortName: shortName,
                updatedAt: new Date(),
                nickname: jsonTutor.nickName,
                url: jsonTutor.url,
                legacyRating: {
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
                },
                quotes: {create: []},
                materials: {create: []},
                reviews: {create: []},
                faculties: {connect: []},
                disciplines: {connect: []},
                images: tutor_images["fileMap"][`${id}.jpg`] ? {connect: [{id: tutor_images["fileMap"][`${id}.jpg`]}]} : {connect: []}
            }

            for (const [key, value] of Object.entries(mephist_images.fileMap)) {
                if (key.startsWith(id + "-")) {
                    tutor.images.connect.push({id: value})
                }
            }

            for (const quote of jsonTutor.quotes) {
                tutor.quotes.create.push({
                    text: quote.Текст,
                    createdAt: strToDateTime(quote["Ник и дата"].split(' ').slice(-2).join(' '))
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
                tutor.materials.create.push({
                    text: jsonMaterial.Описание,
                    title: jsonMaterial.Название === null || jsonMaterial.Название === "" ? "Без названия" : jsonMaterial.Название,
                    faculties: {
                        connect: jsonMaterial.Факультет?.split("; ").map(el => {
                            return {
                                id: facultyModels[el.trim()]
                            }
                        }) || []
                    },
                    disciplines: jsonMaterial.Предмет !== null ? {connect: {id: disciplineModels[jsonMaterial.Предмет]}} : undefined,
                    createdAt: new Date(jsonMaterial["Дата добавления"]),
                    semesters: {
                        connect: jsonMaterial.Семестр && !jsonMaterial.Семестр.split("; ").includes("Аспирантура") ?
                            jsonMaterial.Семестр.split("; ").map(el => {
                                return {id: semesterModels[el]}
                            }) : []
                    },
                    files: {connect: files}
                })
                addedMaterials.add(materialId)
            }
            for (const review of jsonTutor.reviews) {
                const jsonReview = review as unknown as JsonReview;
                tutor.reviews.create.push({
                    text: jsonReview.Текст,
                    title: jsonReview.Название === null || jsonReview.Название === "" ? "Без названия" : jsonReview.Название,
                    legacyNickname: jsonReview.Ник,
                    createdAt: strToDate(jsonReview.Дата)
                })

            }

            for (const [name, review] of Object.entries(jsonTutor.mailReviews)) {
                tutor.reviews.create.push({
                    text: review,
                    title: "Отзыв с мифиста",
                    legacyNickname: name,
                    createdAt: new Date("01/01/2005")
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
            tutors.push(tutor)
        }

        for (const [id, value] of Object.entries(data.materials)) {
            if (!addedMaterials.has(id)) {
                const jsonMaterial = value as unknown as JsonMaterial;
                const els = Object.entries(mephist_files["fileMap"]).filter(([key]) => key.startsWith(id + "-"))
                await prisma.material.create({
                        data: {
                            files: {connect: els.length ? els.map(([_, value]) => ({id: value})) : undefined},
                            text: jsonMaterial.Описание,
                            title: jsonMaterial.Название === null || jsonMaterial.Название === "" ? "Без названия" : jsonMaterial.Название,
                            faculties: {
                                connect: jsonMaterial.Факультет?.split("; ").map(el => {
                                    return {
                                        id: facultyModels[el.trim()]
                                    }
                                }) || []
                            },
                            disciplines: jsonMaterial.Предмет !== null ? {
                                connectOrCreate: {
                                    where: {name: jsonMaterial.Предмет},
                                    create: {name: jsonMaterial.Предмет}
                                }
                            } : undefined,
                            createdAt: new Date(jsonMaterial["Дата добавления"]),
                            semesters: {
                                connect: jsonMaterial.Семестр && !jsonMaterial.Семестр.split("; ").includes("Аспирантура") ?
                                    jsonMaterial.Семестр.split("; ").map(el => {
                                        return {id: semesterModels[el]}
                                    }) : []
                            },
                        }
                    }
                )
            }
        }

        await prisma.tutor.createMany({
            data: tutors,
        });

        // for (const tutor of tutors) {
        //     console.log(JSON.stringify(tutor));
        //
        //
        //     // createTutorPromises.push(tutorCreatePromise);
        // }

        // await Promise.all(createTutorPromises)
        //     .catch(error => {
        //         console.error("An error occurred while creating tutors: ", error);
        //     });
        // });
        return tutors;
    })
});