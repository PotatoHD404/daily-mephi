import {NextApiRequest, NextApiResponse} from "next";
import {UUID_REGEX} from "./materials";
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";

async function getRates(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const rates = await prisma.rate.findMany({
        where: {tutorId: id},
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    });

    res.status(200).json({status: "ok", rates});
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
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }


    const rateExists = await prisma.rate.findUnique({
        where: {
            userId_tutorId: {
                userId: session.sub,
                tutorId: id
            }
        }
    });
    if (rateExists) {
        res.status(400).json({status: "You have already rated this tutor"});
        return;
    }

    const rate = await prisma.rate.create({
        data: {
            punctuality,
            personality,
            exams,
            quality,
            user: {
                connect: {id: session.sub}
            },
            tutor: {
                connect: {id}
            }
        }
    });
    res.status(200).json({status: "ok", id: rate.id});
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