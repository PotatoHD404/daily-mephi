import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/renderAndSend";
import {NextApiRequest, NextApiResponse} from "next";
import QuoteThumbnail from "components/thumbnails/quote";
import {UUID_REGEX} from "../../../../../lib/constants/uuidRegex";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    let {id: quoteId} = req.query;

    // Input validation (optional, you can use zod if you prefer)
    if (typeof quoteId !== 'string') {
        res.status(400).end('Invalid input');
        return;
    }

    // remove .png at the end if it exists
    if (quoteId.endsWith('.png')) {
        quoteId = quoteId.slice(0, -4);
    }

    // check if is uuid
    if (!quoteId.match(UUID_REGEX)) {
        res.status(400).end('Invalid input');
        return;
    }


    try {
        const quote = await prisma.quote.findUnique({
            where: {
                id: quoteId
            },
            select: {
                id: true,
                text: true,
                updatedAt: true,
                likesCount: true,
                dislikesCount: true,
                tutor: {
                    select: {
                        shortName: true
                    }
                }
            }
        })
        if (!quote) {
            res.status(404).end('Material not found');
            return;
        }

        const element = QuoteThumbnail({
            name: quote.tutor.shortName,
            text: quote.text
        })
        await renderAndSend(element, res);
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
}