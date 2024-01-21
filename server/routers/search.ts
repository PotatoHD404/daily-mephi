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
                ${types.includes('tutor') ? Prisma.sql`("documents"."type" = 'tutor' AND EXISTS(SELECT 1 FROM "tutors"
                                JOIN "_tutors_faculties" ON tutors.id = _tutors_faculties."B"
                                JOIN "_tutors_disciplines" ON tutors.id = _tutors_disciplines."B"
                                JOIN "ratings" ON tutors.id = ratings.tutor_id
                                WHERE "documents"."id" = "tutors"."document_id" AND
                                      ${disciplineIds.length ? Prisma.sql`"_tutors_disciplines"."id" = ANY(${disciplineIds}) AND` : Prisma.empty}
                                      ${facultyIds.length ? Prisma.sql`"_tutors_faculties"."id" = ANY(${facultyIds}) AND` : Prisma.empty}
                                      ${ratingFrom != 0 || ratingTo == 5 ? Prisma.sql`"ratings".avg_rating BETWEEN ${ratingFrom} AND ${ratingTo}` : Prisma.empty}
                                      )
                                      ${types.length > 1 ? Prisma.sql`OR "documents"."type" != 'tutor'` : Prisma.empty})` : Prisma.empty}
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
                const ids = value.map(el => el.id);

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