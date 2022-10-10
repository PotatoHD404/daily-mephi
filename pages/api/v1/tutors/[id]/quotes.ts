// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import { getDocument } from 'lib/database/fullTextSearch';


async function getQuotes(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const quotes = await prisma.quote.findMany({
        where: {tutorId: id},
        select: {
            id: true,
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
            dislikes: true
        },
        take: 10,
        orderBy: {createdAt: 'desc'}
    });

    res.status(200).json(quotes);
}


async function addQuote(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(UUID_REGEX)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {text} = req.body;
    if (!text || typeof text !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    try {

        const quote = await prisma.$transaction(async (prisma) => {
            const quote = await prisma.quote.create({
            data: {
                text,
                user: {
                    connect: {id: session.sub}
                },
                tutor: {
                    connect: {id}
                }
            },
        });
        await prisma.tutor.update({
            where: {id},
            data: {
                quotesCount: {
                    increment: 1
                }
            }
        });
        await prisma.user.update({
            where: {id: session.sub},
            data: {
                quotesCount: {
                    increment: 1
                }
            }
        });
        await prisma.document.create({
            data: {
                type: "quote",
                ...getDocument(text)
            }
        });
        return quote;
    });
        res.status(200).json({status: 'ok', id: quote.id});
    } catch (e) {
        res.status(500).json({status: 'error'});
    }

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {

    if (req.method === "GET") {
        await getQuotes(req, res);
    } else if (req.method === "POST") {
        await addQuote(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }


}
