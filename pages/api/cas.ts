// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import https from 'https'
import * as util from "util";
import {doRequest} from '../../lib/backend/utils';
import {decrypt, hash} from '../../lib/backend/crypto';
import admin from "firebase-admin";
import fs from 'fs';
import {child, Database, DatabaseReference, DataSnapshot, get, getDatabase, ref, set} from "firebase/database";


type Data = {
    res: string | null | undefined
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {ticket}: { [key: string]: string | string[]; } = req.query;
    if (ticket === undefined) {
        res.status(500).json({res: 'There is no ticket'});
        return;
    }
    const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
    const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
    const options: https.RequestOptions = {
        hostname: 'login.mephi.ru',
        port: 443,
        path: `/validate?service=${host}&ticket=${ticket}`,
        method: 'GET',
    };
    const response: string | Error = await doRequest(options);
    if (util.types.isNativeError(response)) {
        res.status(500).json({res: response.message})
        return;
    }
    const resArr: string[] = response.split('\n');
    if (resArr.length != 3) {
        res.status(500).json({res: 'There is an error 1: ' + response});
        return;
    }

    if (resArr[0] === 'yes') {
        const providerUserId: string = await hash(resArr[1]);
        if (admin.credential === undefined) {
            const credentials: string = fs.readFileSync('firebaseCredentialsEncrypted.b64', 'binary')
            admin.initializeApp({
                credential: admin.credential.cert(await decrypt(credentials)),
                databaseURL: "https://daily-mephi-default-rtdb.firebaseio.com"
            });
        }
        // https://github.com/nextauthjs/next-auth/blob/main/src/core/routes/callback.ts
        // const db: Database = getDatabase();
        // const dbRef: DatabaseReference = ref(getDatabase());
        // const snapshot: DataSnapshot = await get(child(dbRef, `users/${userId}`));
        // let id: string;
        // let cookie: string;
        // if (!snapshot.exists()) {
        //     // await set(ref(db, 'users/' + userId), {
        //     //     cookie: cookie,
        //     //     profileName: email,
        //     //     profile_picture: imageUrl
        //     // });
        // }
        // else{
        //
        // }
        // TODO:auth
        // .then((snapshot) => {
        //         if (snapshot.exists()) {
        //             console.log(snapshot.val());
        //         } else {
        //             console.log("No data available");
        //         }
        //     }).catch((error) => {
        //         console.error(error);
        //     });


    } else if (resArr[0] === 'no') {
        res.redirect(301, '/api/auth?error=true');
    } else {
        res.status(500).json({res: 'There is an error 2: ' + response});
    }
}

