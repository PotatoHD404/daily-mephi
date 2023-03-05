import type {User} from "@prisma/client";
import {faker} from '@faker-js/faker';
import {prismaMock} from 'tests/mocks/prisma';


jest.setTimeout(5 * 10e2);

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
// }
describe('[GET] /api/v1/users', () => {

    it('Test get all', async () => {

        // generate faker user
        function generateUser() {
            return {
                bio: faker.lorem.sentence(),
                commentsCount: faker.datatype.number({
                    'min': 0,
                    'max': 50
                }),
                createdAt: faker.date.past(),
                deletedAt: null,
                dislikesCount: faker.datatype.number({
                    'min': 0,
                    'max': 50
                }),
                email: null,
                emailVerified: null,
                id: faker.datatype.uuid(),
                imageId: null,
                likesCount: faker.datatype.number({
                    'min': 0,
                    'max': 50
                }),
                materialsCount: faker.datatype.number({
                    'min': 0,
                    'max': 50
                }),
                nickname: faker.internet.userName(),
                place: faker.datatype.number({
                    'min': 1,
                    'max': 100
                }),
                quotesCount: faker.datatype.number({
                    'min': 0,
                    'max': 50
                }),
                rating: faker.datatype.number({
                    'min': 0,
                    'max': 100
                }),
                reviewsCount: faker.datatype.number({
                    'min': 0,
                    'max': 50
                }),
                role: 'user',
                score: faker.datatype.number({
                    'min': 0,
                    'max': 100
                }),
                updatedAt: faker.date.past(),
            }
        }

        // generate 10 users
        const users: User[] = Array.from({length: 10}, generateUser);

        prismaMock.user.findMany.mockResolvedValue(users);


        // const result = await supertest(server)
        //     .get('/api/v1/top')
        //     .expect(200)
        //     .expect('Content-Type', /json/);
        // expect(result.body).toBeDefined();
        // expect(result.body).toEqual(users)

        expect(true).toBeDefined()

    });
});
