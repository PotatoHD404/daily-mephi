import {FieldDecorator} from "protobufjs";

export const ONE_TO_MANY_TOKEN = Symbol('oneToMany')


export function OneToMany(type: any, columnKey: string): FieldDecorator {
    return function (target: any, key: string | symbol) {
        // TODO get rid of the type
        Reflect.metadata(ONE_TO_MANY_TOKEN, {key: columnKey, type})(target, key)
    };
}