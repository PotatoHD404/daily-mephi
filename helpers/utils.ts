import {serialize} from "cookie";
import {ClientRequest} from "http";
import https from "https";
import {COLUMN_NAME_TOKEN, COLUMNS_TOKEN, PRIMARY_KEY_TOKEN} from "lib/database/decorators/column.decorators";
import {TABLE_NAME_TOKEN} from "lib/database/decorators/entity.decorator";
import {INDEX_TOKEN} from "lib/database/decorators/index.decorator";
import {Constructor} from "lib/database/types";
import {DateTime} from 'luxon';
import type {NextApiResponse} from 'next';
import {Cookie} from "next-auth/core/lib/cookie";
import {primitiveTypeToValue, TypedData, typeMetadataKey, Ydb} from "ydb-sdk";
import {google} from "ydb-sdk-proto";
import {fromDecimalString} from "ydb-sdk/build/decimal";
import {uuidToValue} from "ydb-sdk/build/uuid";
import NullValue = google.protobuf.NullValue;
import IStructMember = Ydb.IStructMember;
import IType = Ydb.IType;
import ITypedValue = Ydb.ITypedValue;
import IValue = Ydb.IValue;
import PrimitiveTypeId = Ydb.Type.PrimitiveTypeId;


interface Cookies {
    [Key: string]: { Value: string, Domain: string, Path: string, Expires: Date };
}

// export function getHost(req: NextApiRequest) {
//     const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
//     const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
// }

export function checkStatus(options: https.RequestOptions, data?: any): Promise<{ code: number | undefined, redirect: string | undefined }> {
    return new Promise((resolve, reject) => {
        if (data) {
            data = JSON.stringify(data);
            if (!options.headers)
                options.headers = {}
            options.headers['Content-Length'] = data.length;
            options.headers['Content-Type'] = 'application/json';
        }
        const req: ClientRequest = https.request(options, (res) => {
            resolve({code: res.statusCode, redirect: res.headers['location']});
        });

        req.on('error', (err) => {
            throw err;
        });
        if (data)
            req.write(data);
        req.end();
    });
}

export function setCookie(res: NextApiResponse, cookie: Cookie) {
    // Preserve any existing cookies that have already been set in the same session
    let setCookieHeader = res.getHeader("Set-Cookies") ?? [];
    // If not an array (i.e. a string with a single cookie) convert it into an array
    // if(!setCookieHeader)
    //     throw new Error("");
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [setCookieHeader.toString()];
    }
    const {name, value, options} = cookie;
    const cookieHeader = serialize(name, value, options);
    setCookieHeader.push(cookieHeader);
    res.setHeader("Set-Cookies", setCookieHeader);
}

export function redirect(res: NextApiResponse, url: string, cookies?: Cookie[]) {
    if (cookies)
        cookies.forEach((cookie) => setCookie(res, cookie));
    res.status(301).redirect(url);
}


export function getHost() {
    // If we detect a Vercel environment, we can trust the host
    // if (process.env.VERCEL) return forwardedHost
    // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
    // return process.env.NEXTAUTH_URL
    return process.env.VERCEL_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}


export const camelToSnakeCase = (str: string) =>
    str.replace(/^[A-Z]/g, letter => letter.toLowerCase())
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);


export function typeToString(type: Ydb.IType | undefined | null): string {
    return type ? Ydb.Type.PrimitiveTypeId[type.typeId ?? 0] : "";
}

export function getEntityProperty(entity: any, property: string | symbol): string[] {
    return (Reflect.getMetadata(COLUMNS_TOKEN, entity) ?? []).filter((key: string | symbol) => {
        return typeof key === 'string' && Reflect.hasMetadata(property, entity, key);
    }) as any;
}

export function sameMembers(arr1: any[], arr2: any[]): Boolean {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return arr1.every(item => set2.has(item)) &&
        arr2.every(item => set1.has(item))
}

export function getTableName(entity: any) {
    return camelToSnakeCase(Reflect.getMetadata(TABLE_NAME_TOKEN, entity) ?? entity.name);
}

export function getColumnName(entity: any, key: string | symbol) {
    return camelToSnakeCase(Reflect.getMetadata(COLUMN_NAME_TOKEN, entity, key) ?? key);
}

export function getIndex(entity: any, key: string) {
    return camelToSnakeCase(Reflect.getMetadata(INDEX_TOKEN, entity, key) ?? key);
}


export function getTypedProperties<T extends TypedData>(entity: Constructor<T> | Function): string[] {
    return (Reflect.getMetadata(COLUMNS_TOKEN, entity) ?? []).filter((key: string | symbol) => (
        typeof key === 'string' && Reflect.hasMetadata(typeMetadataKey, entity, key)
    )) as string[];
}

export function getDeclaration(entity: any, list: boolean = true): string {
    const type = getRowType(entity);
    let declaration = `DECLARE $${getTableName(entity)} AS `
    if (type.structType != undefined) {
        if (list)
            declaration += "List<"
        declaration += "Struct<";
        declaration += getRowType(entity).structType.members.map(
            (el: { name: any; type: Ydb.IType; }) => {
                return `\n${el.name}: ${typeToString(el.type)}`
            }).join(",");
        if (list)
            declaration += ">"
        declaration += ">;\n"
    }
    // else if(type)
    return declaration;
}

export function getType<T extends TypedData>(entity: Constructor<T> | Function, propertyKey: string): IType {
    const typeMeta = Reflect.getMetadata(typeMetadataKey, entity, propertyKey);
    if (!typeMeta) {
        throw new Error(`Property ${propertyKey} should be decorated with @Column!`);
    }
    return typeMeta;
}

export function getRowType<T extends TypedData>(entity: Constructor<T> | Function) {
    // const converter = getNameConverter(entity.p.__options, 'jsToYdb');
    return {
        structType: {
            members: getTypedProperties(entity).map((propertyKey) => ({
                name: getColumnName(entity, propertyKey),
                type: getType(entity, propertyKey)
            }))
        }
    };
}

export function getPrimaryKey<T extends TypedData>(entity: Constructor<T> | Function) {
    return getEntityProperty(entity, PRIMARY_KEY_TOKEN)[0];
}

function preparePrimitiveValue(typeId: PrimitiveTypeId, value: any) {
    switch (typeId) {
        case PrimitiveTypeId.DATE:
            return Number(value) / 3600 / 1000 / 24;
        case PrimitiveTypeId.DATETIME:
            return Number(value) / 1000;
        case PrimitiveTypeId.TIMESTAMP:
            return Number(value) * 1000;
        case PrimitiveTypeId.TZ_DATE:
            return DateTime.fromJSDate(value as Date).toISODate() + ',GMT';
        case PrimitiveTypeId.TZ_DATETIME:
            return DateTime.fromJSDate(value as Date, {zone: 'UTC'}).toFormat(`yyyy-MM-dd'T'HH:mm:ss',GMT'`);
        case PrimitiveTypeId.TZ_TIMESTAMP:
            return (value as Date).toISOString().replace('Z', '') + ',GMT';
        default:
            return value;
    }
}

export function getTypedValue(type: IType | null | undefined, value: any): ITypedValue {
    return {
        type,
        value: typeToValue(type, value)
    };
}

export function typeToValue(type: IType | null | undefined, value: any): IValue {
    if (!type) {
        if (value) {
            throw new Error(`Got no type while the value is ${value}`);
        } else {
            throw new Error('Both type and value are empty');
        }
    } else if (type.typeId) {
        if (type.typeId === PrimitiveTypeId.UUID) {
            return uuidToValue(value);
        }
        const valueLabel = primitiveTypeToValue[type.typeId];
        if (valueLabel) {
            return {[valueLabel]: preparePrimitiveValue(type.typeId, value)};
        } else {
            throw new Error(`Unknown PrimitiveTypeId: ${type.typeId}`);
        }
    } else if (type.decimalType) {
        const decimalValue = value as string;
        const scale = type.decimalType.scale as number;
        return fromDecimalString(decimalValue, scale);
    } else if (type.optionalType) {
        const innerType = type.optionalType.item;
        if (value !== undefined && value !== null) {
            return typeToValue(innerType, value);
        } else {
            return {
                nullFlagValue: NullValue.NULL_VALUE
            };
        }
    } else if (type.listType) {
        const listType = type.listType;
        return {
            items: value.map((item: any) => typeToValue(listType.item, item))
        };
    } else if (type.tupleType) {
        const elements = type.tupleType.elements as IType[];
        return {
            items: value.map((item: any, index: number) => typeToValue(elements[index], item))
        };
    } else if (type.structType) {
        const members = type.structType.members as IStructMember[];
        return {
            items: members.map((member) => {
                const memberType = member.type as IType;
                const memberValue = value[member.name as string];
                return typeToValue(memberType, memberValue);
            }),
        };
    } else if (type.dictType) {
        const keyType = type.dictType.key as IType;
        const payloadType = type.dictType.payload as IType;
        return {
            // @ts-ignore
            pairs: value.entries.map(([key, value]) => ({
                key: typeToValue(keyType, key),
                payload: typeToValue(payloadType, value)
            }))
        }
    } else if (type.variantType) {
        let variantIndex = -1;
        if (type.variantType.tupleItems) {
            const elements = type.variantType.tupleItems.elements as IType[];
            return {
                items: value.map((item: any, index: number) => {
                    if (item) {
                        variantIndex = index;
                        return typeToValue(elements[index], item);
                    }
                    return {nullFlagValue: NullValue.NULL_VALUE};
                }),
                variantIndex
            }
        } else if (type.variantType.structItems) {
            const members = type.variantType.structItems.members as IStructMember[];
            return {
                items: value.map((item: any, index: number) => {
                    if (item) {
                        variantIndex = index;
                        const type = members[index].type;
                        return typeToValue(type, item);
                    }
                    return {nullFlagValue: NullValue.NULL_VALUE};
                }),
                variantIndex
            }
        }
        throw new Error('Either tupleItems or structItems should be present in VariantType!');
    } else if (type.voidType === NullValue.NULL_VALUE) {
        return {
            nullFlagValue: NullValue.NULL_VALUE,
        };
    } else {
        throw new Error(`Unknown type ${JSON.stringify(type)}`);
    }
}