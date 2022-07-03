import {Ydb} from "ydb-sdk";


export function typedUtf8(value: string) {
    return Ydb.TypedValue.create({
        type: {typeId: Ydb.Type.PrimitiveTypeId.UTF8},
        value: {textValue: value}
    });
}
