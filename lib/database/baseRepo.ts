import {createEntities, createNativeObjects, getDeclaration, getTableName, typeToString} from "helpers/utils";
import {BaseEntity} from "lib/database/baseEntity";
import {TARGET_ENTITY_TOKEN} from "lib/database/decorators/repository.decorator";
import {Constructor} from "lib/database/types";
import {autoInjectable} from "tsyringe";
import {TypedData, withRetries} from "ydb-sdk";
import {Ydb} from "ydb-sdk-proto";
import {DB} from "./db";
import {FindAllParams, IRepo} from "./interfaces/repo.interface";
import ITypedValue = Ydb.ITypedValue;

export const SYNTAX_V1 = '--!syntax_v1';

interface IQueryParams {
    [k: string]: Ydb.ITypedValue;
}

class BaseFilter<T = any> {
    public value: T;

    constructor(value: T) {
        this.value = value;
    }

}

export class NOT extends BaseFilter {
}

export class MORE extends BaseFilter<number> {
}

export class LESS extends BaseFilter<number> {
}

export class BETWEEN {
    public lower: number;
    public upper: number;

    constructor(lower: number, upper: number) {
        this.lower = lower;
        this.upper = upper;
    }
}


@autoInjectable()
export class BaseRepo<T extends BaseEntity> implements IRepo<T> {

    protected target: Constructor<T>;
    protected declaration: string;
    protected tableName: string;

    constructor(protected db: DB) {
        // console.log(this)
        const entity: Constructor<T> | undefined = Reflect.getMetadata(TARGET_ENTITY_TOKEN, this.constructor);
        if (!entity)
            throw new Error("Undefined entity in repository, add @Repository(Entity) decorator")
        this.target = entity;
        this.declaration = getDeclaration(entity);
        this.tableName = getTableName(entity);
        // console.log(type)
    }


    async addAll(dto: T[]): Promise<boolean> {
        if (dto.length === 0)
            return true;

        const query = `${SYNTAX_V1}

${this.declaration}

REPLACE INTO ${this.tableName}
SELECT
    ${Object.getOwnPropertyNames(dto[0]).join(",\n    ")}
FROM AS_TABLE($${this.tableName});
`;

        // `$${this.tableName}`: TypedData.asTypedCollection(dto)
        // console.log(dto)
        // console.log();
        // console.log(query);
        let params: IQueryParams = {[`$${this.tableName}`]: TypedData.asTypedCollection(dto)};

        await this.db.withSession(async (session) => {
            await withRetries(async () => {
                const preparedQuery = await session.prepareQuery(query);

                await session.executeQuery(preparedQuery, params);
            });
        });
        return true;
    }

    async add(dto: T): Promise<boolean> {
        const arr = new Array<T>();
        arr.push(dto);
        return this.addAll(arr);
    }


    async findAll(params?: FindAllParams): Promise<T[]> {
        let declarations = "";

        if (params?.where?.length) {
            declarations = `${params?.where.map((el, index) => Object.entries(el).map(([key, {type}]) => {
                return `DECLARE $${key}${index} AS ${typeToString(type)};\n`;
            }).join("")).join("")}`
        }

        let query = `${SYNTAX_V1}

${declarations}

SELECT
${params?.select?.join(",\n") ?? "*"}
FROM ${this.tableName}`;
        const requestParams: { [k: string]: ITypedValue } = {};
        if (params?.where?.length) {
            query += `\nWHERE\n${params.where.map((el, index) => "(\n" +
                Object.entries(el).map(([key, value]) => {
                    let res = `${key} `
                    let sep: string;
                    // if (value instanceof NOT)
                    //     sep = "!="
                    // else if (value instanceof MORE)
                    //     sep = ">"
                    // else if (value instanceof LESS)
                    //     sep = "<"
                    // else if (value instanceof BETWEEN)
                    //     return res + `BETWEEN ${value.lower} AND ${value.upper}`
                    // else
                    sep = "=";
                    res += `${sep} `;
                    // if (value instanceof BaseFilter)
                    //     res += value.value
                    // else if (typeof value === 'string')
                    //     res += `"${value}"`
                    // else
                    res += `$${key}${index}`;
                    // console.log("wtf")
                    requestParams[`$${key}${index}`] = value;

                    return res;
                }).join("\nAND\n") + "\n)").join("\nOR\n")}`;
        }
        if (params?.order)
            query += `\nORDER BY\n${Object.entries(params.order).map(([key, value]) => {
                return `${key} ${value}`
            }).join(",\n")}`
        if (params?.offset)
            query += `\nOFFSET ${params.offset}`
        if (params?.limit)
            query += `\nLIMIT ${params.limit}`
        query += ";";
        console.log(query)
        let res : T[] = [];
        await this.db.withSession(async (session) => {
            await withRetries(async () => {
                const preparedQuery = await session.prepareQuery(query);

                const {resultSets} = await session.executeQuery(preparedQuery, requestParams);
                const results = resultSets.reduce((prev : Record<string, any>[], curr) => {
                    prev.push(...createNativeObjects(curr))
                    return prev;
                }, res);
                // console.log(resultSets);
                // console.log(results);
                // console.log();
                res = createEntities(this.target, results);
            });
        });
        return res;
        // return Promise.resolve([]);
    }

    async remove(params: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

    async update(params: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

    async updateAll(params: Partial<T>[]): Promise<boolean> {
        return Promise.resolve(false);
    }

}