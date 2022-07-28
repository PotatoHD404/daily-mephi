// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getSession} from "next-auth/react";
import {getToken} from "next-auth/jwt";


async function getQuotes(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const quotes = await prisma.quote.findMany({
        where: {tutorId: id},
        select: {
            id: true,
            body: true,
            uploaded: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            likes: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                }
            },
            dislikes: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                }
            },
        },
        take: 10,
        orderBy: {uploaded: 'desc'}
    });

    res.status(200).json(quotes);
}


async function addQuote(req: NextApiRequest, res: NextApiResponse<object>) {
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    const {body} = req.body;
    if (!body || typeof body !== "string") {
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    try {
        const quote = await prisma.quote.create({
            data: {
                body,
                user: {
                    connect: {id: session.sub}
                },
                tutor: {
                    connect: {id}
                }
            },
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
