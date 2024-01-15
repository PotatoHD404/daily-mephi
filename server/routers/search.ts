import {t} from "server/utils";
import {z} from "zod";
import {generate3grams, prepareText} from "lib/database/fullTextSearch";
import {Prisma} from ".prisma/client";
import {TRPCError} from "@trpc/server";
import Sql = Prisma.Sql;

// sort in ["popularity", "time", "text"] ||
// (typeof types === "string" && types in ["tutor", "user", "material", "review", "quote", "news"]) ||
export const searchRouter = t.router({
    search: t.procedure
        // .meta({
        //     openapi: {
        //         method: 'GET',
        //         path: '/search'
        //     }
        // })
        .input(z.object({
            query: z.string(),
            sort: z.enum(['relevance', 'time']).default('relevance'),
            faculty_ids: z.array(z.string()).optional(),
            discipline_ids: z.array(z.string()).optional(),
            rating_from: z.number().optional(),
            rating_to: z.number().optional(),
            types: z.array(z.enum(['tutor', 'user', 'material', 'review', 'quote', 'news'])).optional(),
            limit: z.number().int().min(1).max(100).default(10),
            offset: z.number().int().min(1).max(100).default(0),
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
            const preparedQuery = prepareText(query);
            if (preparedQuery.length === 0) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Query is empty'
                });
            }

            const grams = generate3grams(query);
            // console.log(grams);
            query = preparedQuery;
            const mustBe = Array.from(query.matchAll(/"([^ ]+)"/g), (el) => el[1]);

            const mustNotBe = Array.from(query.matchAll(/-([^ ]+)/g), (el) => el[1]);
            // console.log(query, grams, mustBe, mustNotBe);
            // const searchResult = await prisma.$queryRaw`
            //     SELECT * FROM "Document"`;
            let orderBy: Sql = Prisma.empty;
            if (sort === "time") {
                orderBy = Prisma.sql`"Document"."timeScore" DESC`;
            } else if (sort === "relevance") {
                orderBy = Prisma.sql`"Document"."score" DESC`;
            }

            const prismaMapping = {
                "tutor": prisma.tutor,
                "user": prisma.user,
                "material": prisma.material,
                "review": prisma.review,
                "quote": prisma.quote,
                "news": prisma.news
            }


            let searchResult: any = await prisma.$queryRaw`
                WITH ${mustNotBe.length > 0 ? Prisma.sql`t as (SELECT ARRAY [UNNEST(CAST(${mustNotBe} AS TEXT[]))] as word),` : Prisma.empty}
                         t1 as (SELECT *
                    FROM "Document"
                         ${mustBe.length > 0 || types ? Prisma.sql`WHERE` : Prisma.empty}
                         ${types ? Prisma.sql`type in (${Prisma.join(types)})` : Prisma.empty}
                         ${mustBe.length > 0 ? types && Prisma.sql` AND ` : Prisma.empty}
                         ${mustBe.length > 0 ? Prisma.sql`words @> ${mustBe}` : Prisma.empty}
                         )
                         ,
                         t2
                         as
                         (
                         SELECT t1.*
                         FROM t1 ${mustNotBe.length > 0 ? Prisma.sql`INNER JOIN t ON words @> t.word}` : Prisma.sql`WHERE FALSE`}), t3 as (
                         SELECT t1.*
                         FROM t1
                         EXCEPT
                         SELECT t2.*
                         FROM t2), t4 as (
                         SELECT (CAST (${grams} AS TEXT[])) as ngrams), qbool AS (
                         SELECT id, grams, 1 + ABS(ARRAY_LENGTH(grams, 1) - ARRAY_LENGTH(t4.ngrams, 1)) as delta
                         FROM t3, t4
                         WHERE grams && t4.ngrams)
                             , qscore AS (
                         SELECT id, COUNT(*) n
                         FROM (SELECT id, UNNEST(grams)
                             FROM qbool
                             INTERSECT
                             SELECT id, UNNEST(t4.ngrams)
                             FROM qbool, t4) as t6
                         GROUP BY id),
                             t5 as (
                         SELECT "Document".*, (100 * n / delta)::FLOAT as score, 1 / (1 + (now() - t5."updatedAt")::FLOAT / (60 * 60 * 24 * 30 * 9.3)) as "timeScore"
                         FROM "Document"
                             JOIN qscore
                         ON qscore.id = "Document".id
                             JOIN qbool
                             ON qbool.id = "Document".id)
                         SELECT t5.id, t5."userId", t5."tutorId", t5."materialId", t5."reviewId", t5."quoteId", t5."newsId", t5.type, t5.score * 100 as score, t5.score * (1 + t5."ratingScore") * 50 as "ratingScore", t5.score * (2 - t5."ratingScore") * 50 as "reversedRatingScore", t5.score * (1 + t5."timeScore") * 50 as "timeScore", t5.score * (2 - t5."timeScore") * 50 as "reversedTimeScore",
                         FROM t5
                         ORDER BY ${orderBy};
            `;
            searchResult = searchResult.map((el: any) => {
                el.docId = el.userId ?? el.tutorId ?? el.materialId ?? el.reviewId ?? el.quoteId ?? el.newsId;
                delete el.userId;
                delete el.tutorId;
                delete el.materialId;
                delete el.reviewId;
                delete el.quoteId;
                delete el.newsId;
                return el;
            });
            let results: any = {};
            searchResult.forEach((el: any) => {
                if (!results[el.type]) {
                    results[el.type] = [];
                }
                if (el.type !== "unknown") {
                    results[el.type].push(el);
                }
            });
            return (await Promise.all(Object.entries(results).map(async ([key, value]: any) => {
                let ids = value.map((el: any) => el.docId);
                // @ts-ignore
                const table = prismaMapping[key];
                return await table.findMany({
                    where: {
                        id: {
                            in: ids
                        }
                    }
                });
            }))).flat();
        }),
});
