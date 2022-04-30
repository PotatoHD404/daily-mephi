import {getColumnName, getTableName} from "../../../helpers/utils";
import {Entity} from "./entity.decorator";
import {Column} from "./column.decorators";
import {Types} from "ydb-sdk";

export const ONE_TO_MANY_TOKEN = Symbol('oneToMany')


export function OneToMany(type: any, columnKey: string) {
    return function (target: any, key: string) {

        Reflect.metadata(ONE_TO_MANY_TOKEN, {key: columnKey, type})(target, key)
    };
}