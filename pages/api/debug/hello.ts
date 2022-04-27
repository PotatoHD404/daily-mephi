// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Column, declareType, TableDescription, TypedData, typeMetadataKey, Types, Ydb} from "ydb-sdk";

export const SYNTAX_V1 = '--!syntax_v1';

class NormData extends TypedData {
    constructor() {
        super({});
    }

    asTypedRow() {
        const value = this.getRowValue().items.reduce((previousValue: Ydb.IValue, currentValue: Ydb.IValue) => {
            return {...currentValue};
        }, {})
        console.log({...this.getRowType().structType.members[0]});
        return {
            type: {
                listType: {
                    item: {...this.getRowType().structType.members[0]}
                }
            },
            value: {
                items: value
            }
        }
    }
}

function typeToString(type: Ydb.IType) {
    switch (type) {
        case Types.BOOL:
            return "Bool";
        case Types.INT8:
            return "Int8";
        case Types.UINT8:
            return "Uint8";
        case Types.INT16:
            return "Int16";
        case Types.UINT16:
            return "Uint16";
        case Types.INT32:
            return "Int32";
        case Types.UINT32:
            return "Uint32";
        case Types.INT64:
            return "Int64";
        case Types.UINT64:
            return "Uint64";
        case Types.FLOAT:
            return "Float";
        case Types.DOUBLE:
            return "Double";
        case Types.STRING:
            return "String";
        case Types.UTF8:
            return "Utf8";
        case Types.YSON:
            return "Yson";
        case Types.JSON:
            return "Json";
        case Types.UUID:
            return "Uuid";
        case Types.JSON_DOCUMENT:
            return "JsonDocument";
        case Types.DATE:
            return "Date";
        case Types.DATETIME:
            return "Datetime";
        case Types.TIMESTAMP:
            return "Timestamp";
        case Types.INTERVAL:
            return "Interval";
        case Types.TZ_DATE:
            return "TzDate";
        case Types.TZ_DATETIME:
            return "TzDateTime";
        case Types.TZ_TIMESTAMP:
            return "TzTimestamp";
        case Types.DYNUMBER:
            return "DyNumber";
        case Types.VOID:
            return "Void";
        case Types.DEFAULT_DECIMAL:
            return "DefaultDecimal";
    }
}


class TestEntity extends NormData {
    constructor(a: string, b: string) {
        super();
        this.a = a;
        this.b = b;
    }

    @declareType(Types.STRING)
    private a: string;
    @declareType(Types.STRING)

    private b: string;


    // test(){
    //     return this
    // }
}




export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {


    // @ts-ignore
    const testEntity = new TestEntity();
    console.log(Types.STRING.typeId)
    console.log(testEntity.getRowType())
    let realQuery = `
    ${SYNTAX_V1}
    
    DECLARE $seriesData AS `
    if (testEntity.getRowType()['structType'] != undefined) {
        realQuery += "Struct<"
        testEntity.getRowType().structType.members.forEach(
            el => {
                realQuery += `\n    ${el.name}: ${typeToString(el.type)}`
            })

        realQuery += ">;\n"
    }



    const query = `
    ${SYNTAX_V1}
    
    DECLARE $seriesData AS Struct<
    series_id: Uint64,
    title: Utf8,
    series_info: Utf8,
    release_date: Date>;
    
    `
    // console.log(realQuery)

    // console.log(camelToSnakeCase('SasOss'))
    res.status(200).json('ok');
}
