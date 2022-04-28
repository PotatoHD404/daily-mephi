import "reflect-metadata"
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {container, injectable, injectAll as InjectAll} from "tsyringe";
import {getCallerInfo} from "@storyofams/next-api-decorators/dist/internals/getCallerInfo";
import {notFound} from "@storyofams/next-api-decorators/dist/internals/notFound";
import {parseRequestUrl} from "@storyofams/next-api-decorators/dist/internals/parseRequestUrl";
import {getParams} from "@storyofams/next-api-decorators/dist/internals/getParams";
import {Key, pathToRegexp} from "path-to-regexp";
import {HandlerMethod, HTTP_METHOD_TOKEN} from "@storyofams/next-api-decorators/dist/decorators";
import {BASE_PATH_TOKEN} from "lib/decorators/controller.decorator";
import { Module } from "lib/decorators/module.decorator";

export {
    container,
    injectable,
    InjectAll,
    Module,
    getCallerInfo,
    notFound,
    parseRequestUrl,
    getParams,
    pathToRegexp,
    HTTP_METHOD_TOKEN,
    BASE_PATH_TOKEN
};
export type {
    NextApiHandler,
    NextApiRequest,
    NextApiResponse,
    Key,
    HandlerMethod
};
