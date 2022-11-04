// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {getToken} from 'next-auth/jwt';
import {getClient} from "lib/database/pg";

async function getMaterials(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }

    const client = await getClient();

    // const materials = await prisma.material.findMany({
    //     where: {tutorId: id},
    //     select: {
    //         id: true,
    //         title: true,
    //         text: true,
    //         createdAt: true,
    //         user: {
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 image: true,
    //             }
    //         },
    //         // likes: true,
    //         // dislikes: true,
    //         // commentCount: true
    //     },
    //     take: 10,
    //     // orderBy: {score: 'desc'}
    // });

    const {rows: materials} = await client.query(
        `SELECT materials.id,
                materials.title,
                materials.text,
                materials.created_at,
                materials.user_id,
                users.name,
                users.image,
                (SELECT COUNT(*)::INT
                 FROM reactions
                 WHERE reactions.material_id = materials.id
                   AND reactions.liked = true)                                                 AS likes,
                (SELECT COUNT(*)::INT
                 FROM reactions
                 WHERE reactions.material_id = materials.id
                   AND reactions.liked = false)                                                AS dislikes,
                (SELECT COUNT(*)::INT FROM comments WHERE comments.material_id = materials.id) AS comment_count,
                (SELECT json_agg(json_build_object(
                        'url', url,
                        'alt_url', alt_url
                    ))
                 FROM files
                 WHERE files.material_id = materials.id)                                       AS images
         FROM materials
                  LEFT JOIN users ON users.id = materials.user_id
         WHERE materials.tutor_id = $1
         ORDER BY materials.created_at DESC
         LIMIT 10;`,
        [id]);
    res.status(200).json({materials});
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
        !semesters || !tutor || typeof tutor !== "string" || !tutor.match(UUID_REGEX) || !files.every(
            (file) => file.match(UUID_REGEX)) ||
        !faculties.every((faculty) => faculty.match(UUID_REGEX)) ||
        !disciplines.every((discipline) => discipline.match(UUID_REGEX)) ||
        !semesters.every((semester) => semester.match(UUID_REGEX))) {
        res.status(400).json({status: "bad request"});
        return;
    }

    const client = await getClient();
    // console.log(JSON.stringify(data))
    // const material = await prisma.$transaction(async (prisma) => {
    //
    //     const material = await prisma.material.create({
    //             data: {
    //                 title,
    //                 text,
    //                 files: files.length > 0 ? {
    //                     connect: files.map(file => ({
    //                         id: file
    //                     }))
    //                 } : undefined,
    //                 faculties: faculties.length > 0 ? {
    //                     connect: faculties.map(faculty => ({
    //                         name: faculty
    //                     }))
    //                 } : undefined,
    //                 disciplines: disciplines.length > 0 ? {
    //                     connect: disciplines.map(discipline => ({
    //                         name: discipline
    //                     }))
    //                 } : undefined,
    //                 semesters: semesters.length > 0 ? {
    //                     connect: semesters.map(semester => ({
    //                         name: semester
    //                     }))
    //                 } : undefined,
    //                 tutor: {
    //                     connect: {
    //                         id: tutor
    //                     }
    //                 },
    //                 user: {
    //                     connect: {
    //                         id: session.sub
    //                     }
    //                 }
    //             }
    //         }
    //     );
    //     await prisma.document.create({
    //         data: {
    //             type: "material",
    //             ...getDocument(title + ' ' + text)
    //         }
    //     });
    //
    //     return material;
    // });
    // const document = title + ' ' + text;
    const {rows: [material]} = await client.query(`

        WITH material AS (
            INSERT INTO materials (title, text, tutor_id, user_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *),
             documents AS (INSERT INTO documents (type, data)
                 VALUES ('material', to_tsvector(material.title || ' ' || material.text)))
            ${disciplines.length > 0 ? `,m1 AS (INSERT INTO materials_disciplines (material_id, discipline_id) 
            SELECT material.id, disciplines.id
            FROM material, disciplines
            WHERE disciplines.name IN (${disciplines.map((_, i) => `$${i + 5}`).join(',')}))` : ''}
            ${faculties.length > 0 ? `,m2 AS (INSERT INTO materials_faculties (material_id, faculty_id)
            SELECT material.id, faculties.id
            FROM material, faculties
            WHERE faculties.name IN (${faculties.map((_, i) => `$${i + 5 + disciplines.length}`).join(',')}))` : ''}
            ${semesters.length > 0 ? `,m3 AS (INSERT INTO materials_semesters (material_id, semester_id)
            SELECT material.id, semesters.id
            FROM material, semesters
            WHERE semesters.name IN (${semesters.map((_, i) => `$${i + 5 + disciplines.length + faculties.length}`).join(',')}))` : ''}
            ${files.length > 0 ? `,m4 AS (UPDATE files
            SET material_id = material.id
            FROM material
            WHERE files.id IN (${files.map((_, i) => `$${i + 5 + disciplines.length + faculties.length + semesters.length}`).join(',')}))` : ''}
    `, [title, text, tutor, session.sub, ...disciplines, ...faculties, ...semesters, ...files]);
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
