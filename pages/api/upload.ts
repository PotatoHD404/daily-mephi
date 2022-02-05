// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Client} from '@notionhq/client'
import {getRequest} from "../../lib/backend/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    });
    const page = 'd8c2e5c5-4914-452d-963b-d3718defa035';
    const block_id: string = (await notion.blocks.children.append({
        block_id: page,
        children: [
            {
                object: 'block',
                type: 'file',
                file: {external: {url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bb16841c-8a8e-4d32-bb48-903605685cf4/pending'}}
            }
        ],
    })).results[0].id;
    // TODO: auth


    const token_v2 = '';
    // https://www.notion.so/api/v3/getUploadFileUrl
    const response: string | Error = await getRequest({
        hostname: 'www.notion.so',
        port: 443,
        path: `/api/v3/getUploadFileUrl`,
        method: 'POST',
    });
    // if ()
    // console.log(block_id);

    // const resp = await notion.request({
    //     path: 'getUploadFileUrl',
    //     method: 'post',
    //     auth: process.env.NOTION_TOKEN,
    //     body: {
    //         bucket: "secure",
    //         name: "Doc1.pdf",
    //         contentType: "application/pdf",
    //         record: {
    //             table: "block",
    //             id: "6a699e1b-25b0-40dc-a9ff-fd99e2f33ecc",
    //             spaceId: "0ef770c4-d60f-4f3b-bb1c-35398b2e65b8"
    //         }
    //     }
    // });
    //	application/zip
    // console.log(process.env.NOTION_PASSWORD);
    // console.log(resp);/**/
    res.status(200).json('ok');
}
