import {t} from "server/utils";
import {z} from "zod";
import {convertGoogleQueryToTsQuery, prepareText} from "lib/database/fullTextSearch";
import {TRPCError} from "@trpc/server";
import {User} from "next-auth";
import {Material, News, Review} from ".prisma/client";
import {Quote} from "@prisma/client";

type DocsKeyTypes = "tutor" | "user" | "material" | "review" | "quote" | "news";
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
            faculty_ids: z.array(z.string()).optional(),
            discipline_ids: z.array(z.string()).optional(),
            rating_from: z.number().optional(),
            rating_to: z.number().optional(),
            types: z.array(z.enum(['tutor', 'user', 'material', 'review', 'quote', 'news'])).optional(),
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
            // model Document {
            //     id        String     @id @default(dbgenerated("gen_random_uuid()")) @map("id") @db.Uuid
            //     text      String     @map("text")
            //     recordId  String     @unique @db.Uuid
            //     type      String     @default("unknown") @map("type")
            //     createdAt DateTime   @default(now()) @map("created_at")
            //     updatedAt DateTime   @updatedAt @map("updated_at")
            //     deletedAt DateTime?  @map("deleted_at")
            //         score     Float      @default(0) @map("score")
            //     Review    Review[]
            //     Tutor     Tutor[]
            //     User      User[]
            //     Material  Material[]
            //     News      News[]
            //     Quote     Quote[]
            //
            // @@index([type])
            // @@index([recordId])
            // @@map("documents")
            // }
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
                SELECT *, similarity("Document"."text", ${tsQuery}) as similarity FROM "Document"
                WHERE "Document"."text" @@ to_tsquery(${tsQuery})
                ORDER BY similarity DESC
                LIMIT ${limit} OFFSET ${offset}`;


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

            // const prismaMapping = {
            //     "tutor": prisma["tutor"],
            //     "user": prisma.user,
            //     "material": prisma.material,
            //     "review": prisma.review,
            //     "quote": prisma.quote,
            //     "news": prisma.news
            // }


            // export type $TutorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
            //     name: "Tutor"
            //     objects: {
            //         images: Prisma.$FilePayload<ExtArgs>[]
            //         rates: Prisma.$RatePayload<ExtArgs>[]
            //         reviews: Prisma.$ReviewPayload<ExtArgs>[]
            //         disciplines: Prisma.$DisciplinePayload<ExtArgs>[]
            //         faculties: Prisma.$FacultyPayload<ExtArgs>[]
            //         materials: Prisma.$MaterialPayload<ExtArgs>[]
            //         legacyRating: Prisma.$LegacyRatingPayload<ExtArgs> | null
            //         rating: Prisma.$RatingPayload<ExtArgs> | null
            //         quotes: Prisma.$QuotePayload<ExtArgs>[]
            //         document: Prisma.$DocumentPayload<ExtArgs> | null
            //     }
            //     scalars: $Extensions.GetPayloadResult<{
            //         id: string
            //         firstName: string | null
            //         lastName: string | null
            //         fatherName: string | null
            //         fullName: string
            //         shortName: string
            //         nickname: string | null
            //         url: string | null
            //         createdAt: Date
            //         updatedAt: Date
            //         deletedAt: Date | null
            //         reviewsCount: number
            //         materialsCount: number
            //         quotesCount: number
            //         ratesCount: number
            //         score: number
            //         documentId: string | null
            //     }, ExtArgs["result"]["tutor"]>
            //     composites: {}
            // }

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
                        const r =  await prisma.tutor.findMany({
                            where: {
                                id: {in: ids},
                            },
                            select: {
                                id: true,
                                firstName: true,
                                images: {
                                    select: {
                                        url: true,

                                    }
                                },
                            }
                        });
                        break;
                    case "user":
                        result.user = await prisma.user.findMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case "material":
                        result.material = await prisma.material.findMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case "review":
                        result.review = await prisma.review.findMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case "quote":
                        result.quote = await prisma.quote.findMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case "news":
                        result.news = await prisma.news.findMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    default:
                        throw new Error(`Unsupported type: ${key}`);
                }
            }));



            //
            // const docs = await prisma.$queryRaw`
            //     SELECT * FROM "Document"
            //     WHERE "Document"."text" @@ to_tsquery(${preparedQuery})`;
            //
            //
            // // console.log(grams);
            // query = preparedQuery;
            // const mustBe = Array.from(query.matchAll(/"([^ ]+)"/g), (el) => el[1]);
            //
            // const mustNotBe = Array.from(query.matchAll(/-([^ ]+)/g), (el) => el[1]);
            // // console.log(query, grams, mustBe, mustNotBe);
            // // const searchResult = await prisma.$queryRaw`
            // //     SELECT * FROM "Document"`;
            // let orderBy: Sql = Prisma.empty;
            // if (sort === "time") {
            //     orderBy = Prisma.sql`"Document"."timeScore" DESC`;
            // } else if (sort === "relevance") {
            //     orderBy = Prisma.sql`"Document"."score" DESC`;
            // }
            //

            //
            //
            //
            // return (await Promise.all(Object.entries(results).map(async ([key, value]) => {
            //     let ids = value.map((el: any) => el.docId);
            //     const table = prismaMapping[key] as Prisma.TutorDelegate<DefaultArgs>;
            //     return await table.findMany({
            //         where: {
            //             id: {
            //                 in: ids
            //             }
            //         }
            //     });
            // }))).flat();
        }),
});
