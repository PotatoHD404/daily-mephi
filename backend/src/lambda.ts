import {Handler, Context} from 'aws-lambda';
// import {Server} from 'http';
// import {createServer, proxy} from 'aws-serverless-express';
import {eventContext} from 'aws-serverless-express/middleware';
import {FastifyServerOptions, FastifyInstance, fastify} from 'fastify';
import * as awsLambdaFastify from 'aws-lambda-fastify';

import {NestFactory} from '@nestjs/core';
// import {ExpressAdapter} from '@nestjs/platform-express';
import {AppModule} from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {Logger} from "@nestjs/common";

interface NestApp {
    app: NestFastifyApplication;
    instance: FastifyInstance;
}

// import * as express from 'express';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedNestApp: NestApp;

async function bootstrapServer(): Promise<NestApp> {
    const serverOptions: FastifyServerOptions = {logger: true};
    const instance: FastifyInstance = fastify(serverOptions);
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(instance), {logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console}
    );
    app.setGlobalPrefix(process.env.API_PREFIX);
    await app.init();
    return {app, instance};
}

export const handler: Handler = async (event: any, context: Context) => {
    if (!cachedNestApp) {
        cachedNestApp = await bootstrapServer();
    }
    const proxy = awsLambdaFastify(cachedNestApp.instance);
    // return proxy(cachedServer, event, context, 'PROMISE').promise;
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: 'Hello world!',
    }
}

// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import serverlessExpress from '@vendia/serverless-express';
// import { Context, Handler } from 'aws-lambda';
// import * as express from 'express';
//
// import { AppModule } from './app.module';
//
// let cachedServer: Handler;
//
// async function bootstrap() {
//     if (!cachedServer) {
//         const expressApp = express();
//         const nestApp = await NestFactory.create(
//             AppModule,
//             new ExpressAdapter(expressApp),
//         );
//
//         // nestApp.enableCors();
//
//         await nestApp.init();
//
//         cachedServer = serverlessExpress({ app: expressApp });
//     }
//
//     return cachedServer;
// }
//
// export const handler = async (event: any, context: Context, callback: any) => {
//     const server = await bootstrap();
//     return server(event, context, callback);
// };