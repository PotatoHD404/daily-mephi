import {t} from "server/utils";
import {z} from "zod";
import {convertGoogleQueryToTsQuery, prepareText} from "lib/database/fullTextSearch";
import {TRPCError} from "@trpc/server";
import {Prisma, PrismaClient} from "@prisma/client";

export type DocsKeyTypes = "tutor" | "user" | "material" | "review" | "quote" | "news";
const findTutors = async (prisma: PrismaClient, ids: string[]) =>
    prisma.tutor.findMany({
        where: {
            documentId: {in: ids},
        },
        select: {
            id: true,
            fullName: true,
            shortName: true,
            materialsCount: true,
            reviewsCount: true,
            quotesCount: true,
            ratesCount: true,
            updatedAt: true,
            images: {
                select: {
                    url: true,
                }
            },
        }
    });
const findUsers = async (prisma: PrismaClient, ids: string[]) =>
    prisma.user.findMany({
        where: {
            documentId: {in: ids},
        },
        select: {
            id: true,
            nickname: true,
            image: {
                select: {
                    url: true,
                }
            },
        }
    });
const findMaterials = async (prisma: PrismaClient, ids: string[]) =>
    prisma.material.findMany({
        where: {
            documentId: {in: ids},
        },
        select: {
            id: true,
            title: true,
            text: true,
            updatedAt: true,
            commentsCount: true,
            likesCount: true,
            dislikesCount: true,
            files: {
                select: {
                    url: true,
                }
            },
        }
    });

const findReviews = async (prisma: PrismaClient, ids: string[]) =>
    prisma.review.findMany({
        where: {
            documentId: {in: ids},
        },
        select: {
            id: true,
            text: true,
            updatedAt: true,
            likesCount: true,
            dislikesCount: true,
            user: {
                select: {
                    id: true,
                    nickname: true,
                    image: {
                        select: {
                            url: true,
                        }
                    },
                }
            },
        }
    });
const findQuote = async (prisma: PrismaClient, ids: string[]) =>
    prisma.quote.findMany({
        where: {
            documentId: {in: ids},
        },
        select: {
            id: true,
            text: true,
            updatedAt: true,
            likesCount: true,
            dislikesCount: true,
            user: {
                select: {
                    id: true,
                    nickname: true,
                    image: {
                        select: {
                            url: true,
                        }
                    },
                }
            },
        }
    });

const findNews = async (prisma: PrismaClient, ids: string[]) =>
    prisma.news.findMany({
        where: {
            documentId: {in: ids},
        },
        select: {
            id: true,
            title: true,
            text: true,
            updatedAt: true,
            likesCount: true,
            dislikesCount: true,
            commentsCount: true,
        }
    });

type Tutor = Awaited<ReturnType<(typeof findTutors)>>[0];
type User = Awaited<ReturnType<(typeof findUsers)>>[0];
type Material = Awaited<ReturnType<(typeof findMaterials)>>[0];
type Review = Awaited<ReturnType<(typeof findReviews)>>[0];
type Quote = Awaited<ReturnType<(typeof findQuote)>>[0];
type News = Awaited<ReturnType<(typeof findNews)>>[0];

export const searchRouter = t.router({
    search: t.procedure
        // .meta({
        //     openapi: {
        //         method: 'GET',
        //         path: '/search'
        //     }
        // })
        .input(z.object({
            query: z.string().min(1).max(100),
            sort: z.enum(['relevance', 'time']).default('relevance'),
            faculties: z.array(z.string()).optional().default([]),
            disciplines: z.array(z.string()).optional().default([]),
            semesters: z.array(z.string()).optional().default([]),
            rating_from: z.number().min(0).max(5).optional().default(0),
            rating_to: z.number().min(0).max(5).optional().default(5),
            types: z.array(z.enum(['tutor', 'user', 'material', 'review', 'quote'])).optional().default([]),
            limit: z.number().int().min(1).max(100).default(10),
            offset: z.number().int().min(0).default(0),
        }))
        /* .output(z.any()) */
        .query(async ({
                          ctx: {prisma},
                          input: {
                              query,
                              sort,
                              faculties,
                              disciplines,
                              semesters,
                              rating_from: ratingFrom,
                              rating_to: ratingTo,
                              limit,
                              offset,
                              types
                          }
                      }) => {
            const preparedText = prepareText(query);
            if (preparedText.length === 0) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Query is empty'
                });
            }
            const tsQuery = convertGoogleQueryToTsQuery(query);

            interface DocsType {
                id: string;
                text: string;
                type: DocsKeyTypes;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                score: number;
            }


            const docs: DocsType[] = await prisma.$queryRaw`
            SELECT *, similarity("documents"."text", '${tsQuery}') as similarity FROM "documents"
                WHERE "documents"."type" = ANY(${types}) AND
                ${tsQuery !== "" ? Prisma.sql`"documents"."text" @@ to_tsquery('russian', '${tsQuery}') AND` : Prisma.empty}
                "documents"."deleted_at" IS NOT NULL AND
                ${(types.includes('tutor') || types.includes('review')) ? Prisma.sql`(` : Prisma.empty}
                ${types.includes('tutor') ? Prisma.sql`"documents"."type" = 'tutor' AND EXISTS(SELECT 1 FROM "tutors"
                                JOIN "_tutors_faculties" ON tutors.id = _tutors_faculties."B"
                                JOIN "faculties" ON faculties.id = _tutors_faculties."A"
                                JOIN "_tutors_disciplines" ON tutors.id = _tutors_disciplines."B"
                                JOIN "disciplines" ON disciplines.id = _tutors_disciplines."A"
                                JOIN "ratings" ON tutors.id = ratings.tutor_id
                                WHERE 
                                      ${disciplines.length ? Prisma.sql`"disciplines"."name" = ANY(${disciplines}) AND` : Prisma.empty}
                                      ${faculties.length ? Prisma.sql`"faculties"."name" = ANY(${faculties}) AND` : Prisma.empty}
                                      ${ratingFrom != 0 || ratingTo == 5 ? Prisma.sql`"ratings".avg_rating BETWEEN ${ratingFrom} AND ${ratingTo} AND` : Prisma.empty}
                                      "documents"."id" = "tutors"."document_id"
                                      )
                                ` : Prisma.empty}
                
                ${(types.includes('tutor') && types.includes('material')) ? Prisma.sql`OR` : Prisma.empty}
                
                ${types.includes('material') ? Prisma.sql`"documents"."type" = 'material' AND EXISTS(SELECT 1 FROM "materials"
                JOIN "_materials_faculties" ON materials.id = _materials_faculties."A"
                JOIN "faculties" ON faculties.id = _materials_faculties."B"
                JOIN "_materials_disciplines" ON materials.id = _materials_disciplines."A"
                JOIN "disciplines" ON disciplines.id = _materials_disciplines."B"
                JOIN "_materials_semesters" ON materials.id = _materials_semesters."A"
                JOIN "semesters" ON materials.id = _materials_semesters."B"
                WHERE
                      ${disciplines.length ? Prisma.sql`"disciplines"."name" = ANY(${disciplines}) AND` : Prisma.empty}
                      ${faculties.length ? Prisma.sql`"faculties"."name" = ANY(${faculties}) AND` : Prisma.empty}
                      ${semesters.length ? Prisma.sql`"semesters"."name" = ANY(${semesters}) AND` : Prisma.empty}
                      "documents"."id" = "materials"."document_id"
                      )
                ` : Prisma.empty}
                
                ${types.filter(el => el !== 'tutor' && el !== 'material').length > 1 ?
                 Prisma.sql`OR "documents"."type" != 'tutor' AND "documents"."type" != 'material'` : Prisma.empty}
                
                ${(types.includes('tutor') || types.includes('review')) ? Prisma.sql`)` : Prisma.empty}
            ORDER BY
                ${sort === "time" ? Prisma.sql`updated_at DESC,` : Prisma.empty}
                similarity DESC
            LIMIT ${limit}
                OFFSET ${offset}`;


            // group by type into some object
            const groupedDocs: Record<DocsKeyTypes, DocsType[]> = {
                tutor: [],
                user: [],
                material: [],
                review: [],
                quote: [],
                news: [],
            };

            docs.forEach(el => {
                groupedDocs[el.type].push(el);
            });

            const docPositionMap: Record<string, { index: number, type: DocsKeyTypes }> = {};
            docs.forEach((el, index) => {
                docPositionMap[el.id] = {index, type: el.type};
            });
            type ResultDataType = Tutor | User | Material | Review | Quote | News;
            const result: {
                data: ResultDataType; // Replace 'any' with the actual type, e.g., Tutor | User | Material | ...
                type: DocsKeyTypes;
            }[] = new Array(docs.length);
            await Promise.all(Object.entries(groupedDocs).map(async ([key, value]) => {
                const ids = value.map(el => el.id);
                if (ids.length === 0)
                    return;
                let fetchedData: ResultDataType[];
                switch (key) {
                    case "tutor":
                        // we need to select all fields but also the image
                        fetchedData = await findTutors(prisma, ids);
                        break;
                    case "user":
                        fetchedData = await findUsers(prisma, ids);
                        break;
                    case "material":
                        fetchedData = await findMaterials(prisma, ids);
                        break;
                    case "review":
                        fetchedData = await findReviews(prisma, ids);
                        break;
                    case "quote":
                        fetchedData = await findQuote(prisma, ids);
                        break;
                    case "news":
                        fetchedData = await findNews(prisma, ids);
                        break;
                    default:
                        throw new Error(`Unsupported type: ${key}`);
                }
                fetchedData.map(el => {
                    return {data: el, type: key}
                }).forEach((doc) => {
                    const positionInfo = docPositionMap[doc.data.id];
                    result[positionInfo.index] = doc;
                });
            })).catch(err => {
                console.log(err)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: err.message
                });
            });


            return result;
        }),
});

// export Tutor, User, Material, Review, Quote, News types