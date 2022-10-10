// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "../../../lib/database/prisma";
import {generate3grams, prepareText} from "../../../lib/database/fullTextSearch";
import {Prisma} from "@prisma/client";
import {Sql} from "@prisma/client/runtime";
import flatten from "fork-ts-checker-webpack-plugin/lib/utils/array/flatten";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    let {query, sort, faculties, disciplines, ratingFrom, ratingTo, types} = req.query;
    if (typeof query !== "string" && query !== undefined || typeof sort === "string" &&
        sort in ["popularity", "time", "text"] ||
        (typeof types === "string" && types in ["tutor", "user", "material", "review", "quote", "news"]) ||
        (typeof types === "object" && types.every((type: string) => type
            in ["tutor", "user", "material", "review", "quote", "news"]))) {
        res.status(400).json({status: "bad request"});
        return;
    }
    if (!query) {
        res.status(400).json({status: "query is required"});
        return;
    }
    const calculatedRatingFrom = ratingFrom ? +(ratingFrom) : undefined;
    const calculatedRatingTo = ratingTo ? +(ratingTo) : undefined;
    const calculatedSort = sort ?? "popularity";

    let calculatedFaculties = faculties ?? undefined;
    if (typeof faculties === "string") {
        calculatedFaculties = [faculties];
    }
    let calculatedDisciplines = disciplines ?? undefined;
    if (typeof disciplines === "string") {
        calculatedDisciplines = [disciplines];
    }
    let calculatedTypes: string[] | undefined;
    if (typeof types === "string") {
        calculatedTypes = [types];
    } else if (typeof types === "object") {
        calculatedTypes = types;
    } else {
        calculatedTypes = undefined;
    }
    const preparedQuery = prepareText(query);
    if (preparedQuery.length === 0) {
        res.status(200).json({result: []});
        return;
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
    if (calculatedSort === "popularity") {
        orderBy = Prisma.sql`"Document"."ratingScore" DESC`;
    } else if (calculatedSort === "time") {
        orderBy = Prisma.sql`"Document"."timeScore" DESC`;
    } else if (calculatedSort === "relevance") {
        orderBy = Prisma.sql`"Document"."score" DESC`;
    } else if (calculatedSort === "reversedPopularity") {
        orderBy = Prisma.sql`"Document"."reversedRatingScore" DESC`;
    } else if (calculatedSort === "reversedTime") {
        orderBy = Prisma.sql`"Document"."reversedTimeScore" DESC`;
    }

    const prismaMappping = {
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
                    FROM "Document" ${mustBe.length > 0 || calculatedTypes ? Prisma.sql`WHERE` : Prisma.empty}
                    ${calculatedTypes ? Prisma.sql`type in (${Prisma.join(calculatedTypes)})` : Prisma.empty}
                        ${mustBe.length > 0 ? calculatedTypes && Prisma.sql` AND ` : Prisma.empty}
                        ${mustBe.length > 0 ? Prisma.sql`words @> ${mustBe}`: Prisma.empty}),
             t2 as (SELECT t1.*
                    FROM t1 ${mustNotBe.length > 0 ? Prisma.sql`INNER JOIN t ON words @> t.word}` : Prisma.sql`WHERE FALSE`}),
             t3 as (SELECT t1.*
                    FROM t1
                    EXCEPT
                    SELECT t2.*
                    FROM t2),
             t4 as (SELECT (CAST(${grams} AS TEXT[])) as ngrams),
             qbool AS (SELECT id,
                              grams,
                              1 + ABS(ARRAY_LENGTH(grams, 1) - ARRAY_LENGTH(t4.ngrams, 1)) as delta
                       FROM t3, t4
                       WHERE grams && t4.ngrams),
             qscore AS (SELECT id, COUNT(*) n
                        FROM (SELECT id, UNNEST(grams)
                              FROM qbool
                              INTERSECT
                              SELECT id, UNNEST(t4.ngrams)
                              FROM qbool, t4) as t6
                        GROUP BY id),
        t5 as (SELECT "Document".*,
               (100 * n / delta)::FLOAT as score,
                 1 / (1 + (now() - t5."updatedAt")::FLOAT / (60 * 60 * 24 * 30 * 9.3)) as "timeScore"
        FROM "Document"
                 JOIN qscore
                      ON qscore.id = "Document".id
                 JOIN qbool
                      ON qbool.id = "Document".id)
        SELECT t5.id,
             t5."userId",
             t5."tutorId",
             t5."materialId",
             t5."reviewId",
             t5."quoteId",
             t5."newsId",
             t5.type,
            t5.score * 100 as score,
            t5.score * (1 + t5."ratingScore") * 50 as "ratingScore",
            t5.score * (2 - t5."ratingScore") * 50 as "reversedRatingScore",
            t5.score * (1 + t5."timeScore") * 50 as "timeScore",
            t5.score * (2 - t5."timeScore") * 50 as "reversedTimeScore",
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
        if(!results[el.type]) {
            results[el.type] = [];
        }
        if(el.type !== "unknown") {
            results[el.type].push(el);
        }
    });
    let result = flatten(await Promise.all(Object.entries(results).map(async ([key, value]: any) => {
        let ids = value.map((el: any) => el.docId);
        // @ts-ignore
        const table = prismaMappping[key];
        return await table.findMany({
                where: {
                    id: {
                        in: ids
                    }
                }
            });
    })));
    res.status(200).json({result} ?? {result: []});
    return;




}
