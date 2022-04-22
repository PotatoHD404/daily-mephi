import {
    Driver,
    AnonymousAuthService,
    parseConnectionString,
    MetadataAuthService,
    TokenAuthService,
    IamAuthService, ISslCredentials,
} from 'ydb-sdk'
import {Database} from "../decorators/database.decorator";
import {session} from "next-auth/core/routes";
import {Ydb} from "ydb-sdk"
import {ExecuteQuerySettings} from "ydb-sdk/build/table";
import path from "path";
import * as fs from "fs";

type IQueryParams = { [k: string]: Ydb.ITypedValue };

@Database()
export class DB {
    private timeout = 10000
    private driver: Driver

    constructor() {
        let authService = new AnonymousAuthService();
        const endpoint = "grpcs://localhost:2135";

        const database = "/local";
        // authService.getAuthMetadata = function () {
        //     const grpc = require('grpc')
        //     const metadata = new grpc.Metadata()
        //     metadata.add('x-ydb-database', database)
        //     return Promise.resolve(metadata)
        // }

        const ydb_certs_path = "C:\\Users\\PotatoHD\\Documents\\GitHub\\daily-mephi\\ydb_certs";
        const credentials: ISslCredentials = {
            rootCertificates: fs.readFileSync(path.join(ydb_certs_path, 'ca.pem')),
            clientPrivateKey: fs.readFileSync(path.join(ydb_certs_path, 'key.pem')),
            clientCertChain: fs.readFileSync(path.join(ydb_certs_path, 'cert.pem')),
        }

        // const endpoint: string = 'grpcs://localhost:2135', database: string = '/local'
        try {
            this.driver = new Driver({endpoint, database, authService: authService, sslCredentials: credentials});
        }
        catch (e){

        }
    }

    async query(query: string, params?: IQueryParams, settings?: ExecuteQuerySettings) {
        await this.connect();
        await this.driver.tableClient.withSession(async (session) => {
            await session.executeQuery(query, params, undefined, settings);
        });
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