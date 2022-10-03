// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/uuidRegex";
import { getToken } from 'next-auth/jwt';
import { getDocument } from 'lib/database/fullTextSearch';

async function getMaterials(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const materials = await prisma.material.findMany({
        where: {tutorId: id},
        select: {
            id: true,
            title: true,
            text: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            likes: true,
            dislikes: true,
            commentCount: true
        },
        take: 10,
        orderBy: {createdAt: 'desc'}
    });

    res.status(200).json(materials);
}

async function newMaterial(req: NextApiRequest, res: NextApiResponse) {
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const {id: tutor} = req.query;
    const {
        title,
        text,
        files,
        faculties,
        disciplines,
        semesters,
    }: {
        title: string,
        text: string,
        files: string[],
        faculties: string[],
        disciplines: string[],
        semesters: string[]
    } = req.body;
    if (!title || !text || !files || !faculties || !disciplines ||
         !semesters || !tutor || typeof tutor !== "string" || !tutor.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // console.log(JSON.stringify(data))
    const material = await prisma.$transaction(async (prisma) => {

    const material = await prisma.material.create({
            data: {
                title,
                text,
                files: files.length > 0 ? {
                    connect: files.map(file => ({
                        id: file
                    }))
                } : undefined,
                faculties: faculties.length > 0 ? {
                    connect: faculties.map(faculty => ({
                        name: faculty
                    }))
                } : undefined,
                disciplines: disciplines.length > 0 ? {
                    connect: disciplines.map(discipline => ({
                        name: discipline
                    }))
                } : undefined,
                semesters: semesters.length > 0 ? {
                    connect: semesters.map(semester => ({
                        name: semester
                    }))
                } : undefined,
                tutor: {
                    connect: {
                        id: tutor
                    }
                },
                user: {
                    connect: {
                        id: session.sub
                    }
                }
            }
        }
    );
    await prisma.tutor.update({
        where: {
            id: tutor
        },
        data: {
            materialsCount: {
                increment: 1
            }
        }
    });
    await prisma.user.update({
        where: {
            id: session.sub
        },
        data: {
            materialsCount: {
                increment: 1
            }
        }
    });
    await prisma.document.create({
        data: {
            type: "material",
            ...getDocument(title + ' ' + text)
        }
    });

    return material;
    });

    res.status(200).json({material});
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method === "GET") {
        await getMaterials(req, res);
    } else if (req.method === "POST") {
        await newMaterial(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
