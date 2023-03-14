import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect()
})

afterEach(async () => {

    const deletes = Object.getOwnPropertyNames(prisma).
    filter(el => el[0] !== el[0].
    toUpperCase() && el[0].
    match(/[a-z]/i)).
        // @ts-ignore
        map(el => prisma[el]?.deleteMany).
        filter(el => el !== undefined).map(el => el())
    await prisma.$transaction(deletes)
})

afterAll(async () => {
    await prisma.$disconnect()
})

export {prisma}
