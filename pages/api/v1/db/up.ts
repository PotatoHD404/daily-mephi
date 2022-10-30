// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getClient} from "lib/database/pg";
import fs from "fs/promises";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }

    const client = await getClient();
    const up = await fs.readFile("lib/database/migrations/1.up.sql", "utf-8");

    const result = await client.query(up);
    // const access_token: string = await hash("kmv026");
    // res.status(200).json({name: access_token})
    // 123
    res.status(200).json({status: "ok"})

}
