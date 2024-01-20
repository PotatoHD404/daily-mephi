// order makes difference, it's important to mock prisma before importing utils
import {faker} from "@faker-js/faker";
import {trpc} from "tests/utils/trpc";
import {describe, expect, it} from '@jest/globals';
import {generateComment, generateNews, generateUser} from "./utils/faker";
import {prisma} from "lib/database/prisma";


// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }
describe('[GET] /api/v2/comments', () => {

    it('Test get all', async () => {
        // unique nicknames for users!!!
        // create users, news and comments
        let users = Array.from({length: 100}, generateUser);
        users = users.filter((user, index, self) => index === self.findIndex((t) => (
            t.nickname === user.nickname
        )));
        const news = Array.from({length: 20}, generateNews);
        const rawComments = Array.from({length: 10000}, generateComment);
        const comments = rawComments.map((comment) => {
            return {
                ...comment,
                userId: faker.helpers.arrayElement(users).id,
                recordId: faker.helpers.arrayElement(news).id,
                parentId: null as null | string,
                type: "news",
                depth: 1
            }
        });
        for (let i = 0; i < 10; i++) {
            comments.forEach(comment => {
                let parent = faker.helpers.arrayElement(comments);
                if (faker.datatype.boolean() && parent.type === comment.type && parent.recordId == comment.recordId && !(comment.id in parent.path && parent.id in comment.path)) {
                    comment.parentId = parent.id;
                    comment.path = [...parent.path, comment.id];
                    comment.depth = parent.depth + 1;
                }
            });
        }
        // add comments to comments, their recordId should be the same as their parent's recordId


        await prisma.user.createMany({
            data: users
        });
        await prisma.news.createMany({
            data: news
        });
        await prisma.comment.createMany({
            data: comments
        });

        const apiComments = await trpc.comments.getAll({
            type: "news",
            id: comments[0].recordId
        });

        expect(apiComments).toEqual(comments.filter(el => el.recordId === comments[0].recordId).map(el => {
            return {
                ...el,
                user: users.find(user => user.id === el.userId)
            }
        }));

    });
});
