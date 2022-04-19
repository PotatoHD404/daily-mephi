import fs from 'fs'
import path from 'path'
import pino from 'pino'

import {
    Driver,
    IamAuthService,
    TokenAuthService,
    AnonymousAuthService,
    getSACredentialsFromJson,
    MetadataAuthService,
} from 'ydb-sdk'

let db: Ydb | null = null;

export class Ydb {
    timeout = 10000
    driver: Driver

    constructor(endpoint: string, database: string) {
        this.driver = new Driver({endpoint, database, authService: new AnonymousAuthService()});
    }

    async close() {
        await this.driver.destroy()
    }

    async connect() {
        if (!await this.driver.ready(this.timeout)) {
            throw new Error('ydb: error db connect')
        }
    }

}


export function getDb(): Ydb {
    if (!db)
        db = new Ydb('localhost:2135', '/local')
    return db;
}