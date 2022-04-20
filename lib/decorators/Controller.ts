export const BASE_PATH_TOKEN = Symbol('ams:next:basePath');

export function Controller(prefix?: string) {
    const defaultPath : string = prefix ?? '/';

    return (target: object) => {
        Reflect.defineMetadata(BASE_PATH_TOKEN, defaultPath, target);
    };
}