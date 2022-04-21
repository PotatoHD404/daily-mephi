import {Driver, AnonymousAuthService,} from 'ydb-sdk'
import {Database} from "../decorators/database.decorator";

@Database()
export class Ydb {
    timeout = 10000
    driver: Driver

    constructor(endpoint: string = 'localhost:2135', database: string = '/local') {
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