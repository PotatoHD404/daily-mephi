import {AnonymousAuthService, Column, Driver, Session, TableDescription, Types, Ydb,} from 'ydb-sdk'
import {Database} from "./decorators/database.decorator";
import {InjectAll} from "lib/injection/injection.imports";
import {ENTITY_TOKEN} from "./decorators/entity.decorator";

type IQueryParams = { [k: string]: Ydb.ITypedValue };

@Database()
export class DB {
    private timeout = 10000
    private driver: Driver

    constructor(@InjectAll(ENTITY_TOKEN) entities: any[]) {
        let authService = new AnonymousAuthService();
        const endpoint = "grpc://localhost:2136";

        const database = "/local";

        this.driver = new Driver({endpoint, database, authService: authService});
    }

    // async query(query: string, params?: IQueryParams, settings?: ExecuteQuerySettings) {
    //     await this.connect();
    //     const table = 'table';
    //     await this.driver.tableClient.withSession(async (session) => {
    //
    //         await session.dropTable(table);
    //
    //         await session.createTable(
    //             table,
    //             new TableDescription()
    //                 .withColumn(new Column(
    //                     'key',
    //                     Types.optional(Types.UTF8),
    //                 ))
    //                 .withColumn(new Column(
    //                     'hash',
    //                     Types.optional(Types.UINT64),
    //                 ))
    //                 .withColumn(new Column(
    //                     'value',
    //                     Types.optional(Types.UTF8),
    //                 ))
    //                 .withPrimaryKey('key')
    //         );
    //
    //
    //         const preparedQuery = await session.prepareQuery(`SELECT * FROM ${table}`);
    //
    //         console.log();
    //     });
    // }

    async withSession(func: (session: Session) => Promise<void>) {
        await this.driver.tableClient.withSession(func);
    }

    async close() {
        await this.driver.destroy();
    }

    async connect() {
        if (!await this.driver.ready(this.timeout)) {
            throw new Error('ydb: error db connect');
        }
    }

}