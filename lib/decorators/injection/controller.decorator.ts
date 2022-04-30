import {autoInjectable, container, singleton} from "tsyringe";
import {Catch} from "@storyofams/next-api-decorators";
import {NextApiRequest, NextApiResponse} from "next";

export const BASE_PATH_TOKEN = Symbol('ams:next:basePath');
export const CONTROLLERS_TOKEN = Symbol('controllers');

function errorHandler(e: Error, req: NextApiRequest, res: NextApiResponse) {
    if (process.env.NODE_ENV === "development") {
        throw e;
    }
    res.status(500).send("An error has occurred");
}


export function Controller(prefix?: string) {
    const defaultPath: string = prefix ?? "/";

    return (target: new (...args: any[]) => any) => {
        Catch(errorHandler)(target);
        target = autoInjectable()(target);
        Reflect.defineMetadata(BASE_PATH_TOKEN, defaultPath, target);
        singleton()(target);

        container.register(CONTROLLERS_TOKEN, {useValue: target});
        return target;
    };
}