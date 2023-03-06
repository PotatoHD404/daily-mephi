import {faker} from "@faker-js/faker";
import "tests/api/mocks/prisma";
import {trpc} from "tests/api/mocks/trpc";

jest.setTimeout(10 * 10e3)

// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v1/thumbnails/materials/{id}.png', () => {

    it('Test get', async () => {

        expect(await trpc.thumbnails.getMaterial({id: faker.datatype.uuid()})).toBeUndefined()

    });
});


describe('[GET] /api/v1/thumbnails/quotes/{id}.png', () => {

    it('Test get', async () => {

        expect(await trpc.thumbnails.getQuote({id: faker.datatype.uuid()})).toBeUndefined()

    });
});

describe('[GET] /api/v1/thumbnails/reviews/{id}.png', () => {

    it('Test get', async () => {

        expect(await trpc.thumbnails.getReview({id: faker.datatype.uuid()})).toBeUndefined()

    });
});

describe('[GET] /api/v1/thumbnails/tutors/{id}.png', () => {

    it('Test get', async () => {

        expect(await trpc.thumbnails.getTutor({id: faker.datatype.uuid()})).toBeUndefined()

    });
});

describe('[GET] /api/v1/thumbnails/users/{id}.png', () => {

    it('Test get', async () => {

        expect(await trpc.thumbnails.getUser({id: faker.datatype.uuid()})).toBeUndefined()

    });
});
