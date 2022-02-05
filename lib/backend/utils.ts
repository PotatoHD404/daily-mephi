import https from "https";
import {URL} from "url";
import {ClientRequest} from "http";
import {NextApiResponse} from "next";
import {serialize} from "cookie";
import {Cookie} from "next-auth/core/lib/cookie";
import cookie from 'cookie';

interface Cookies {
    [Key: string]: { Value: string, Domain: string, Path: string, Expires: Date };
}

export function doRequest(options: https.RequestOptions, data?: any): Promise<{
    response: string,
    cookies: Cookies,
    code: number
}> {
    return new Promise((resolve, reject) => {
        if (data)
            data = JSON.stringify(data);
        if (!options.headers)
            options.headers = {}
        options.headers['Content-Length'] = data.length;
        options.headers['Content-Type'] = 'application/json';
        const req: ClientRequest = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody: string = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                const tmp = res.headers["set-cookie"]?.map((el) => cookie.parse(el));
                const cookies: Cookies = {};
                tmp?.forEach((el) => {
                    const first_key = Object.keys(el)[0];
                    const first_value = Object.values(el)[0];
                    delete el[first_key]
                    cookies[first_key] = {
                        Value: first_value,
                        Path: el['Path'],
                        Domain: el['Domain'],
                        Expires: new Date(Date.parse(el['Expires']))
                    };
                });
                // console.log(res.headers["set-cookie"]);
                resolve({response: responseBody, cookies, code: res.statusCode ?? 500});
            });
        });

        req.on('error', (err) => {
            throw err;
        });
        if (data)
            req.write(data);
        req.end();
    });
}

export function checkStatus(options: https.RequestOptions, data?: any): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        if (data)
            data = JSON.stringify(data);
        if (!options.headers)
            options.headers = {}
        options.headers['Content-Length'] = data.length;
        options.headers['Content-Type'] = 'application/json';
        const req: ClientRequest = https.request(options, (res) => {
            resolve(res.statusCode);
        });

        req.on('error', (err) => {
            throw err;
        });
        if (data)
            req.write(data);
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