import {container, injectable} from "tsyringe";
import {TypedData} from "ydb-sdk";

export const ENTITY_TOKEN = "ams:next:entity"

export function Entity() {
    return (target: new (...args: any[]) => any) => {
        // Reflect.defineMetadata(ENTITY_TOKEN, defaultPath, target);
        container.register(ENTITY_TOKEN, {useValue: target});
        container.register(target, {useValue: target});
        return target;
    };
}