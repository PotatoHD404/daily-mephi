// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getHost} from "../../../lib/backend/utils";
import {getDb} from "../../../lib/backend/database/db"

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {
    const db = getDb();
    await db.connect()
    res.status(200).json('host');
}
