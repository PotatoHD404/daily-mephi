import {getColumnName} from "helpers/utils";
import {Index} from "lib/database/decorators/index.decorator";
import {FieldDecorator} from "protobufjs";
import {Types} from "ydb-sdk";
import {Column} from "./column.decorators";

export const ONE_TO_ONE_TOKEN = Symbol('oneToOne')

export function OneToOne(type: any): FieldDecorator {
    return function (target: any, key: string) {
        // console.log(type, target.constructor, key)
        Reflect.metadata(ONE_TO_ONE_TOKEN, type)(target.constructor, key)
        const name = getColumnName(target.constructor, key) + "_id";
        Column(Types.UINT64, {name})(target, key)
        Index()(target, name)
        // TODO remove hardcoded type
    };
}