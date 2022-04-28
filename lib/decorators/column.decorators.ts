import {declareType, Types, Ydb} from "ydb-sdk";
import IType = Ydb.IType;
import {camelToSnakeCase, getColumnName, getTableName} from "../../helpers/utils";

export const PRIMARY_KEY_TOKEN = Symbol('primary_key')
export const INDEX_TOKEN = Symbol('indexes')
export const COLUMN_NAME_TOKEN = Symbol('columns')


type ColumnArgs = { type?: IType, name?: string, primary?: Boolean };

export function Column({type, name, primary}: ColumnArgs = {}) {
    return function (target: any, key: string) {
        // declareType()(target)
        if (!type) {
            let t = Reflect.getMetadata("design:type", target, key);
            // console.log(`${key} type: ${t.name}`);
            // console.log(t)
            // console.log(t == String)
            // console.log(t.name)
            switch (t) {
                case String:
                    type = Types.STRING;
                    break;
                case Number:
                    type = Types.INT64;
                    break;
                case Boolean:
                    type = Types.BOOL;
                    break;
                case Date:
                    type = Types.DATE;
                    break;
                default:
                    throw new Error("Not implemented");
            }
        }
        Reflect.metadata(COLUMN_NAME_TOKEN, name ?? key)(target, key);
        if (primary) {
            Reflect.metadata(PRIMARY_KEY_TOKEN, true)(target, key);
        }

        return declareType(type)(target, key);
    };
}

export function Index(indexName?: string) {
    return function (target: any, key: string) {
        let indexes: string[] = Reflect.getMetadata(INDEX_TOKEN, target) ?? [];
        if (!indexName)
            indexName = getTableName(target) + "_" + getColumnName(target, key)
        if (!indexes.includes(indexName)) {
            indexes.push(indexName);
        }
        Reflect.defineMetadata(INDEX_TOKEN, indexes, target);
        Reflect.metadata(indexName, true)(target, key)
    };
}
