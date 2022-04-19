// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Client} from '@notionhq/client'
import {doRequest, setCookie} from "../../lib/backend/utils";
import jwt from 'jsonwebtoken';
import {
    doc,
    getDoc,
    updateDoc,
    getFirestore, DocumentData, Timestamp
} from 'firebase/firestore';
import {getAuthToken, initializeAdmin} from "../../lib/backend/database";
import {getAuth, signInWithCustomToken} from "firebase/auth";
// import app from "../../lib/firebase/initApp";
import {decrypt, encrypt} from "../../lib/backend/crypto";
import {getSession} from "next-auth/react";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const session = await getSession({req});
    if (!session) {
        res.status(401).json(JSON.stringify({res: 'You are not authenticated'}));
        return;
    }

    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    });
    const page = 'd8c2e5c5-4914-452d-963b-d3718defa035';
    let block_id: string = '';
    let i: number;
    for (i = 0; i < 10; ++i) {
        try {
            block_id = (await notion.blocks.children.append({
                block_id: page,
                children: [
                    {
                        object: 'block',
                        type: 'file',
                        file: {external: {url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bb16841c-8a8e-4d32-bb48-903605685cf4/pending'}}
                    }
                ],
            })).results[0].id;
            break;
        } catch (e) {

        }
    }


    if (i === 10) {
        throw new Error('Request timeout');
    }

    const auth = getAuth();

    await initializeAdmin();
    await signInWithCustomToken(auth, await getAuthToken('admin'));

    const db = getFirestore();
    let a: DocumentData;
    const token_res = (await getDoc(doc(db, 'internal', 'notion_token'))).data();
    if (!token_res)
        throw new Error('There is no notion_token!');
    let {expires: expires, value: enc_token} = token_res as { expires: Timestamp, value: string };
    let token_v2: string = '';
    try {
        token_v2 = await decrypt(enc_token, process.env.DATABASE_KEY);
    } catch (e) {

    }
    const d = new Date();
    d.setHours(d.getHours() - 24);
    if (new Date(expires.seconds * 1000) < d || !token_v2) {
        const {cookies} = await doRequest({
                hostname: 'www.notion.so',
                port: 443,
                path: `/api/v3/loginWithEmail`,
                method: 'POST',
            },
            {
                email: process.env.NOTION_EMAIL,
                password: process.env.NOTION_PASSWORD
            });
        if (!cookies['token_v2'])
            throw new Error('There is no token_v2');
        token_v2 = cookies['token_v2'].Value;
        await updateDoc(doc(db, 'internal', 'notion_token'), {
            value: await encrypt(token_v2, process.env.DATABASE_KEY),
            expires: cookies['token_v2'].Expires,
        });
    }

    // const token_v2 = '';
    // https://www.notion.so/api/v3/getUploadFileUrl
    const {response} = await doRequest({
        hostname: 'www.notion.so',
        port: 443,
        path: `/api/v3/getUploadFileUrl`,
        method: 'POST',
        headers: {
            'Cookie': `token_v2=${token_v2}`
        }
    }, {
        bucket: "secure",
        name: "Doc1.pdf",
        contentType: "application/pdf",
        record: {
            table: "block",
            id: block_id,
            spaceId: "0ef770c4-d60f-4f3b-bb1c-35398b2e65b8"
        }
    });

    const links = JSON.parse(response);
    if (!process.env.JWT_PRIVATE)
        throw new Error('Jwt key is undefined');
    let token = jwt.sign({signedPutUrl: links['signedPutUrl'], block: block_id}, process.env.JWT_PRIVATE);
    setCookie(res, {name: 'jwt', value: token, options: {secure: true, sameSite: true, path: '/'}});

    res.status(200).json('ok');
}
