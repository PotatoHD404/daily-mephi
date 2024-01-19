import {t} from "server/utils";
import {z} from "zod";
import {convertGoogleQueryToTsQuery, prepareText} from "lib/database/fullTextSearch";
import {TRPCError} from "@trpc/server";
import {DefaultArgs} from "@prisma/client/runtime/library";
import {Prisma, PrismaClient} from "@prisma/client";

export type DocsKeyTypes = "tutor" | "user" | "material" | "review" | "quote" | "news";
export type PrismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
const findTutors = async (prisma: PrismaType, ids: string[]) =>
    prisma.tutor.findMany({
        where: {
            id: {in: ids},
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
const findUsers = async (prisma: PrismaType, ids: string[]) =>
    prisma.user.findMany({
        where: {
            id: {in: ids},
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
const findMaterials = async (prisma: PrismaType, ids: string[]) =>
    prisma.material.findMany({
        where: {
            id: {in: ids},
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

const findReviews = async (prisma: PrismaType, ids: string[]) =>
    prisma.review.findMany({
        where: {
            id: {in: ids},
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
const findQuote = async (prisma: PrismaType, ids: string[]) =>
    prisma.quote.findMany({
        where: {
            id: {in: ids},
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

const findNews = async (prisma: PrismaType, ids: string[]) =>
    prisma.news.findMany({
        where: {
            id: {in: ids},
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
            faculty_ids: z.array(z.string()).optional().default([]),
            discipline_ids: z.array(z.string()).optional().default([]),
            rating_from: z.number().min(0).max(5).optional().default(0),
            rating_to: z.number().min(0).max(5).optional().default(5),
            types: z.array(z.enum(['tutor', 'user', 'material', 'review', 'quote', 'news'])).optional().default([]),
            limit: z.number().int().min(1).max(100).default(10),
            offset: z.number().int().min(0).default(0),
        }))
        /* .output(z.any()) */
        .query(async ({
                          ctx: {prisma},
                          input: {
                              query,
                              sort,
                              faculty_ids: facultyIds,
                              discipline_ids: disciplineIds,
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
                recordId: string;
                type: DocsKeyTypes;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                score: number;
            }



            const docs: DocsType[] = await prisma.$queryRaw`
                SELECT *, similarity("documents"."text", ${tsQuery}) as similarity FROM "documents"
                    LEFT JOIN "tutors" ON "documents"."record_id" = "tutors"."id" AND "documents"."type" = 'tutor'
                    LEFT JOIN "_tutors_faculties" ON tutors.id = _tutors_faculties."B"
                    LEFT JOIN "_tutors_disciplines" ON tutors.id = _tutors_disciplines."B"
                    LEFT JOIN "ratings" ON tutors.id = ratings.tutor_id
                ${tsQuery !== "" ? Prisma.sql`WHERE "documents"."text" @@ to_tsquery('russian', ${tsQuery})` : Prisma.empty}
                ${tsQuery === "" ? Prisma.sql`WHERE` : Prisma.sql`AND`}
                "documents"."type" = ANY(${types}) AND
                "documents"."deleted_at" IS NULL AND
                "_tutors_disciplines"."id" = ANY(${disciplineIds}) AND
                "_tutors_faculties"."id" = ANY(${facultyIds}) AND
                "ratings".avg_rating BETWEEN ${ratingFrom} AND ${ratingTo}
            GROUP
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

            const result: {
                tutor: Tutor[],
                user: User[],
                material: Material[],
                review: Review[],
                quote: Quote[],
                news: News[]
            } = {
                tutor: [],
                user: [],
                material: [],
                review: [],
                quote: [],
                news: [],
            };

            await Promise.all(Object.entries(groupedDocs).map(async ([key, value]) => {
                const ids = value.map(el => el.recordId);

                switch (key) {
                    case "tutor":
                        // we need to select all fields but also the image
                        result.tutor = await findTutors(prisma, ids);
                        break;
                    case "user":
                        result.user = await findUsers(prisma, ids);
                        break;
                    case "material":
                        result.material = await findMaterials(prisma, ids);
                        break;
                    case "review":
                        result.review = await findReviews(prisma, ids);
                        break;
                    case "quote":
                        result.quote = await findQuote(prisma, ids);
                        break;
                    case "news":
                        result.news = await findNews(prisma, ids);
                        break;
                    default:
                        throw new Error(`Unsupported type: ${key}`);
                }
            }));

            return result;
        }),
});

// export Tutor, User, Material, Review, Quote, News types