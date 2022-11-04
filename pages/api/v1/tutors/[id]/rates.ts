import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getClient} from "../../../../../lib/database/pg";

async function getRates(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const client = await getClient();

    // const rates = await prisma.rate.findMany({
    //     where: {tutorId: id},
    //     select: {
    //         id: true,
    //         user: {
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 image: true,
    //             }
    //         }
    //     }
    // });
    const {rows: rates} = await client.query(`
        SELECT rates.id,
               rates.user_id,
               users.name,
               users.image
        FROM rates
                 LEFT JOIN users ON users.id = rates.user_id
        WHERE rates.tutor_id = $1
    `, [id]);

    res.status(200).json({rates});
}

async function addRate(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {punctuality, personality, exams, quality} = req.body;
    if (!punctuality ||
        !personality ||
        !exams ||
        !quality ||
        typeof punctuality !== "number" ||
        typeof personality !== "number" ||
        typeof exams !== "number" ||
        typeof quality !== "number" ||
        punctuality < 0 || punctuality > 10 ||
        personality < 0 || personality > 10 ||
        exams < 0 || exams > 10 ||
        quality < 0 || quality > 10) {
        res.status(400).json({status: "bad request"});
        return;
    }

    const session = await getToken({req})
    let userId = session?.sub;
    const client = await getClient();
    if (!userId && process.env.LOCAL !== "true") {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    } else {

        // select first user from database
        const {rows: [user]} = await client.query(
            `SELECT id
             FROM users
             LIMIT 1;`);
        userId = user.id;
    }


    // const rateExists = await prisma.rate.findUnique({
    //     where: {
    //         userId_tutorId: {
    //             userId: session.sub,
    //             tutorId: id
    //         }
    //     }
    // });
    // if (rateExists) {
    //     res.status(400).json({status: "You have already rated this tutor"});
    //     return;
    // }
    // const rate = await prisma.$transaction(async (prisma) => {
    //     const rate = await prisma.rate.create({
    //         data: {
    //             punctuality,
    //             personality,
    //             exams,
    //             quality,
    //             user: {
    //                 connect: {id: session.sub}
    //             },
    //             tutor: {
    //                 connect: {id}
    //             }
    //         }
    //     });
    // });
    // check if user has already rated this tutor

    const {rows: [rateExists]} = await client.query(`
        SELECT id
        FROM rates
        WHERE user_id = $1 AND tutor_id = $2
        LIMIT 1;
    `, [userId, id]);
    if (rateExists) {
        res.status(400).json({status: "You have already rated this tutor"});
        return;
    }
    const {rows: [rate]} = await client.query(`
        BEGIN;
        INSERT INTO rates (punctuality, personality, exams, quality, user_id, tutor_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
        COMMIT;
    `, [punctuality, personality, exams, quality, userId, id]);


    res.status(200).json({id: rate.id});
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getRates(req, res);
    } else if (req.method === "POST") {
        await addRate(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
