// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {declareType, TypedData, Types, Ydb} from "ydb-sdk";
import {typeToString} from "helpers/utils";

export const SYNTAX_V1 = '--!syntax_v1';


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
            (el: { name: any; type: Ydb.IType; }) => {
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
