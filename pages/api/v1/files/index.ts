// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Client} from '@notionhq/client'
import jwt from 'jsonwebtoken';

// import app from "../../lib/firebase/initApp";
import {decrypt, encrypt} from "helpers/crypto";
import {getSession} from "next-auth/react";
import {Runtime} from "inspector";
import prisma from "lib/database/prisma";
import {Cookie} from "tough-cookie"
import {checkStatus} from "../../../../helpers/utils";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const extToMimes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/x-gzip',
    'mp3': 'audio/mpeg',
    'wav': 'audio/x-wav',
    'ogg': 'audio/ogg',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'json': 'application/json',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'c': 'text/plain',
    'cpp': 'text/plain',
    'h': 'text/plain',
    'hpp': 'text/plain',
    'js': 'application/javascript',
    'ts': 'application/typescript',
    'tsx': 'application/typescript',
    'css': 'text/css',
    'html': 'text/html',
    'yml': 'text/yaml',
    'yaml': 'text/yaml',
    'md': 'text/markdown',
    'sh': 'text/plain',
    'bat': 'text/plain',
    'ini': 'text/plain',
    'toml': 'text/plain',
    'xml': 'text/xml',
    'svg': 'image/svg+xml',
    'cs': 'text/plain',
    'go': 'text/plain',
    'java': 'text/plain',
}

async function newFile(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    if (process.env.NOTION_PRIVATE_PAGE === undefined) {
        res.status(500).json({status: 'NOTION_PRIVATE_PAGE not set'});
        return;
    }

    if(!req.body.filename) {
        res.status(400).json({status: "Filename not provided"});
        return;
    }

    let [filename, ext] = req.body.filename.split('.');
    if(filename === '') {
        filename = ext;
        ext = '';
    }
    const mime = extToMimes[ext as keyof typeof extToMimes] || 'text/plain';
    const page = process.env.NOTION_PRIVATE_PAGE;

    let block_id: string = '';
    let i: number;
    for (i = 0; i < 3; ++i) {
        try {
            block_id = (await notion.blocks.children.append({
                block_id: page,
                children: [
                    {
                        object: 'block',
                        type: 'file',
                        file: {external: {url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d8c2e5c5-4914-452d-963b-d3718defa035/pending'}}
                    }
                ],
            })).results[0].id;
            break;
        } catch (e) {

        }
    }

    if (i === 3) {
        res.status(500).json({status: 'Something went wrong'});
        return;
    }
    const db_token_data = await prisma.internal.findUnique({where: {name: 'notion_token_v2'}});

    let expires: Date | null = null;
    let token_v2: string | null = null

    if (db_token_data) {
        let {value: enc_token} = db_token_data;
        expires = db_token_data.expires
        try {
            token_v2 = await decrypt(enc_token, process.env.DATABASE_KEY);
        } catch (e) {
        }
    }
    const d = new Date();
    d.setHours(d.getHours() - 24);
    let res1: Response
    if (!expires || expires < d || !token_v2) {
        token_v2 = null
        let expires: Date | null = null;
        res1 = await fetch("https://www.notion.so/api/v3/loginWithEmail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: process.env.NOTION_EMAIL,
                    password: process.env.NOTION_PASSWORD
                })
            },
        );
        console.log(res1)
        for (const [key, value] of res1.headers) {
            if (key === 'set-cookie') {
                console.log(value, key)
                const cookie = Cookie.parse(value);
                if (cookie && cookie.key === 'token_v2') {
                    token_v2 = cookie.value;
                    expires = cookie.expires === "Infinity" ? null : cookie.expires;
                    break;
                }
            }
        }
        if (!token_v2)
            throw new Error('There is no token_v2');
        if (!expires)
            throw new Error('There is no expires');
        await prisma.internal.upsert({
            where: {name: 'notion_token_v2'},
            create: {
                name: 'notion_token_v2',
                value: await encrypt(token_v2, process.env.DATABASE_KEY),
                expires: expires
            },
            update: {
                value: await encrypt(token_v2, process.env.DATABASE_KEY),
                expires: expires
            }
        });
    }

    // const token_v2 = '';
    // https://www.notion.so/api/v3/getUploadFileUrl
    res1 = await fetch("https://www.notion.so/api/v3/getUploadFileUrl", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token_v2=${token_v2}`
        },
        body: JSON.stringify({
            bucket: "secure",
            name: req.body.filename,
            contentType: mime,
            record: {
                table: "block",
                id: block_id,
                spaceId: "0ef770c4-d60f-4f3b-bb1c-35398b2e65b8"
            }

        })
    });

    const links = await res1.json();
    if (!process.env.JWT_PRIVATE)
        throw new Error('Jwt key is undefined');
    let token = jwt.sign({signedPutUrl: links['signedPutUrl'], block: block_id}, process.env.JWT_PRIVATE);

    // Set cookie
    res.setHeader('set-cookie', `FILE_JWT=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`);

    res.status(200).json({status: 'ok', token: token});
}

async function putFile(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const {cookies} = req;
    const session = await getSession({req});
    if (!cookies['FILE_JWT'] || !session) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    if (!process.env.JWT_PRIVATE)
        throw new Error('Jwt key is undefined');
    const data = jwt.verify(cookies['FILE_JWT'], process.env.JWT_PRIVATE);

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
        res.status(500).json({status: 'Something went wrong'});
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
        res.status(500).json({status: 'Something went wrong #2'});
        return;
    }


    res.status(200).json({status: 'ok', url: fileUrl});
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    const session = await getSession({req});
    if (!session) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    if (req.method === "POST") {
        await newFile(req, res);
    } else if (req.method === "PUT") {
        await putFile(req, res);
    } else {
        res.status(405).json({status: 'Method not allowed'});
    }
}
