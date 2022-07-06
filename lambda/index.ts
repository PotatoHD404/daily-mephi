import next from 'next'
import {parse} from 'url'
import serverlessExpress from "@vendia/serverless-express";
import {IncomingMessage, ServerResponse} from 'http';

const app = next({dev: false});
const requestHandler = app.getRequestHandler();

exports.handler = async function handler(event: any, context: any, callback: any) {
    // try {
    //   const result = await es.proxy(server, event, context, "PROMISE").promise;
    //   return result;
    // } catch (e) {
    //   // TODO: better way to handle errors
    //   console.error(e);
    //   callback(null, {});
    //   // callback(null, {await failure({ status: false }, e)});
    // }

    console.log({event, context, callback});

    // type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
    const app = async (req: IncomingMessage, res: ServerResponse) => {
        // console.log({ req, res });

        // @ts-ignore
        const parsedUrl = parse(req.url, true, false);

        // console.log(result);

        return await requestHandler(req, res, parsedUrl);
    };

    await serverlessExpress({ app })(event, context, callback);
};