import https from "https";
import {URL} from "url";
import {ClientRequest} from "http";
import {Cookie} from "next-auth/core/lib/cookie";
import {NextApiResponse} from "next";
import {serialize} from "cookie";

export function doRequest(options: string | https.RequestOptions | URL): Promise<string | Error> {
    return new Promise((resolve, reject) => {
        const req: ClientRequest = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody: string = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(responseBody);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        // req.write(data)
        req.end();
    });
}

export function setCookie(res: NextApiResponse, cookie: Cookie) {
    // Preserve any existing cookies that have already been set in the same session
    let setCookieHeader = res.getHeader("Set-Cookie") ?? [];
    // If not an array (i.e. a string with a single cookie) convert it into an array
    // if(!setCookieHeader)
    //     throw new Error("");
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [setCookieHeader.toString()];
    }
    const {name, value, options} = cookie;
    const cookieHeader = serialize(name, value, options);
    setCookieHeader.push(cookieHeader);
    res.setHeader("Set-Cookie", setCookieHeader);
}

export function redirect(res: NextApiResponse, url: string, cookies?: Cookie[]) {
    if (cookies)
        cookies.forEach((cookie) => setCookie(res, cookie));
    res.status(301).redirect(url);
}


export function detectHost(forwardedHost: any) {
    // If we detect a Vercel environment, we can trust the host
    if (process.env.VERCEL) return forwardedHost
    // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
    return process.env.NEXTAUTH_URL
}