import {Index} from "lib/database/decorators/index.decorator";
import {FieldDecorator} from "protobufjs";

export const ONE_TO_MANY_TOKEN = Symbol('oneToMany')


export function OneToMany(type: any, columnKey: string): FieldDecorator {
    return function (target: any, key: string | symbol) {
        // TODO get rid of the type
        target = target.constructor;
        Reflect.metadata(ONE_TO_MANY_TOKEN, {key: columnKey, type})(target, key)
        Index()(type, columnKey);
    };
}