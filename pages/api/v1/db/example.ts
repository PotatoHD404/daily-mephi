// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import pg from "lib/database/pg";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const client = await pg;
    const result = await client.query('SELECT $1::text as message', ['Hello world!'])
    // const access_token: string = await hash("kmv026");
    // res.status(200).json({name: access_token})
    // 123
    res.status(200).json({rows: result.rows})

}
