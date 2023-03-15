import supertest from 'supertest';
import "tests/api/mocks/prisma"; 
import {apiResolver} from "next/dist/server/api-utils/node";
import * as http from "http";
import openapiJsonHandler from "pages/api/v1/openapi.json"
import openapiYamlHandler from "pages/api/v1/openapi.yaml"



// export type User = {
//     id: string
//     nickname: string | null
//     imageId: string | null
//     role: string
//     email: string | null
//     emailVerified: Date | null
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
//     rating: number
//     bio: string | null
//     place: number
//     likesCount: number
//     dislikesCount: number
//     commentsCount: number
//     materialsCount: number
//     reviewsCount: number
//     quotesCount: number
//     score: number

function getServer(handler: any) {
    const requestHandle = (request: http.IncomingMessage, response: http.ServerResponse) =>
        apiResolver(
            request,
            response,
            undefined,
            handler,
            {} as any,
            true,
        );
    return http.createServer(requestHandle);
}

// }
describe('[GET] /api/v1/openapi.json', () => {
    let server: http.Server = getServer(openapiJsonHandler);

    it('Test get', async () => {


        expect(true).toEqual(true)

        const result = await supertest(server)
            .get('/api/v1/openapi.json')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(result.body).toBeDefined();


    });
});

describe('[GET] /api/v1/openapi.yaml', () => {
    let server: http.Server = getServer(openapiYamlHandler);

    it('Test get', async () => {

        expect(true).toEqual(true)

        const result = await supertest(server)
            .get('/api/v1/openapi.yaml')
            .expect(200)
            .expect('Content-Type', /yaml/);
        expect(result.body).toBeDefined();


    });
});
