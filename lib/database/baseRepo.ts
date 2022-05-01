import {TARGET_ENTITY_TOKEN} from "lib/database/decorators/repository.decorator";
import {Constructor} from "lib/database/types";
import {autoInjectable, inject, injectable} from "tsyringe";
import {IRepo} from "./interfaces/repo.interface";
import {DB} from "./db";

@autoInjectable()
export class BaseRepo<T> implements IRepo<T> {

    protected target: T;

    constructor(protected db: DB) {
        const entity : Constructor<T> | undefined = Reflect.getMetadata(TARGET_ENTITY_TOKEN, this);
        if(!entity)
            throw new Error("Undefined entity in repository, add @Repository(Entity) decorator")
        this.target = new entity;
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