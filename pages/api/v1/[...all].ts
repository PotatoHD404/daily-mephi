import {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // return deprecated response
    res.status(410).json({
        message: 'This endpoint is deprecated. Please use /api/v2 instead.',
    })
}
