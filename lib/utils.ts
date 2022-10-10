import {ClientRequest} from "http";
import https from "https";
import * as fs2 from 'fs'
import {promises as fs} from 'fs'
import path from 'path'
import {createHash} from "crypto";
import NextAuth, {SessionStrategy} from "next-auth";
import {nextAuthOptions} from "./auth/nextAuthOptions";
import {NextApiRequest} from "next";
import {init} from "next-auth/core/init";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import HomeMEPhiOauth from "./auth/mephiOauthConfig";
import prisma from "./database/prisma";
import {defaultCookies} from "next-auth/core/lib/cookie";


export function checkStatus(options: https.RequestOptions, data?: any): Promise<{ code: number | undefined, redirect: string | undefined }> {
    return new Promise((resolve, reject) => {
        if (data) {
            data = JSON.stringify(data);
            if (!options.headers)
                options.headers = {}
            options.headers['Content-Length'] = data.length;
            options.headers['Content-Type'] = 'application/json';
        }
        const req: ClientRequest = https.request(options, (res) => {
            resolve({code: res.statusCode, redirect: res.headers['location']});
        });

        req.on('error', (err) => {
            throw err;
        });
        if (data)
            req.write(data);
        req.end();
    });
}

export async function getCache(id: string, name: string): Promise<any | null | undefined> {
    const data = await fs.readFile(path.join(process.cwd(), `/tmp/${name}.json`));
    const products: any = JSON.parse(data as unknown as string)

    return products.find((el: { id: string; }) => el.id === id)
}

export async function setCache(products: any[], name: string) {
    if (!fs2.existsSync(path.join(process.cwd(), '/tmp/'))) {
        fs2.mkdirSync(path.join(process.cwd(), '/tmp/'));
    }
    return await fs.writeFile(
        path.join(process.cwd(), `/tmp/${name}.json`),
        JSON.stringify(products)
    )
}

export function getHost() {
    // If we detect a Vercel environment, we can trust the host
    // if (process.env.VERCEL) return forwardedHost
    // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
    // return process.env.NEXTAUTH_URL
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}


export const camelToSnakeCase = (str: string) =>
    str.replace(/^[A-Z]/g, letter => letter.toLowerCase())
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// export const nextOptions = (await NextAuth(nextAuthOptions)).options;

export function verifyCSRFToken(req: NextApiRequest) {
    const nextOptions: any = {
        ...defaultCookies(
            req.url?.startsWith("https://") ?? false
        ),
        secret: process.env.NEXTAUTH_SECRET,
    };

    const cookieValue = req.cookies[nextOptions.csrfToken.name];
    const {csrfToken: bodyValue} = req.body;
    if (!cookieValue || !bodyValue) {
        return false;
    }
    const [csrfToken, csrfTokenHash] = cookieValue.split("|")
    const expectedCsrfTokenHash = createHash("sha256")
        .update(`${csrfToken}${nextOptions.secret}`)
        .digest("hex")

    if (csrfTokenHash === expectedCsrfTokenHash) {
        // If hash matches then we trust the CSRF token value
        // If this is a POST request and the CSRF Token in the POST request matches
        // the cookie we have already verified is the one we have set, then the token is verified!
        return csrfToken === bodyValue;
    }
    return false;
}
