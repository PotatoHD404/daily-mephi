import {ClientRequest} from "http";
import https from "https";
import {Cookie} from "tough-cookie"
import {useCallback, useEffect, useState} from "react";

interface Cookies {
    [Key: string]: Cookie;
}

export function addPrefixes (prefixes: string[], className: string) {
    return className.split(' ').map((name) => {
        return prefixes.map((prefix) => {
            return prefix + name;
        }).join(' ');
    }).join(' ');
}


// export function getHost(req: NextApiRequest) {
//     const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
//     const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
// }
export function doRequest(options: https.RequestOptions, data?: any): Promise<{
    response: string,
    cookies: Cookies,
    code: number
}> {
    return new Promise((resolve, reject) => {
        if (data) {
            data = JSON.stringify(data);
            if (!options.headers)
                options.headers = {}
            options.headers['Content-Length'] = data.length;
            options.headers['Content-Type'] = 'application/json';
        }
        const req: ClientRequest = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody: string = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            // for (const [key, value] of res1.headers) {
            //     if (key === 'set-cookie') {
            //         console.log(value, key)
            //         const cookie = Cookie.parse(value);
            //         if (cookie && cookie.key === 'token_v2') {
            //             token_v2 = cookie.value;
            //             expires = cookie.expires === "Infinity" ? null : cookie.expires;
            //             break;
            //         }
            //     }
            // }
            res.on('end', () => {
                const tmp: Cookie[] = res.headers["set-cookie"]?.map((el) => Cookie.parse(el)).filter(el => el !== undefined) as unknown as Cookie[];
                const cookies: Cookies = {};
                tmp?.reduce((acc, el) => {
                    acc[el.key] = el;
                    return acc;
                }, cookies);
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

export const useMediaQuery = (width: any) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: { matches: any; }) => {
        // console.log(e.matches)
            setTargetReached(e.matches);
    }, []);

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${width}px)`);
        media.addEventListener("change", updateTarget)

        // Check on mount (callback is not called until a change occurs)
        if (media.matches) {
            setTargetReached(true);
        }
        //
        // return () => media.removeEventListener("change", updateTarget);
    }, []);

    return targetReached;
};


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
