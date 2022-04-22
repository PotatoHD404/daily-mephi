// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "reflect-metadata"
import type {NextApiRequest, NextApiResponse} from 'next'
import {CommentsService} from "lib/api/comments/comments.service";
import {autoInjectable} from "tsyringe";
import {AnonymousAuthService, Driver, ISslCredentials} from "ydb-sdk";
import fs from "fs";
import path from "path";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {


    let authService = new AnonymousAuthService();
    const endpoint = "grpc://localhost:2136";

    const database = "/local";
    // authService.getAuthMetadata = function () {
    //     const grpc = require('grpc')
    //     const metadata = new grpc.Metadata()
    //     metadata.add('x-ydb-database', database)
    //     return Promise.resolve(metadata)
    // }

    // const ydb_certs_path = "C:\\Users\\PotatoHD\\Documents\\GitHub\\daily-mephi\\ydb_certs";
    // console.log(fs.readFileSync(path.join(ydb_certs_path, 'ca.pem')));
    // const credentials: ISslCredentials = {
    //     rootCertificates: fs.readFileSync(path.join(ydb_certs_path, 'ca.pem')),
    //     clientPrivateKey: fs.readFileSync(path.join(ydb_certs_path, 'key.pem')),
    //     clientCertChain: fs.readFileSync(path.join(ydb_certs_path, 'cert.pem')),
    // }

    // const endpoint: string = 'grpcs://localhost:2135', database: string = '/local'

    // const driver = new Driver({endpoint, database, authService: authService});

    res.status(200).json('host');
}
