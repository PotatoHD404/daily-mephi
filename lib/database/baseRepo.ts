import {IRepo} from "./interfaces/repo.interface";
import {DB} from "./db";


export class BaseRepo<T> implements IRepo<T> {


    constructor(protected db: DB, protected entity: new (...args: any[]) => T) {

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
        return Promise.resolve({count: 0, entities: []});
    }

    findOne(params: Partial<T>): Promise<T> {
        return Promise.resolve(Object.prototype as any);
    }

    remove(params: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

    update(params: Partial<T>): Promise<boolean> {
        return Promise.resolve(false);
    }

}