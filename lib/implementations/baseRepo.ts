import {IRepo} from "../interfaces/repo.interface";
import {DB} from "../database/db";


class BaseRepo<T> implements IRepo<T> {



    constructor(private db: DB, private entity: new (...args: any[]) => T) {

        // console.log(type)
    }

    add(dto: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

    count(params: Partial<T>): Promise<number> {
        return Promise.resolve(0);
    }

    find(params: Partial<T>): Promise<T[]> {
        return Promise.resolve([]);
    }

    findAndCount(params: Partial<T>): Promise<{ count: number; entities: T[] }> {
        return Promise.resolve(undefined);
    }

    findOne(params: Partial<T>): Promise<T> {
        return Promise.resolve(undefined);
    }

    remove(params: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

    update(params: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

}