import {appRouter} from "server";
import {createContext} from "server/utils/context";
import {NextApiRequest, NextApiResponse} from "next";
import {createNextApiHandler} from "@trpc/server/adapters/next";
// import {redis} from "lib/database/redis";
export const config = {
    api: {
        responseLimit: process.env.NODE_ENV === 'production',
    }
};

const nextApiHandler = createNextApiHandler({
    router: appRouter,
    createContext,
    onError({error}: any) {
        if (error.code === 'INTERNAL_SERVER_ERROR' && error.cause?.code === 'ERR_HTTP_HEADERS_SENT') {
            // Ignore this error, it's not really an error
            return;
        }
        if (error.code === 'INTERNAL_SERVER_ERROR') {
            // send to bug reporting
            console.error('Something went wrong', error);
        }
    },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // Modify `req` and `res` objects here
    // In this case, we are enabling CORS
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Request-Method', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    // res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    // rate limiting with redis
    // use user ip and user agent as key
    // @ts-ignore
    // let key: string = `${req.headers['x-forwarded-for']}_${req.headers['user-agent']}`;
    // key = key.replace(/\./g, '_');
    // key = `rate_limit_${key}`;
    // const current = await redis.get(key);
    // // limit is 60 requests per minute
    // if (current && parseInt(current) > 60) {
    //     return res.status(429).send('Too many requests, please try again later.');
    // }
    // await redis.incr(key);
    // await redis.expire(key, 60);

    // pass the (modified) req/res to the handler
    try {
        await nextApiHandler(req, res);
    } catch (e: any) {
        if (e?.code === 'ERR_HTTP_HEADERS_SENT') {
            // Ignore this error, it's not really an error
            return;
        }
        throw e
    }
}
