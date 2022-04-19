// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getHost} from "../../lib/backend/utils";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {
    const host = encodeURIComponent(getHost() + "/api/auth/callback/home");
    res.status(200).json(host);
}
