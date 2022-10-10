// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {getDocument} from "lib/database/fullTextSearch";
import {isToxic} from "lib/isToxic";
import {verifyCSRFToken} from "../../../../lib/utils";
// verify recaptcha v3 invisible with score threshold 0.5
export async function verifyRecaptcha(req: NextApiRequest) {
    const {recaptchaToken: token} = req.body;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    return data.success && data.score >= 0.5;

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "PUT") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    let {name, image, bio} = req.body;
    const nicknameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!verifyCSRFToken(req) ||
        !await verifyRecaptcha(req) ||
        !name && !image && !bio ||
        image && typeof image !== "string" ||
        bio && (typeof bio !== "string" ||
            bio.length > 150)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    if (name && (typeof name !== "string" || !nicknameRegex.test(name))) {
        res.status(400).json({status: "Nickname must be 3-30 characters long and can only contain letters, numbers and underscores"});
        return;
    }


    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    // const isNew = session.name == null;
    if (bio && await isToxic(bio)) {
        res.status(400).json({status: "bio is toxic"});
        return;
    }
    if (name && await isToxic(name)) {
        res.status(400).json({status: "name is toxic"});
        return;
    }
    const userId = session.sub;
    await prisma.$transaction(async (prisma) => {
        // TODO: parallelize
        if (name) {
            const user = await prisma.user.findUnique({where: {name}});
            if (user && user.id !== userId) {
                res.status(409).json({status: "name already taken"});
                return;
            }
        }
        if (image) {
            const user = await prisma.user.findFirst({where: {image}});
            if (user && user.id !== userId) {
                res.status(409).json({status: "image already taken"});
                return;
            }
        }
        await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                    image: image ? {connect: {id: image}} : undefined,
                    bio,
                }
            }
        )
        // update or create document
        const docContent = getDocument(name + ' ' + bio);
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
        res.status(200).json({status: "ok"});
    });

}
