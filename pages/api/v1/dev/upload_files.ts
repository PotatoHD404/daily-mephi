// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getSession} from "next-auth/react";
import {getToken} from "next-auth/jwt";
import jwt from "jsonwebtoken";
import {readFile} from "fs/promises";
import * as fs from "fs";
import {extToMimes} from "../files";
import axios, {AxiosResponse} from "axios";

export function timeout(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadFile(upload_filename: string, fileMap: { [p: string]: string }, path: string) {
    let session_token = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..TTimqbEJ3vebNVFo.sSr_QlLT2MrlhwXfXqqaUa4BPJG3ip5N8WWTYKCTNd-0jCXT5xRMEn18v_etRvuQ-noMZ6cKRTKs1X5BILu0BJxb0GPXPP8b5n1oqoF91QWfoc9lHCIXeHh0DIeiPndhDoZON_pK35fofBPtSyAnx5zVEs4h6HiMrz6JpcBwzv4pTnguxqCpbpgnuUKHtL33aqgYRxe2LU-t2OBNsFDkQa39IvP8FD7hXKoZ.QeMrhDXr7lIGcQFwbs612w"
    console.log(upload_filename, path)
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
    if (!res1.ok) {
        throw new Error("Something went wrong during uploading file");
    }
    const jwt_token = (await res1.json())["token"];
    const {
        signedPutUrl,
        ext
    } = jwt.decode(jwt_token) as { signedPutUrl: string, ext: string };
    console.log(signedPutUrl)
    console.log(path)
    // Read file and upload it
    const file = await readFile(path);

    // const timeout = 2* 60 * 1000;
    // const controller = new AbortController();
    // let id = setTimeout(() => controller.abort(), timeout);
    // const res2 = await fetch(signedPutUrl, {
    //     method: "PUT",
    //     body: file,
    //     signal: controller.signal,
    //     headers: {
    //         'Content-Length': file.byteLength.toString(),
    //         // @ts-ignore
    //         'Content-Type': extToMimes[ext.toLowerCase()],
    //     }
    // });
    // clearTimeout(id);

    // if (res2.status !== 200) {
    //     throw new Error(`Error uploading file: ${res2.status}, filename: ${upload_filename}`);
    // }
    let res2: AxiosResponse | null = null;
    while (res2 === null) {
        const config = {
            headers: {
                'Content-Length': file.byteLength.toString(),
                // @ts-ignore
                'Content-Type': extToMimes[ext.toLowerCase()] || "application/octet-stream",
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            // calculate timeout based on file size if size > 10MB
            timeout: file.byteLength > 15 * 1024 * 1024 ? Math.ceil(15 + (file.byteLength / 1024 / 1024 - 15) / 2) * 1000 : 15 * 1000
        }
        try {
            res2 = await axios.put(signedPutUrl, file, config);
        } catch (e) {
            console.log("Retrying...", config, e);

            await timeout(200);
        }
    }


    if (res2.status !== 200) {
        throw new Error(`Error uploading file: ${res2.status}, filename: ${upload_filename}`);
    }

    const res3 = await fetch('http://localhost:3000/api/v1/files', {
        method: "PUT",
        headers: {
            "Cookie": `next-auth.session-token=${session_token}; FILE_JWT=${jwt_token}`
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
    // let upload_filename: string = "19679.jpg"
    // const files = fs.readdirSync('parsing/home/tutor_imgs');
    // const promises = files.map((filename) => () => uploadFile(filename, fileMap, `parsing/home/tutor_imgs/${filename}`));

    const folders = fs.readdirSync('parsing/mephist/materials/files');
    let promises: (() => Promise<void>)[] = [];
    folders.forEach((folder) => {
        fs.readdirSync(`parsing/mephist/materials/files/${folder}`).forEach((filename) => {
            promises.push(() => uploadFile(`${folder}-${filename}`, fileMap, `parsing/mephist/materials/files/${folder}/${filename}`))
        })
    });

    promises = promises.slice(10+1000+800);
    // const promises: (() => Promise<void>)[] = [];
    let time: number = 0;
    while (promises.length) {
        // 1 at a time
        let completed = false;
        time = (new Date()).getTime();
        const promise = promises.shift();
        while (!completed) {
            try {
                // @ts-ignore
                await promise();
                break;
            } catch (e) {
                console.log(e)
            }
        }
        time = (new Date()).getTime() - time;
        console.log(`Uploaded ${1} file in ${time} ms`)
    }
    console.log()
    // await uploadFile(upload_filename, fileMap, `parsing/home/tutor_imgs/${upload_filename}`);

    res.status(200).json({fileMap});
}
