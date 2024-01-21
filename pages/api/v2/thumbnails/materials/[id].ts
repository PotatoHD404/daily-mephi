import MaterialThumbnail from 'components/thumbnails/material';
import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/renderAndSend";
import {NextApiRequest, NextApiResponse} from "next";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";
import {UUID_REGEX} from "../../../../../lib/constants/uuidRegex";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let {id: materialId} = req.query;

    // Input validation (optional, you can use zod if you prefer)
    if (typeof materialId !== 'string') {
        res.status(400).end('Invalid input');
        return;
    }

    // remove .png at the end if it exists
    if (materialId.endsWith('.png')) {
        materialId = materialId.slice(0, -4);
    }

    // check if is uuid
    if (!materialId.match(UUID_REGEX)) {
        res.status(400).end('Invalid input');
        return;
    }

    try {
        const material = await prisma.material.findUnique({
            where: {
                id: materialId
            },
            select: {
                id: true,
                title: true,
                text: true,
                tutor: {
                    select: {
                        shortName: true
                    }
                },
                user: {
                    select: {
                        nickname: true,
                        image: {
                            select: {
                                url: true,
                            }
                        },
                    }
                },
                faculties: {
                    select: {
                        name: true
                    }
                },
                disciplines: {
                    select: {
                        name: true
                    }
                },
                likesCount: true,
                dislikesCount: true,
                commentsCount: true,
            }
        });
        if (!material) {
            res.status(404).end('Material not found');
            return;
        }

        const url = normalizeUrl(material.user?.image?.url, "/images/dead_cat.svg", true);
        const image_data = await imageToBase64(url);
        const element = MaterialThumbnail({
            image_url: image_data,
            name: material.user?.nickname ?? "",
            tags: material.disciplines.map((discipline) => discipline.name).concat(material.faculties.map((faculty) => faculty.name)),
            text: material.text ?? "",
            title: material.title,
        })
        await renderAndSend(element, res);
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
}