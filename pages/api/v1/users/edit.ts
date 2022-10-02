// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {getDocument} from "../../../../lib/database/fullTextSearch";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const courses = {
    "Б1": "B1",
    "Б2": "B2",
    "Б3": "B3",
    "Б4": "B4",
    "С1": "C1",
    "С2": "C2",
    "С3": "C3",
    "С4": "C4",
    "С5": "C5",
    "М1": "M1",
    "М2": "M2",
    "А1": "A1",
    "А2": "A2",
    "А3": "A3",
    "А4": "A4",
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "PUT") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    let {name, image, course} = req.body;
    const nicknameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    // @ts-ignore
    if (!name && !image && !course || name && !nicknameRegex.test(name) || course && !courses[course]) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const isNew = session.name == null;
    const userId = session.sub;
    await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                    image: image ? {connect: {id: image}} : undefined,
                    // @ts-ignore
                    userCourse: courses[course as keyof typeof courses] as any
                }
            }
        )
        // update or create document
        const docContent = getDocument(name);
        await prisma.document.upsert({
            where: {
                userId
            },
            create: {
                userId,
                ...docContent
            },
            update: docContent
        });
    });


    res.status(200).json({status: "ok"});
}
