import type {Discipline} from "@prisma/client";
// order makes difference, it's important to mock prisma before importing utils
import {faker} from "@faker-js/faker";
import {trpc} from "tests/utils/trpc";
import {describe, it, expect} from '@jest/globals';
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
        // create users, news and comments
        const users = Array.from({length: 100}, generateUser);
        const news = Array.from({length: 100}, generateNews);
        const rawComments = Array.from({length: 1000}, generateComment);
        const comments = rawComments.map((comment, index) => {
            return {
                ...comment,
                userId: users[index].id,
                newsId: news[index].id,
                type: "news"
            }
        });
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
            id: news[0].id
        });

        expect(apiComments).toEqual(comments.slice(0, 20));
    });
});
