import {createHandler, Delete, Get, Param, Post} from '@storyofams/next-api-decorators';
import {getSession} from "next-auth/react";
import jwt from "jsonwebtoken";
import "./files.entity"


// import {checkStatus, doRequest, setCookie} from "helpers/utils";
import {Client} from "@notionhq/client";
import {decrypt, encrypt} from "helpers/crypto";
import { Controller } from 'lib/decorators/injection/controller.decorator';

@Controller("/files")
class FilesController {

    // @Get("/:id")
    // public async get(@Param('id') id: string) {
    //     const {cookies} = req;
    //     const session = await getSession({req});
    //     if (!cookies['jwt'] || !session)
    //         res.status(401).json(JSON.stringify({res: 'You are not authenticated'}));
    //     if (!process.env.JWT_PRIVATE)
    //         throw new Error('Jwt key is undefined');
    //     const data = jwt.verify(cookies['jwt'], process.env.JWT_PRIVATE);
    //     if (typeof data === "string") {
    //         // data
    //         throw new Error('Type of data is string')
    //     }
    //     const {signedPutUrl, block} = data as { signedPutUrl: string, block: string };
    //     const url: string = signedPutUrl.split('?')[0];
    //     // console.log(`https://www.notion.so/signed/${encodeURIComponent(url)}?table=block&cache=v2&id=${block}`)
    //     const {code, redirect} = await checkStatus({
    //         hostname: 'www.notion.so',
    //         port: 443,
    //         path: `/signed/${encodeURIComponent(url)}?table=block&cache=v2&id=${block}`,
    //         method: 'GET',
    //     });
    //
    //     if (code !== 302 || !redirect) {
    //         res.status(500).json('Something went wrong');
    //         return;
    //     }
    //     // console.log(redirect);
    //
    //     const fileUrl = new URL(redirect);
    //     const {code: actual_code} = await checkStatus({
    //         hostname: fileUrl.hostname,
    //         port: 443,
    //         path: `${fileUrl.pathname}?${redirect.split('?')[1]}`,
    //         method: 'GET',
    //         headers: {
    //             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    //             'Connection': 'keep-alive',
    //             'Host': 's3.us-west-2.amazonaws.com',
    //             'Accept-Encoding': 'gzip, deflate, br',
    //             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    //         }
    //     });
    //     if (actual_code !== 200) {
    //         res.status(500).json('Something went wrong #2');
    //         return;
    //     }
    //
    //
    //     res.status(200).json('ok');
    // }
    //
    // @Post("/")
    // public async add(@Param('id') id: string) {
    //     const session = await getSession({req});
    //     if (!session) {
    //         res.status(401).json(JSON.stringify({res: 'You are not authenticated'}));
    //         return;
    //     }
    //
    //     const notion = new Client({
    //         auth: process.env.NOTION_TOKEN,
    //     });
    //     const page = 'd8c2e5c5-4914-452d-963b-d3718defa035';
    //     let block_id: string = '';
    //     let i: number;
    //     for (i = 0; i < 10; ++i) {
    //         try {
    //             block_id = (await notion.blocks.children.append({
    //                 block_id: page,
    //                 children: [
    //                     {
    //                         object: 'block',
    //                         type: 'file',
    //                         file: {external: {url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bb16841c-8a8e-4d32-bb48-903605685cf4/pending'}}
    //                     }
    //                 ],
    //             })).results[0].id;
    //             break;
    //         } catch (e) {
    //
    //         }
    //     }
    //
    //
    //     if (i === 10) {
    //         throw new Error('Request timeout');
    //     }
    //
    //     const auth = getAuth();
    //
    //     await initializeAdmin();
    //     await signInWithCustomToken(auth, await getAuthToken('admin'));
    //
    //     const db = getFirestore();
    //     let a: DocumentData;
    //     const token_res = (await getDoc(doc(db, 'internal', 'notion_token'))).data();
    //     if (!token_res)
    //         throw new Error('There is no notion_token!');
    //     let {expires: expires, value: enc_token} = token_res as { expires: Timestamp, value: string };
    //     let token_v2: string = '';
    //     try {
    //         token_v2 = await decrypt(enc_token, process.env.DATABASE_KEY);
    //     } catch (e) {
    //
    //     }
    //     const d = new Date();
    //     d.setHours(d.getHours() - 24);
    //     if (new Date(expires.seconds * 1000) < d || !token_v2) {
    //         const {cookies} = await doRequest({
    //                 hostname: 'www.notion.so',
    //                 port: 443,
    //                 path: `/api/v3/loginWithEmail`,
    //                 method: 'POST',
    //             },
    //             {
    //                 email: process.env.NOTION_EMAIL,
    //                 password: process.env.NOTION_PASSWORD
    //             });
    //         if (!cookies['token_v2'])
    //             throw new Error('There is no token_v2');
    //         token_v2 = cookies['token_v2'].Value;
    //         await updateDoc(doc(db, 'internal', 'notion_token'), {
    //             value: await encrypt(token_v2, process.env.DATABASE_KEY),
    //             expires: cookies['token_v2'].Expires,
    //         });
    //     }
    //
    //     // const token_v2 = '';
    //     // https://www.notion.so/api/v3/getUploadFileUrl
    //     const {response} = await doRequest({
    //         hostname: 'www.notion.so',
    //         port: 443,
    //         path: `/api/v3/getUploadFileUrl`,
    //         method: 'POST',
    //         headers: {
    //             'Cookie': `token_v2=${token_v2}`
    //         }
    //     }, {
    //         bucket: "secure",
    //         name: "Doc1.pdf",
    //         contentType: "application/pdf",
    //         record: {
    //             table: "block",
    //             id: block_id,
    //             spaceId: "0ef770c4-d60f-4f3b-bb1c-35398b2e65b8"
    //         }
    //     });
    //
    //     const links = JSON.parse(response);
    //     if (!process.env.JWT_PRIVATE)
    //         throw new Error('Jwt key is undefined');
    //     let token = jwt.sign({signedPutUrl: links['signedPutUrl'], block: block_id}, process.env.JWT_PRIVATE);
    //     setCookie(res, {name: 'jwt', value: token, options: {secure: true, sameSite: true, path: '/'}});
    //
    //     res.status(200).json('ok');
    // }

    @Delete("/:id")
    public async delete(@Param('id') id: string) {

    }
}