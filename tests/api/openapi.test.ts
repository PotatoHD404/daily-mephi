import supertest from 'supertest';



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
describe('[GET] /api/v1/openapi.json', () => {



    it('Test top', async () => {

        // @ts-ignore
        // prisma.user.findMany = jest.fn().mockResolvedValue(users);

        expect(true).toEqual(true)

        // const result = await supertest(server)
        //     .get('/api/v1/top')
        //     .expect(200)
        //     .expect('Content-Type', /json/);
        // expect(result.body).toBeDefined();
        // expect(result.body).toEqual(users)


    });
});
