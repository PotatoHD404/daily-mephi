// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "reflect-metadata"
import type {NextApiRequest, NextApiResponse} from 'next'
import {container, inject, singleton} from "tsyringe";
import {declareType, TypedData, Types} from "ydb-sdk";
import {DB} from "lib/database/db";

function logType(target: any, key: string) {
    let t = Reflect.getMetadata("design:type", target, key);
    Reflect.defineMetadata("design:type", target, key)
    console.log(`${key} type: ${t.name}`);
}


class NormData extends TypedData {
    constructor() {
        super({});
    }

    asTypedRow() {
        return {
            type: {
                listType: {
                    item: this.getRowType()
                }
            },
            value: {
                items: this.getRowValue()
            }
        }
    }
}

class TestEntity extends NormData {
    @declareType(Types.STRING)
    private a: string = "1"
    // test(){
    //     return this
    // }
}

function testFunc(a: any) {
    class eee extends a {

    }
}

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {

    function Entity() {
        return function <T extends { new(...args: any[]): {} }>(constr: T) {
            // const db = container.resolve(DB);
            // typeof new Rep<T>(null, null)
            // container.register("repository:" + (constr.name), {useFactory: instanceCachingFactory<Rep<T>>(c => new Rep(db, constr))});
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
        return inject("repository:" + (entity.name));
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
    const testEntity = new TestEntity();
    console.log(testEntity.asTypedRow())
    // console.log(Test2.name)
    // console.log(Reflect.getMetadata("design:type",Test, "a"))

    res.status(200).json('host');
}
