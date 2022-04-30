import {getColumnName, getTableName} from "../../../helpers/utils";
export const INDEX_TOKEN = Symbol('indexes')

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