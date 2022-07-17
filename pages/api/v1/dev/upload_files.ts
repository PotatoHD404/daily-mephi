// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getSession} from "next-auth/react";
import {getToken} from "next-auth/jwt";
import jwt from "jsonwebtoken";
import {readFile} from "fs/promises";
import * as fs from "fs";


async function uploadFile(upload_filename: string, fileMap: { [p: string]: string }, path: string) {
    let session_token = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..TTimqbEJ3vebNVFo.sSr_QlLT2MrlhwXfXqqaUa4BPJG3ip5N8WWTYKCTNd-0jCXT5xRMEn18v_etRvuQ-noMZ6cKRTKs1X5BILu0BJxb0GPXPP8b5n1oqoF91QWfoc9lHCIXeHh0DIeiPndhDoZON_pK35fofBPtSyAnx5zVEs4h6HiMrz6JpcBwzv4pTnguxqCpbpgnuUKHtL33aqgYRxe2LU-t2OBNsFDkQa39IvP8FD7hXKoZ.QeMrhDXr7lIGcQFwbs612w"
    const res1 = await fetch(`http://localhost:3000/api/v1/files`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `next-auth.session-token=${session_token}`
        },
        body: JSON.stringify({
            "filename": upload_filename
        })
    });
    const jwt_token = (await res1.json())["token"];
    const {
        signedPutUrl,
    } = jwt.decode(jwt_token) as { signedPutUrl: string };

    // Read file and upload it
    const file = await readFile(path);
    const res2 = await fetch(signedPutUrl, {
        method: "PUT",
        body: file
    });

    if (res2.status !== 200) {
        throw new Error(`Error uploading file: ${res2.status}, filename: ${upload_filename}`);
    }

    const res3 = await fetch('http://localhost:3000/api/v1/files', {
        method: "PUT",
        headers: {
            "Cookie": `next-auth.session-token=${session_token};FILE_JWT=${jwt_token}`
        },
    })

    if (res3.status !== 200) {
        throw new Error(`Error uploading file: ${res3.status}, filename: ${upload_filename}`);
    }
    const json = await res3.json()
    console.log(json)
    fileMap[upload_filename] = (json)["id"];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (process.env.LOCAL !== "true") {
        res.status(403).json({status: "not allowed"});
        return;
    }
    let fileMap: { [id: string]: string } = {};
    let upload_filename: string = "19679.jpg"
    const files = fs.readdirSync('parsing/home/tutor_imgs');
    await Promise.all(files.map(async (filename) => {
        await uploadFile(filename, fileMap, `parsing/home/tutor_imgs/${filename}`)
    }));
    // await uploadFile(upload_filename, fileMap, `parsing/home/tutor_imgs/${upload_filename}`);

    res.status(200).json({status: "ok", fileMap});
}
