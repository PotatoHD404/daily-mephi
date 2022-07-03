import {Catch, UseMiddleware} from "@storyofams/next-api-decorators";
import {Cors} from "lib/auth/middlewares/cors.middleware";
import {RateLimit} from "lib/auth/middlewares/rateLimit.middleware";
import {NextApiRequest, NextApiResponse} from "next";
import {autoInjectable, container, singleton} from "tsyringe";

export const BASE_PATH_TOKEN = Symbol('ams:next:basePath');
export const CONTROLLERS_TOKEN = Symbol('controllers');

function errorHandler(e: Error, req: NextApiRequest, res: NextApiResponse) {
    if (process.env.NODE_ENV === "development") {
        throw e;
    }
    res.status(500).send("An error has occurred");
}


export function Controller(prefix?: string, ...middlewares: any[]) {
    const defaultPath: string = prefix ?? "/";

    return (target: new (...args: any[]) => any) => {
        Catch(errorHandler)(target);
        UseMiddleware(Cors, RateLimit, ...middlewares)(target);
        target = autoInjectable()(target);
        Reflect.defineMetadata(BASE_PATH_TOKEN, defaultPath, target);
        singleton()(target);
        container.register(CONTROLLERS_TOKEN, {useValue: target});
        return target;
    };
}