import {PrismaClient} from '@prisma/client';
import {renderAndSend} from "lib/thumbnails/utils/renderAndSend";
import {NextApiResponse} from "next";
import QuoteThumbnail from "components/thumbnails/quote";

const prisma = new PrismaClient();

// ... (Include other necessary imports and utility functions like getFontData, renderAndSend)

export default async function handler(quoteId: string, res: NextApiResponse) {


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