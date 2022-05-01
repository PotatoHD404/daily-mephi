import {FieldDecorator} from "protobufjs";
import {declareType, Ydb} from "ydb-sdk";
import IType = Ydb.IType;

export const PRIMARY_KEY_TOKEN = Symbol('primary_key')
export const COLUMN_NAME_TOKEN = Symbol('column')
export const COLUMNS_TOKEN = Symbol('columns')


type ColumnArgs = { name?: string, primary?: Boolean };

export function Column(type: IType, {name, primary}: ColumnArgs = {}): FieldDecorator {
    return function (target: any, key: string) {
        target = target.constructor;
        // declareType()(target)
        // console.log(name ?? key)
        let cols: string[] = Reflect.getMetadata(COLUMNS_TOKEN, target) ?? [];
        cols.push(key);
        Reflect.defineMetadata(COLUMNS_TOKEN, cols, target);

        Reflect.metadata(COLUMN_NAME_TOKEN, name ?? key)(target, key);
        if (primary) {
            Reflect.metadata(PRIMARY_KEY_TOKEN, name ?? key)(target, key);
        }

        declareType(type)(target, key);
    };
}
