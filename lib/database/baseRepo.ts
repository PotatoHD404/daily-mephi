import {getDeclaration, getRowType, getTableName} from "helpers/utils";
import {BaseEntity} from "lib/database/baseEntity";
import {TARGET_ENTITY_TOKEN} from "lib/database/decorators/repository.decorator";
import {Constructor} from "lib/database/types";
import {autoInjectable} from "tsyringe";
import {TypedData, withRetries} from "ydb-sdk";
import {Ydb} from "ydb-sdk-proto";
import {DB} from "./db";
import {IRepo} from "./interfaces/repo.interface";

export const SYNTAX_V1 = '--!syntax_v1';

interface IQueryParams {
    [k: string]: Ydb.ITypedValue;
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
        console.log(dto)
        console.log();
        console.log(query);
        let params: IQueryParams = {[`$${this.tableName}`]: TypedData.asTypedCollection(dto)};
        console.log()
        console.log()

        await this.db.withSession(async (session) => {
            await withRetries(async () => {
                const preparedQuery = await session.prepareQuery(query);

                await session.executeQuery(preparedQuery, params);
            });


        });
        return false;
    }

    async add(dto: T): Promise<boolean> {
        const arr = new Array<T>();
        arr.push(dto);
        console.log(await this.addAll(arr))
        return this.addAll(arr);
    }

    async count(params: Partial<T>): Promise<number> {
        return Promise.resolve(0);
    }

    async find(params: Partial<T>): Promise<T[]> {
        return Promise.resolve([]);
    }

    async findAndCount(params: Partial<T>): Promise<{ count: number; entities: T[] }> {
        return Promise.resolve({count: 0, entities: []});
    }

    async findOne(params: Partial<T>): Promise<T> {
        return Promise.resolve(Object.prototype as any);
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