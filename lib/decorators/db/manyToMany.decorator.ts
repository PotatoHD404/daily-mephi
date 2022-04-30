import {camelToSnakeCase, getColumnName, getTableName} from "../../../helpers/utils";
import {Entity, TABLE_NAME_TOKEN} from "./entity.decorator";
import {Column} from "./column.decorators";
import {Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";

export const MANY_TO_MANY_TOKEN = Symbol('manyToMany')


export function ManyToMany(type: any, tableName?: string) {
    return function (target: any, key: string) {
        if (!tableName)
            tableName = getColumnName(target, key) + "_" + getTableName(target);

        @Entity(tableName)
        class ManyToManyTable extends BaseEntity {
            @Column(Types.UINT64, {primary: true, name: getTableName(target) + "_id"})
            private id1: any
            @Column(Types.UINT64, {primary: true, name: camelToSnakeCase(Reflect.getMetadata(TABLE_NAME_TOKEN, type) ?? type.name) + "_id"})
            private id2: any
        }

        Reflect.metadata(MANY_TO_MANY_TOKEN, {name: tableName, type})(target, key)
    };
}