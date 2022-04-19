// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from "next-auth/react";
import jwt from "jsonwebtoken";
import {error} from "next/dist/build/output/log";
import {checkStatus, doRequest} from "../../../lib/backend/utils";

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
    if (typeof data === "string") {
        // data
        throw new Error('Type of data is string')
    }
    const {signedPutUrl, block} = data as { signedPutUrl: string, block: string };
    const url: string = signedPutUrl.split('?')[0];
    // console.log(`https://www.notion.so/signed/${encodeURIComponent(url)}?table=block&cache=v2&id=${block}`)
    const {code, redirect} = await checkStatus({
        hostname: 'www.notion.so',
        port: 443,
        path: `/signed/${encodeURIComponent(url)}?table=block&cache=v2&id=${block}`,
        method: 'GET',
    });

    if (code !== 302 || !redirect) {
        res.status(500).json('Something went wrong');
        return;
    }
    // console.log(redirect);

    const fileUrl = new URL(redirect);
    const {code: actual_code} = await checkStatus({
        hostname: fileUrl.hostname,
        port: 443,
        path: `${fileUrl.pathname}?${redirect.split('?')[1]}`,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
            'Connection': 'keep-alive',
            'Host': 's3.us-west-2.amazonaws.com',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        }
    });
    if (actual_code !== 200) {
        res.status(500).json('Something went wrong #2');
        return;
    }


    res.status(200).json('ok');
}
