import {FieldDecorator} from "protobufjs";
import {camelToSnakeCase, getColumnName, getPrimaryKey, getTableName, getType} from "../../../helpers/utils";
import {BaseEntity} from "../baseEntity";
import {Column} from "./column.decorators";
import {Entity, TABLE_NAME_TOKEN} from "./entity.decorator";

export const MANY_TO_MANY_TOKEN = Symbol('manyToMany')


export function ManyToMany(type: () => any, tableName?: string): FieldDecorator {
    return function (target: any, key: string | symbol) {
        console.log("ManyToMany")
        target = target.constructor;
        type = type();

        console.log(type)
        console.log(target)
        console.log(tableName)


        if (!tableName)
            tableName = getTableName(target) + "_" + getColumnName(target, key);
        const primaryKey1 = getPrimaryKey(target);
        const primaryKeyType1 = getType(target, primaryKey1);
        const primaryKey2 = getPrimaryKey(type);
        const primaryKeyType2 = getType(type, primaryKey2);

        @Entity(tableName)
        class ManyToManyTable extends BaseEntity {
            @Column(primaryKeyType1, {primary: true, name: getTableName(target) + "_id"})
            private id1: any
            @Column(primaryKeyType2, {
                primary: true,
                name: getTableName(type) + "_id"
            })
            private id2: any
        }

        Reflect.metadata(MANY_TO_MANY_TOKEN, {name: tableName, type})(target, key)
    };
}