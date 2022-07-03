import {container} from "tsyringe";

export const ENTITY_TOKEN = "ams:next:entity"
export const TABLE_NAME_TOKEN = "table_name";

export function Entity(table?: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(TABLE_NAME_TOKEN, table ?? target.name, target);
        // console.log(Reflect.getMetadata(TABLE_NAME_TOKEN, target))

        // Reflect.defineMetadata(ENTITY_TOKEN, defaultPath, target);
        container.register(ENTITY_TOKEN, {useValue: target});
        container.register(target, {useValue: target});
        return target;
    };
}