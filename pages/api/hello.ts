// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {hash} from '../../lib/utils';
import {encrypt, decrypt} from '../../lib/crypto';
import fs from 'fs';

type Data = {
    res: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    //
    const file: string = fs.readFileSync("daily-mephi-firebase-adminsdk-owy0l-8196187005.json", 'utf8');
    // console.log(file.length);
    const enc = await encrypt(file)
    fs.writeFileSync("firebaseCredentialsEncrypted.b64", enc, 'binary');
    const read = fs.readFileSync("firebaseCredentialsEncrypted.b64", 'binary');

    // report duration
    res.status(200).json({res: await decrypt(read)})
}
