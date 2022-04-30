import {getColumnName} from "../../../helpers/utils";
import {Column} from "./column.decorators";
import {Types} from "ydb-sdk";

export const ONE_TO_ONE_TOKEN = Symbol('oneToOne')

export function OneToOne(type: any) {
    return function (target: any, key: string) {

        Reflect.metadata(ONE_TO_ONE_TOKEN, type)(target, key)
        Column(Types.UINT64, {name: getColumnName(target, key) + "_id"})(target, key)
    };
}