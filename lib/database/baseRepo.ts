import {getTableName, typeToString} from "helpers/utils";
import {BaseEntity} from "lib/database/baseEntity";
import {TARGET_ENTITY_TOKEN} from "lib/database/decorators/repository.decorator";
import {Constructor} from "lib/database/types";
import {autoInjectable} from "tsyringe";
import {Ydb} from "ydb-sdk";
import {DB} from "./db";
import {IRepo} from "./interfaces/repo.interface";

export const SYNTAX_V1 = '--!syntax_v1';


@autoInjectable()
export class BaseRepo<T extends BaseEntity> implements IRepo<T> {

    protected target: T;

    constructor(protected db: DB) {
        console.log(this.constructor)
        const entity: Constructor<T> | undefined = Reflect.getMetadata(TARGET_ENTITY_TOKEN, this);
        if (!entity)
            throw new Error("Undefined entity in repository, add @Repository(Entity) decorator")
        this.target = new entity;
        // console.log(type)
    }

    getDeclaration(): string {
        let declaration = `DECLARE ${getTableName(this.target)} AS `
        if (this.target.getRowType()['structType'] != undefined) {
            declaration += "Struct<"
            this.target.getRowType().structType.members.forEach(
                (el: { name: any; type: Ydb.IType; }) => {
                    declaration += `\n    ${el.name}: ${typeToString(el.type)}`
                })

            declaration += ">;\n"
        }
        return declaration;
    }

    add(dto: Partial<T>): Promise<boolean> {

        console.log(this.getDeclaration())
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