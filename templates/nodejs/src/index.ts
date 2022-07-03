import {FunctionContext, FunctionEvent} from './types';
import express from 'express';
import {Server} from "http";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "../../../backend1/app/app.module";
import {ExpressAdapter} from '@nestjs/platform-express';
import {eventContext} from 'aws-serverless-express/middleware';
import {createServer} from "aws-serverless-express";


const binaryMimeTypes: string[] = [];


let cachedServer: Server;

export const hello = async (event: FunctionEvent, context: FunctionContext) => {
    const expressApp = express();
    // const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp),)
    // nestApp.use(eventContext());
    // await nestApp.init();
    // cachedServer = createServer(expressApp, undefined, binaryMimeTypes);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: 'Hello world!1',
    }
};
