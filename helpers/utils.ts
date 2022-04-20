import https from "https";
import {ClientRequest} from "http";
import {serialize} from "cookie";
import {Cookie} from "next-auth/core/lib/cookie";
import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {getCallerInfo} from '@storyofams/next-api-decorators/dist/internals/getCallerInfo';
import {getParams} from '@storyofams/next-api-decorators/dist/internals/getParams';
import {notFound} from '@storyofams/next-api-decorators/dist/internals/notFound';
import {parseRequestUrl} from '@storyofams/next-api-decorators/dist/internals/parseRequestUrl';
import {BASE_PATH_TOKEN} from "lib/decorators/Controller";
import {HandlerMethod, HTTP_METHOD_TOKEN} from "@storyofams/next-api-decorators/dist/decorators";
import {Key} from "path-to-regexp";
import {loadPackage} from "@storyofams/next-api-decorators/dist/internals/loadPackage";

interface Cookies {
    [Key: string]: { Value: string, Domain: string, Path: string, Expires: Date };
}

// export function getHost(req: NextApiRequest) {
//     const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
//     const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
// }

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

export function setCookie(res: NextApiResponse, cookie: Cookie) {
    // Preserve any existing cookies that have already been set in the same session
    let setCookieHeader = res.getHeader("Set-Cookies") ?? [];
    // If not an array (i.e. a string with a single cookie) convert it into an array
    // if(!setCookieHeader)
    //     throw new Error("");
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [setCookieHeader.toString()];
    }
    const {name, value, options} = cookie;
    const cookieHeader = serialize(name, value, options);
    setCookieHeader.push(cookieHeader);
    res.setHeader("Set-Cookies", setCookieHeader);
}

export function redirect(res: NextApiResponse, url: string, cookies?: Cookie[]) {
    if (cookies)
        cookies.forEach((cookie) => setCookie(res, cookie));
    res.status(301).redirect(url);
}


export function getHost() {
    // If we detect a Vercel environment, we can trust the host
    // if (process.env.VERCEL) return forwardedHost
    // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
    // return process.env.NEXTAUTH_URL
    return process.env.VERCEL_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export function createHandlers(...classes: (new (...args: any[]) => any)[]): NextApiHandler {
    const instances = classes.map(cls => new cls());
    const [directory, fileName] = getCallerInfo();

    return (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url || !req.method) {
            return notFound(req, res);
        }

        const path = parseRequestUrl(req, directory, fileName);
        for (let i = 0; i < instances.length; ++i) {
            const [keys, match, method] = findRoute(classes[i], req.method, path);

            if (!method)
                continue;

            const methodFn = instances[i][method.propertyKey];
            if (!methodFn)
                continue;

            // @ts-ignore
            req.params = getParams(keys, match);

            return methodFn.call(instances, req, res);
        }
        return notFound(req, res);


    };
}

export function findRoute(
    cls: Record<string, any>,
    verb: string,
    path: string
): [Key[], RegExpExecArray | null | undefined, HandlerMethod | undefined] {
    const methods: Array<HandlerMethod> = Reflect.getMetadata(HTTP_METHOD_TOKEN, cls);
    const basePath: string = Reflect.getMetadata(BASE_PATH_TOKEN, cls);

    const {pathToRegexp} = loadPackage('path-to-regexp');
    if (!pathToRegexp) {
        const method = methods.find(f => basePath + f.path === path && f.verb === verb);
        return [[], undefined, method ?? methods.find(f => (basePath + f.path) === '/' && f.verb === verb)];
    }

    const keys: Key[] = [];
    let match: RegExpExecArray | null | undefined;
    const method = methods.find(f => {
        match = pathToRegexp(basePath + f.path, keys).exec(path);

        const condition = f.verb === verb && match?.length;

        if (!condition) {
            keys.length = 0;
            match = undefined;
        }

        return condition;
    });

    return [keys, match, method];
}