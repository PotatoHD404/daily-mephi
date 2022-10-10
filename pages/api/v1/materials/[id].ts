import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/constants/uuidRegex";

// Request: GET /api/v1/news/[id]

// Response:
// {
//     "material": {
//     "header": "Лекции по дискве",
//         "description": "",
//         "createdAt": "2008-04-11T09:10:51.000Z",
//         "files": [],
//         "tutor": {
//         "id": "5b2219c2-c2bf-41d6-8b4f-eb0a5763f717",
//             "firstName": "Игорь",
//             "lastName": "Юров",
//             "fatherName": "Адольфович"
//     },
//     "user": null,
//         "faculties": [
//         "Кибернетика",
//         "Информационной безопасности"
//     ],
//         "disciplines": [
//         "Дискретная математика"
//     ],
//         "semesters": [
//         "Б2"
//     ],
//         "likes": [],
//         "dislikes": [],
//         "comments": []
// }
// }


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    // console.log(id)
    const material = await prisma.material.findUnique({
        where: {
            id
        },
        select: {
            title: true,
            text: true,
            createdAt: true,
            files: {
                select: {
                    filename: true,
                    url: true,
                }
            },
            tutor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    fatherName: true,
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
            faculties: {
                select: {
                    name: true,
                }
            },
            disciplines: {
                select: {
                    name: true,
                }
            },
            semesters: {
                select: {
                    name: true,
                }
            },
            // likes: true,
            // dislikes: true,
            // commentCount: true,
        },
    });

    if (!material) {
        res.status(404).json({status: "not found"});
        return;
    }

    res.status(200).json({
        material: {
            ...material,
            faculties: material.faculties.map(faculty => faculty.name),
            disciplines: material.disciplines.map(discipline => discipline.name),
            semesters: material.semesters.map(semester => semester.name),
        }
    });
}
