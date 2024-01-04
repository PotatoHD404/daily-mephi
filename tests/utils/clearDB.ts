import {PrismaClient} from "@prisma/client";

export async function clearDB(prisma: PrismaClient) {
    const deletes = Object.getOwnPropertyNames(prisma).filter(el => el[0] !== el[0].toUpperCase() && el[0].match(/[a-z]/i)).
        // @ts-ignore
        map(el => prisma[el]?.deleteMany).filter(el => el !== undefined).map(el => el())
    await prisma.$transaction(deletes)
}