// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
// import {hash} from '../../lib/utils';
// import {encrypt, decrypt} from '../../lib/crypto';
// import {Octokit} from 'octokit';
// import fs from 'fs';
import {getAuth, signInWithCustomToken} from "firebase/auth";
import {initializeApp, getApps} from 'firebase/app';
import {getDatabase} from "firebase/database";
import {initializeDatabase, getAuthToken} from '../../lib/backend/database';
import database_client from '../../lib/frontend/database'
import NextAuth from "next-auth"

// const octokit: Octokit = new Octokit();



// type Data = {
//     res: string
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    await initializeDatabase();

    const firestore = getApps()[0].firestore()
    // TODO: Replace with your app's Firebase project configuration


    const auth = getAuth();
    const userCredential = await signInWithCustomToken(auth, await getAuthToken('123'));
    const uid = userCredential.user;


    // const username: string = 'PotatoHD';
    // const {
    //     data: {login, avatar_url},
    // } = await octokit.rest.users.getByUsername({username});
    // //
    // const file: string = fs.readFileSync("daily-mephi-firebase-adminsdk-owy0l-8196187005.json", 'utf8');
    // // console.log(file.length);
    // const enc = await encrypt(file)
    // fs.writeFileSync("firebaseCredentialsEncrypted.b64", enc, 'binary');

    // report duration
    // @ts-ignore
    res.status(200).json(uid);
}
