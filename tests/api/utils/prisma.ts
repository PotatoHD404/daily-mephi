import {PrismaClient, Semester} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {clearDB} from "utils/clearDB";

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
