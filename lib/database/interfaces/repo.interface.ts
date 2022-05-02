import {google, Ydb} from "ydb-sdk-proto";
import ITypedValue = Ydb.ITypedValue;
import IValue = google.protobuf.IValue;


export interface FindAllParams {
    select?: string[],
    where?: { [k: string]: ITypedValue }[],
    order?: { [k: string]: "ASC" | "DESC" },
    offset?: number,
    limit?: number
}

export interface IRepo<T> {
    findAll: (params: FindAllParams) => Promise<T[]>;
    add: (dto: T) => Promise<boolean>;
    addAll: (dto: T[]) => Promise<boolean>;
    update: (dto: Partial<T>) => Promise<boolean>;
    updateAll: (dto: Partial<T>[]) => Promise<boolean>;
    remove: (params: Partial<T>) => Promise<boolean>;
}
