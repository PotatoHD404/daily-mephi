// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/uuidRegex";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    let {id} = req.query;

    if (id == "me") {
        const session = await getToken({req})
        if (!session?.sub) {
            res.status(401).json({status: 'You are not authenticated'});
            return;
        }
        id = session.sub;
    }
    if (!id || typeof id != "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // const allUsers = {status: "ok"}
    // const user = await prisma.user.findFirst({
    //         where: {
    //             id
    //         },
    //         select: {
    //             name: true,
    //             id: true,
    //             image: true,
    //             rating: true,
    //             role: true,
    //             userCourse: true,
    //             _count: {
    //                 select: {
    //                     materials: true,
    //                     reviews: true,
    //                     quotes: true,
    //                 }
    //             },
    //         },
    //     }
    // )
    const user: any = (await prisma.$queryRaw`
        SELECT "public"."User"."id",
               "public"."User"."name",
               "public"."User"."rating",
               "public"."User"."role",
               "public"."User"."userCourse",
               "aggr_selection_0_Material"."_aggr_count_materials" as "materials_count",
               "aggr_selection_1_Review"."_aggr_count_reviews"     as "reviews_count",
               "aggr_selection_2_Quote"."_aggr_count_quotes"       as "quotes_count",
               ROW_NUMBER() OVER (ORDER BY "score" DESC)           as place,
               "public"."File"."url"                               as "image"
        FROM "public"."User"
                 LEFT JOIN (SELECT "public"."Material"."userId", COUNT(*) AS "_aggr_count_materials"
                            FROM "public"."Material"
                            GROUP BY "public"."Material"."userId") AS "aggr_selection_0_Material"
                           ON ("public"."User"."id" = "aggr_selection_0_Material"."userId")
                 LEFT JOIN (SELECT "public"."Review"."userId",
                                   COUNT(*) AS "_aggr_count_reviews"
                            FROM "public"."Review"
                            GROUP BY "public"."Review"."userId") AS "aggr_selection_1_Review"
                           ON ("public"."User"."id" = "aggr_selection_1_Review"."userId")
                 LEFT JOIN
             (SELECT "public"."Quote"."userId", COUNT(*) AS "_aggr_count_quotes"
              FROM "public"."Quote"
              GROUP BY "public"."Quote"."userId") AS "aggr_selection_2_Quote" ON (
                 "public"."User"."id" = "aggr_selection_2_Quote"."userId")
                 LEFT JOIN "public"."File"
                           ON "public"."User"."imageId" = "public"."File"."id"
        WHERE "public"."User"."id" = ${id}
        LIMIT 1` as any)[0];

    user.materials_count = Number(user.materials_count);
    user.reviews_count = Number(user.reviews_count);
    user.quotes_count = Number(user.quotes_count);
    user.place = Number(user.place);
    // console.log(user);
    // Generate sql query from above


    if (!user) {
        res.status(404).json({status: "not found"});
        return;
    }
    // @ts-ignore
    user.materials = user.materials_count;
    // @ts-ignore
    user.reviews = user.reviews_count;
    // @ts-ignore
    user.quotes = user.quotes_count;
    res.status(200).json(user);
}
