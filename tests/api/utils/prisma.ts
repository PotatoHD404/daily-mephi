import crypto from 'crypto';
import {PrismaClient} from "@prisma/client";
import {execSync} from "child_process";

let prisma: PrismaClient;

function generateDatabaseUrl(workerId: string) {
    const randomId = crypto.randomBytes(8).toString('hex');
    const originalUrl = process.env.DATABASE_URL;
    if (!originalUrl) {
        throw new Error('DATABASE_URL is not defined');
    }
    let [url, parameters] = originalUrl.split('?');
    let urlParts = url.split('/')
    urlParts.pop()
    const newDbName = `testdb_${workerId}_${randomId}`;
    urlParts.push(newDbName);
    let newUrl = `${urlParts.join('/')}?${parameters}`
    createDatabase(originalUrl, newDbName);
    runPrismaMigrate(newUrl);
    return newUrl;
}

function createDatabase(originalUrl: any, newDbName: any) {
    const prisma = new PrismaClient({datasources: {db: {url: originalUrl}}});

    // Create a new database
    prisma.$executeRawUnsafe(`CREATE DATABASE IF NOT EXISTS "${newDbName}"`).finally(() => {
        prisma.$disconnect();
    });
}

function runPrismaMigrate(databaseUrl: string | undefined) {
    process.env.ACTUAL_DATABASE_URL = process.env.DATABASE_URL;
    process.env.DATABASE_URL = databaseUrl;
    execSync('npx prisma migrate deploy --preview-feature', {env: process.env});
}

beforeAll(async () => {
    if (process.env.DATABASE_URL === undefined) {
        throw new Error('DATABASE_URL is not defined');
    }
    if (process.env.JEST_WORKER_ID === undefined) {
        throw new Error('JEST_WORKER_ID is not defined');
    }
    if (process.env.ACTUAL_DATABASE_URL === undefined) {
        const workerId = process.env.JEST_WORKER_ID;
        generateDatabaseUrl(workerId);
    }
    prisma = new PrismaClient()
    // let db_name = process.env.DATABASE_URL?.split('?')[0].split('/').pop()
    // await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${db_name} WITH TEMPLATE defaultdb`);
    // await prisma.$disconnect()

});

afterEach(async () => {

    const deletes = Object.getOwnPropertyNames(prisma).filter(el => el[0] !== el[0].toUpperCase() && el[0].match(/[a-z]/i)).
        // @ts-ignore
        map(el => prisma[el]?.deleteMany).filter(el => el !== undefined).map(el => el())
    await prisma.$transaction(deletes)
})

afterAll(async () => {
    let db_name = process.env.DATABASE_URL?.split('?')[0].split('/').pop()
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${db_name}`);
    await prisma.$disconnect()
})

export {prisma}
