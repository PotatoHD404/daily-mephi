import {declareType, Ydb} from "ydb-sdk";
import {FieldDecorator} from "protobufjs";
import IType = Ydb.IType;

export const PRIMARY_KEY_TOKEN = Symbol('primary_key')
export const COLUMN_NAME_TOKEN = Symbol('columns')


type ColumnArgs = { name?: string, primary?: Boolean };

export function Column(type: IType, {name, primary}: ColumnArgs = {}): FieldDecorator {
    return function (target: any, key: string) {
        // declareType()(target)
        // console.log(name ?? key)
        Reflect.metadata(COLUMN_NAME_TOKEN, name ?? key)(target, key);
        if (primary) {
            Reflect.metadata(PRIMARY_KEY_TOKEN, name ?? key)(target, key);
        }

        declareType(type)(target, key);
    };
}
