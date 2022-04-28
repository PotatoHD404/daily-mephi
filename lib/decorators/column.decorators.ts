import {declareType, Types, Ydb} from "ydb-sdk";
import IType = Ydb.IType;

export const PRIMARY_KEY_TOKEN = Symbol('primary_key')
export const INDEX_TOKEN = Symbol('index')

export function Column(type?: IType) {
    return function (target: any, key: string) {
        // declareType()(target)
        if(!type) {
            let t = Reflect.getMetadata("design:type", target, key);
            // console.log(`${key} type: ${t.name}`);
            // console.log(t)
            // console.log(t == String)
            // console.log(t.name)
            switch (t) {
                case String:
                    type = Types.STRING;
                    break;
                case Number:
                    type = Types.INT64;
                    break;
                case Boolean:
                    type = Types.BOOL;
                    break;
                case Date:
                    type = Types.DATE;
                    break;
                default:
                    throw new Error("Not implemented");
            }
        }
        return declareType(type)(target);
    };
}

export function Primary() {
    return Reflect.metadata(PRIMARY_KEY_TOKEN, true);
}

// export function Index() {
//     return Reflect.metadata(INDEX_TOKEN, true);
// }
