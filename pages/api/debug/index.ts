// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "reflect-metadata"
import type {NextApiRequest, NextApiResponse} from 'next'
import {CommentsService} from "lib/api/comments/comments.service";
import {
    autoInjectable,
    container,
    inject,
    injectable,
    InjectionToken,
    instanceCachingFactory,
    singleton
} from "tsyringe";
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
import {DB} from "../../../lib/database/db";

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

    public find() {
        console.log("find")
    }
}


function Entity() {
    return function <T extends { new(...args: any[]): {} }>(constr: T) {
        const class1 = new Test2<typeof constr>(constr)
        container.register(typeof class1, {useValue: class1});
        // container.register(Test2<typeof constr>, {useValue: class1});
    }
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

    function Entity() {
        return function <T extends { new(...args: any[]): {} }>(constr: T) {
            const db = container.resolve(DB);
            container.register("entity:" + (constr.name), {useFactory: instanceCachingFactory<Rep<T>>(c => new Rep(db, constr))});
            // container.register(Test2<typeof constr>, {useValue: class1});
        }
    }

    @Entity()
    class Test {
        a: string = ""
    }


    class Rep<T> {
        constructor(private db: DB, private type: any) {
            // console.log(type)
        }

        print() {
            console.log("1")
        }
    }


    let a = Test;
    // const class1 = new Rep<typeof a>(db, Test)

    // console.log(a.name)
    // container.register(class1.constructor.name, {useValue: class1});

    // const requiredMetadataKey = Symbol("repositories");

    function injectRepo(entity: new(...args: any[]) => any) {
        return inject("entity:" + (entity.name));
    }

    @singleton()
    class RepImpl {
        constructor(@injectRepo(Test) a: Rep<Test>) {
            a.print()
        }
    }


    // class Test extends TypedData {
    //     a: string
    //
    //     constructor(a: string) {
    //         super({})
    //
    //         this.a = a
    //         console.log("a: ", a)
    //     }
    // }


    const impl = container.resolve(RepImpl);

    console.log(Test2.name)
    // console.log(Reflect.getMetadata("design:type",Test, "a"))

    res.status(200).json('host');
}
