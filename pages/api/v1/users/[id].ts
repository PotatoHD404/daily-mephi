// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {verifyCSRFToken} from "lib/utils";
import {getClient} from "lib/database/pg";
import {getToken} from "next-auth/jwt";
import {isToxic} from "lib/isToxic";
import {getDocument} from "lib/database/fullTextSearch";


export async function verifyRecaptcha(req: NextApiRequest) {
    const {recaptchaToken: token} = req.body;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    return data.success && data.score >= 0.5;
}

async function changeUser(req: NextApiRequest, res: NextApiResponse<object>) {
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

    const client = await getClient();

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

    // await prisma.$transaction(async (prisma) => {
    //     // TODO: parallelize
    //     if (name) {
    //         const user = await prisma.user.findUnique({where: {name}});
    //         if (user && user.id !== userId) {
    //             res.status(409).json({status: "name already taken"});
    //             return;
    //         }
    //     }
    //     if (image) {
    //         const user = await prisma.user.findFirst({where: {image}});
    //         if (user && user.id !== userId) {
    //             res.status(409).json({status: "image already taken"});
    //             return;
    //         }
    //     }
    //     await prisma.user.update({
    //             where: {
    //                 id: userId
    //             },
    //             data: {
    //                 name,
    //                 image: image ? {connect: {id: image}} : undefined,
    //                 bio,
    //             }
    //         }
    //     )
    //     // update or create document
    //     const docContent = getDocument(name + ' ' + bio);
    //     await prisma.document.upsert({
    //         where: {
    //             userId
    //         },
    //         create: {
    //             userId,
    //             ...docContent
    //         },
    //         update: docContent
    //     });
    //     res.status(200).json({status: "ok"});
    // });

    await client.query('BEGIN');
    try {
        if (name) {
            const {rows: [user]} = await client.query('SELECT * FROM users WHERE name = $1', [name]);
            if (user && user.id !== userId) {
                res.status(409).json({status: "name already taken"});
                return;
            }
        }
        if (image) {
            const {rows: [user]} = await client.query('SELECT * FROM users WHERE image = $1', [image]);
            if (user && user.id !== userId) {
                res.status(409).json({status: "image already taken"});
                return;
            }
        }
        await client.query('UPDATE users SET name = $1, image = $2, bio = $3 WHERE id = $4', [name, image, bio, userId]);
        // update or create document
        const docContent = name + ' ' + bio;
        await client.query('INSERT INTO documents (user_id, data) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET data = $2', [userId, docContent]);
        await client.query('COMMIT');
        res.status(200).json({status: "ok"});
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
}

async function getUser(req: NextApiRequest, res: NextApiResponse<object>) {
    let {id} = req.query;
    if (!id || typeof id != "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const client = await getClient();
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
    // get user and it's place in rating

const {rows: [user]} = await client.query(`SELECT name,
                                                  id,
                                                  image,
                                                  rating,
                                                  role,
                                                  (SELECT COUNT(*) FROM users WHERE rating > u.rating) + 1 AS place
                                           FROM users u
                                           WHERE id = $1`, [id]);



    if (!user) {
        res.status(404).json({status: "not found"});
        return;
    }
    res.status(200).json(user);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method == "GET") {
        await getUser(req, res);
    }
    else if (req.method == "PUT") {
        await changeUser(req, res);
    }
    else {
        res.status(405).json({status: "method not allowed"});
        return;
    }

}
