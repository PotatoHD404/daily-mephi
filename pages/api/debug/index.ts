// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "reflect-metadata"
import type {NextApiRequest, NextApiResponse} from 'next'
import {CommentsService} from "lib/api/comments/comments.service";
import {autoInjectable, container, inject, injectable, singleton} from "tsyringe";
import {
    AnonymousAuthService,
    Driver,
    ISslCredentials,
    snakeToCamelCaseConversion,
    TypedData,
    withTypeOptions
} from "ydb-sdk";
import fs from "fs";
import path from "path";
import {Repo} from "../../../lib/interfaces/repository";

function logType(target: any, key: string) {
    let t = Reflect.getMetadata("design:type", target, key);
    let a = new t();
    a.print();
    console.log(`${key} type: ${t.name}`);
}

class TestEntity {
    private a: string = ""
}

function testFunc(a: any) {
    class eee extends a {

    }
}

// export function Entity(table?: string) {
//
//
//     return (target: new (...args: any[]) => any) => {
//         target = withTypeOptions({namesConversion: snakeToCamelCaseConversion})(target)
//
//         return target;
//     };
// }

interface test {
    find: () => void
}


class Test2<T> {
    constructor(t: T) {

    }

    public find(){
        console.log("find")
    }
}


function Entity() {
    return function <T extends { new(...args: any[]): {} }>(constr: T){
        return new Test2<typeof constr>(constr);
    }
}

class CanEat {
    public eat() {
        alert('Munch Munch.');
    }
}

class CanSleep {
    sleep() {
        alert('Zzzzzzz.');
    }
}

interface Shopperholic extends CanSleep, CanEat {
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {

        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {

    class Test extends TypedData {
        // @logType
        a: string

        constructor(a: string) {
            super({})

            this.a = a
            console.log("a: ", a)
        }

        // @logType
        // b: Test1
    }

    console.log(Reflect.ownKeys(Test.prototype))
    // TypedData & Test1
    @injectable()
    class Test2<T> {
        constructor(t: T) {

        }

        public find(){
            console.log("find")
        }
    }
    // @Repository()
    @autoInjectable()
    @Repository()
    class Test1 extends Test2<Test1>{
        public print() {
            console.log("lol")
        }
    }

    //
    //
    const what = container.resolve(Test1);

    // console.log(Reflect.getMetadata("design:type",Test, "a"))

    res.status(200).json('host');
}
