// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
// import {hash} from '../../lib/utils';
// import {encrypt, decrypt} from '../../lib/crypto';
// import {Octokit} from 'octokit';
// import fs from 'fs';
import {getAuth, signInWithCustomToken} from "firebase/auth";
import {initializeApp, getApps, getApp} from 'firebase/app';
import {randomBytes} from "crypto";
import app from "../../lib/frontend/database";
import {getAuthToken, initializeDatabase} from "../../lib/backend/database";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import fs from "fs";
import {encrypt} from "../../lib/backend/crypto";


// const octokit: Octokit = new Octokit();



// type Data = {
//     res: string
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {

    // const uid = userCredential.user;

    // const auth = getAuth(app);
    //
    // await initializeDatabase();
    // await signInWithCustomToken(auth, await getAuthToken('admin'));
    //
    // const db = getFirestore();
    //
    // const token_res = (await getDoc(doc(db, 'test', 'yyrwg42xMT3WoPFS0fBx'))).data();


    // const username: string = 'PotatoHD';
    // const {
    //     data: {login, avatar_url},
    // } = await octokit.rest.users.getByUsername({username});
    // //
    // const file: string = fs.readFileSync("daily-mephi-fdcd9-firebase-adminsdk-bz905-bd0979e9d8.json", 'utf8');
    // console.log(file.length);
    // const enc = await encrypt(file);
    // fs.writeFileSync("firebaseCredentialsEncrypted.b64", enc, 'binary');
    // let token_res = '';
    // report duration
    // @ts-ignore
    res.status(200).json('ok');
}
