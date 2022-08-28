// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";

let epoch = new Date(1970, 1, 1);

function epoch_seconds(date: Date) {
    return date.getSeconds() - epoch.getSeconds();
}

function score(ups: number, downs: number) {
    return ups - downs;
}

function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
}

function hot(ups: number, downs: number, date: Date) {
    let s = score(ups, downs);
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

function confidence(ups: number, downs: number): number {
    const n = ups + downs;

    if (n === 0) {
        return 0;
    }

    const z = 1.281551565545;
    const p = ups / n;

    const left = p + 1 / (2 * n) * z * z;
    const right = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
    const under = 1 + 1 / n * z * z;

    return (left - right) / under;
}
// Translate confidence to simple sql statement without functions from js
// SELECT id, (c3.left - c3.right) / c3.under as score
// FROM (SELECT id,
//     p + 1 / (2 * n) * z * z                         as left,
//     z * SQRT(p * (1 - p) / n + z * z / (4 * n * n)) as right,
//     1 + 1 / n * z * z                               as under
// FROM (SELECT id,
//     (ups + downs)       AS n,
// ups / (ups + downs) AS p,
//     z
// FROM (SELECT id,
//     count(cl."A")  as ups,
//     count(cd."A")  as downs,
//     1.281551565545 AS z
// FROM "Comment"
// LEFT JOIN "_comments_dislikes" cd on "Comment".id = cd."A"
// LEFT JOIN "_comments_likes" cl on "Comment".id = cl."A"
// group by id
// ) as c1
// WHERE ups + downs != 0) as c2) as c3;




export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    let quotes = await prisma.quote.findMany({
        orderBy: {
            score: "desc"
        }
    });

    res.status(200).json({});
}
