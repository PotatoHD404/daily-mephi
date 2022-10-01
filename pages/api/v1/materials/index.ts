import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";

// Request: GET /api/v1/materials

// {
//     "header": "test header",
//     "description": "test description",
//     "files": ["0004114e-9593-4a5d-94ba-cc9fa18eb899", "00147479-35ae-4a68-978f-302391ce23d1"],
//     "faculties": ["Кибернетика", "Вечерний"],
//     "disciplines": [],
//     "semesters": ["Б1"],
//     "tutor": "0009acc5-8edd-474e-8522-e803c3998065"
// }

// Response:
// {
//     "material": {
//     "id": "5ac6c689-70eb-4392-8b6d-d4f6af997520",
//         "description": "test description",
//         "header": "test header",
//         "userId": "ef18eadb-34ea-4b3d-8705-b78d5d008009",
//         "tutorId": "0009acc5-8edd-474e-8522-e803c3998065",
//         "createdAt": "2022-07-26T20:57:19.931Z"
// }
// }
async function getMaterials(req: NextApiRequest, res: NextApiResponse<object>) {
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const materials = await prisma.material.findMany({
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
            commentCount: true,
        },
        take: 10
        // take: req.query.take ? parseInt(req.query.take) : undefined,
    });
    res.status(200).json({materials});
}

async function newMaterial(req: NextApiRequest, res: NextApiResponse<object>) {
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }

    const {
        header: title,
        description: text,
        files,
        faculties,
        disciplines,
        semesters,
        tutor
    }: {
        header: string,
        description: string,
        tutor: string,
        files: string[],
        faculties: string[],
        disciplines: string[],
        semesters: string[]
    } = req.body;
    if (!title || !text || !files || !faculties || !disciplines || !semesters) {
        res.status(400).json({status: "bad request"});
        return;
    }

    const data = {
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
    };
    // console.log(JSON.stringify(data))
    const material = await prisma.material.create({
            data
        }
    );

    res.status(200).json({material});
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method === "POST") {
        await newMaterial(req, res);
    } else if (req.method === "GET") {
        await getMaterials(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }

}
