import {trpc} from "tests/utils/trpc";
import {describe, expect, it} from '@jest/globals';


// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v2/search', () => {

    it('Test simple search', async () => {

        const search = await trpc.utils.search({
            query: 'test',
            types: ['news', 'tutor'],
            faculty_ids: [],
        });

        expect(search).toEqual({});

    });
});
