import {Prisma, PrismaClient} from "@prisma/client";
import {clearDB} from "tests/utils/clearDB";

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect()
    await clearDB(prisma)
})

beforeEach(async () => {
    await prisma.$transaction()
});

afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK TO SAVEPOINT test_transaction;`;
    await prisma.$executeRaw`COMMIT;`;
});

afterAll(async () => {
    await prisma.$disconnect()
})

export {prisma}
