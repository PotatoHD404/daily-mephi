import {getColumnName, getPrimaryKey, getType} from "helpers/utils";
import {Index} from "lib/database/decorators/index.decorator";
import {FieldDecorator} from "protobufjs";
import {Column} from "./column.decorators";

export const ONE_TO_ONE_TOKEN = Symbol('oneToOne')

export function OneToOne(type: () => any): FieldDecorator {
    return function (target: any, key: string) {
        // console.log("OneToOne")
        // type = type();
        // console.log(type)
        // console.log(target.constructor)
        Reflect.metadata(ONE_TO_ONE_TOKEN, type)(target.constructor, key)
        // const name = getColumnName(target.constructor, key) + "_id";
        // const primaryKey = getPrimaryKey(type);
        // const primaryKeyType = getType(type, primaryKey);
        // Column(primaryKeyType, {name})(target, key)
        // Index()(target, name);
    };
}