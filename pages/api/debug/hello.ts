// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Column, declareType, TableDescription, TypedData, typeMetadataKey, Types, Ydb} from "ydb-sdk";
import {typeToString} from "../../../helpers/utils";

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
