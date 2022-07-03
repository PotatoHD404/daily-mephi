import { Backend } from 'backend1/main'
import { NextApiRequest, NextApiResponse } from 'next'

const catchAll = (req: NextApiRequest, res: NextApiResponse) =>
    new Promise(async resolve => {
        const listener = await Backend.getListener()

        listener(req, res)
        res.on('finish', resolve)
    })

export default catchAll