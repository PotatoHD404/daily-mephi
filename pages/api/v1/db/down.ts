// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import pg from "lib/database/pg";
import fs from "fs/promises";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }
    const client = await pg;
    const down = await fs.readFile("lib/database/migrations/1.down.sql", "utf-8");

    const result = await client.query(down);
    // const access_token: string = await hash("kmv026");
    // res.status(200).json({name: access_token})
    // 123
    res.status(200).json({rows: result.rows})

}
