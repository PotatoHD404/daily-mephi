import {google, Ydb} from "ydb-sdk-proto";
import ITypedValue = Ydb.ITypedValue;


export interface FindAllParams {
    select?: string[],
    where?: { [k: string]: ITypedValue} | { [k: string]: ITypedValue}[],
    order?: { [k: string]: "ASC" | "DESC" },
    offset?: number,
    limit?: number
}

export interface IRepo<T> {
    findAll: (params: FindAllParams) => Promise<T[]>;
    find: (params: Omit<FindAllParams, "limit" | "order">) => Promise<T | null>;
    count: (params: Omit<FindAllParams, "select" | "order">) => Promise<number>;
    add: (entity: T) => Promise<void>;
    addAll: (entities: T[]) => Promise<void>;
    update: (entity: T) => Promise<void>;
    updateAll: (entities: T[]) => Promise<void>;
    remove: (entity: T) => Promise<void>;
    removeAll: (entities: T[]) => Promise<void>;
}
