import {getColumnName, getPrimaryKey, getType} from "helpers/utils";
import {Index} from "lib/database/decorators/index.decorator";
import {FieldDecorator} from "protobufjs";
import {Column} from "./column.decorators";
import {getMetadataArgsStorage, ObjectType, RelationOptions} from "typeorm";
import {ObjectUtils} from "typeorm/util/ObjectUtils";
import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";

export const ONE_TO_ONE_TOKEN = Symbol('oneToOne')

export function OneToOne<T>(
    typeFunctionOrTarget: ((type?: any) => ObjectType<T>)
): FieldDecorator {
    // normalize parameters

    return function (target: any, key: string) {
        Reflect.metadata(ONE_TO_ONE_TOKEN, typeFunctionOrTarget)(target.constructor, key)
    }
}