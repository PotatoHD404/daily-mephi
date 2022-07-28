import * as http from 'http';


import supertest from 'supertest';

import {apiResolver} from "next/dist/server/api-utils/node";
import debugHandler from 'pages/api/v1/top';
import prisma from "../../lib/database/prisma";

jest.setTimeout(5 * 10e2);
describe('[GET] /api/v1/top', () => {
    let server: http.Server;

    beforeAll(() => {

    })

    beforeEach(() => {
        const requestHandle = (request: http.IncomingMessage, response: http.ServerResponse) =>
            apiResolver(
                request,
                response,
                undefined,
                debugHandler,
                {} as any,
                true,
            );
        server = http.createServer(requestHandle);
    });

    afterEach(() => {
        server.close();
    });


    it('Test top', async () => {
        const users: any = [{
            "name": "PotatoHD",
            "image": null,
            "rating": 1,
        }, {
            "name": "Ponchik",
            "image": null,
            "rating": 0,
        }]
        prisma.user.findMany = jest.fn().mockResolvedValue(users);

        const result = await supertest(server)
            .get('/api/v1/top')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(result.body).toBeDefined();
        expect(result.body).toEqual(users)
    });

    // it('creates a new user', async () => {
    //     const body = {
    //         name: 'John Doe',
    //         email: 'johndoe@example.com',
    //         password: 'ji32k7au4a83',
    //     };
    //     const result = await supertest(server)
    //         .post('/api/auth/register')
    //         .send(body)
    //         .expect(201)
    //         .expect('Content-Type', /json/);
    //
    //     expect(result.body).toBeDefined();
    // });
    //
    // it.each([
    //     {
    //         name: '',
    //         email: '',
    //         password: '',
    //     },
    //     {
    //         name: 'a',
    //         email: 'email',
    //         password: '123456',
    //     },
    // ])('validate the body %p', async (body) => {
    //     const result = await supertest(server)
    //         .post('/api/auth/register')
    //         .send(body)
    //         .expect(422)
    //         .expect('Content-Type', /json/);
    //
    //     expect(result.body).toBeDefined();
    // });
});
