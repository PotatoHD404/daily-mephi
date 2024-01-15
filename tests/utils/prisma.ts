import {PrismaClient} from "@prisma/client";
import {clearDB} from "tests/utils/clearDB";

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect()
})

afterEach(async () => {
    await clearDB(prisma)
})

afterAll(async () => {
    await prisma.$disconnect()
})

export {prisma}
