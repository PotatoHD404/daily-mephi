import {FieldDecorator} from "protobufjs";
import {Types} from "ydb-sdk";
import {camelToSnakeCase, getColumnName, getTableName} from "../../../helpers/utils";
import {BaseEntity} from "../baseEntity";
import {Column} from "./column.decorators";
import {Entity, TABLE_NAME_TOKEN} from "./entity.decorator";

export const MANY_TO_MANY_TOKEN = Symbol('manyToMany')


export function ManyToMany(type: any, tableName?: string): FieldDecorator {
    return function (target: any, key: string | symbol) {
        target = target.constructor;
        if (!tableName)
            tableName = getColumnName(target, key) + "_" + getTableName(target);

        // TODO remove hardcoded type
        @Entity(tableName)
        class ManyToManyTable extends BaseEntity {
            @Column(Types.UINT64, {primary: true, name: getTableName(target) + "_id"})
            private id1: any
            @Column(Types.UINT64, {
                primary: true,
                name: camelToSnakeCase(Reflect.getMetadata(TABLE_NAME_TOKEN, type) ?? type.name) + "_id"
            })
            private id2: any
        }

        Reflect.metadata(MANY_TO_MANY_TOKEN, {name: tableName, type})(target, key)
    };
}