import {container, singleton} from "tsyringe";

export const BASE_PATH_TOKEN = Symbol('ams:next:basePath');

export function Controller(prefix?: string) {
    const defaultPath: string = prefix ?? "/";

    return (target: new (...args: any[]) => any) => {
        Reflect.defineMetadata(BASE_PATH_TOKEN, defaultPath, target);
        singleton()(target);
        container.register("controllers", {useValue: target});
    };
}