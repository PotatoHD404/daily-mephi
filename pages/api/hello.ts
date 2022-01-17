// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {hash} from '../../lib/utils';

type Data = {
    res: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let duration: number = 0;
    for (let a: number = 0; a < 1; a++) {
        const start: number = Date.now();
        const pass: string = await hash(a.toString());
        duration += Date.now() - start;

        console.log(pass);

    }
    // report duration
    res.status(200).json({res: duration.toString()})
}
