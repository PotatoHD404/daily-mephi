// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from "next-auth/react";
import jwt from "jsonwebtoken";
import {error} from "next/dist/build/output/log";
import {checkStatus, doRequest} from "../../lib/backend/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const {cookies} = req;
    const session = await getSession({req});
    if (!cookies['jwt'] || !session)
        res.status(401).json(JSON.stringify({res: 'You are not authenticated'}));
    if (!process.env.JWT_PRIVATE)
        throw new Error('Jwt key is undefined');
    const data = jwt.verify(cookies['jwt'], process.env.JWT_PRIVATE);
    if (typeof data !== "string") {
        throw new Error('Type of data is not string')
    }
    const {signedPutUrl, block}: { signedPutUrl: string, block: string } = JSON.parse(data);
    const url: string = signedPutUrl.split('?')[0];


    const code = await checkStatus({
            hostname: 'www.notion.so',
            port: 443,
            path: `/signed/${encodeURIComponent(url)}`,
            method: 'GET',
        });
    if (code !== 200) {
        res.status(500).json('Something went wrong');
        return;
    }


    res.status(200).json('ok');
}
