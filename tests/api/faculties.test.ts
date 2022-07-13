import * as http from 'http';


import supertest from 'supertest';

import {apiResolver} from "next/dist/server/api-utils/node";
import debugHandler from '../../pages/api/debug/index';
import prisma from "../../lib/database/prisma";

jest.setTimeout(5 * 10e2);
describe('[GET] /api/debug', () => {
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


    it('Debug test', async () => {
        const users: any = [{
            "id": "3d87919c-3da9-4956-8db3-7d5af7c7863f",
            "name": "PotatoHD",
            "image": null,
            "rating": 0,
            "role": "default",
            "email": null,
            "emailVerified": null
        }, {
            "id": "da38c896-22ed-4259-82d8-b5134e943cca",
            "name": "Ponchik",
            "image": null,
            "rating": 0,
            "role": "default",
            "email": null,
            "emailVerified": null
        }]
        prisma.user.findMany = jest.fn().mockResolvedValue(users);

        const result = await supertest(server)
            .get('/api/debug')
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
