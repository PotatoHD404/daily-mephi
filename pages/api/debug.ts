// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {

    res.status(200).json({ok: 'ok'});
}
