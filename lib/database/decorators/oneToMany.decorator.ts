import {getColumnName, getEntityProperty, getPrimaryKey} from "helpers/utils";
import {PRIMARY_KEY_TOKEN} from "lib/database/decorators/column.decorators";
import {Index} from "lib/database/decorators/index.decorator";
import {FieldDecorator} from "protobufjs";

export const ONE_TO_MANY_TOKEN = Symbol('oneToMany')


export function OneToMany(type: () => any, columnKey?: string): FieldDecorator {
    return function (target: any, key: string | symbol) {
        // console.log("OneToMany")
        // type = type();
        //
        // console.log(type)
        // console.log(target.constructor)
        // if (!columnKey)
        //     columnKey = getPrimaryKey(type);
        // Reflect.metadata(ONE_TO_MANY_TOKEN, {key: columnKey, type})(target.constructor, key)
        // Index()(type, columnKey);
    };
}