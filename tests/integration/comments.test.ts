// order makes difference, it's important to mock prisma before importing utils
import {faker} from "@faker-js/faker";
import {trpc} from "tests/utils/trpc";
import {describe, it} from '@jest/globals';
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
        const news = Array.from({length: 100}, generateNews);

        await prisma.user.createMany({
            data: users
        });

        await prisma.news.createMany({
            data: news
        });

        const comments = Array.from({length: 5}, generateComment).map((el, index) => {
            return {
                ...el,
                recordId: news[0].id,
                userId: faker.helpers.arrayElement(users).id,
                type: "news",
                parentId: null as string | null,
            }
        });
        type Comment = typeof comments[0];

        function updateCommentStructure(child: Comment, parent: Comment) {
            // Update the parentId of the child comment to be the id of the parent comment
            child.parentId = parent.id;

            // Increment the commentsCount and score of the parent comment
            parent.commentsCount += 1;
            parent.score += 1;

            // Increment the depth of the parent comment
            parent.depth += 1;

            // Update the path of the child comment to include the path of the parent comment, followed by the child's own id
            child.path = [...parent.path, child.id];

            // Set the depth of the child comment to be one more than the parent comment's depth
            child.depth = parent.depth + 1;
        }

        updateCommentStructure(comments[1], comments[0]);
        updateCommentStructure(comments[2], comments[0]);
        updateCommentStructure(comments[3], comments[1]);


        // for (let i = 0; i < 10; i++) {
        //     comments.forEach(comment => {
        //         let parent = faker.helpers.arrayElement(comments);
        //         if (faker.datatype.boolean() &&
        //             parent.type === comment.type &&
        //             parent.recordId == comment.recordId &&
        //             !parent.path.includes(comment.id) &&
        //             !comment.path.includes(parent.id) &&
        //             comment.id !== parent.id
        //         ) {
        //             console.log(comment.id, parent.id, comment.path, parent.path)
        //             comment.parentId = parent.id;
        //             comment.path = [...parent.path, comment.id];
        //             comment.depth = parent.depth + 1;
        //             parent.commentsCount += 1;
        //             parent.score += 1;
        //         }
        //     });
        // }
        // add comments to comments, their recordId should be the same as their parent's recordId


        await prisma.comment.createMany({
            data: comments
        });

        const apiComments = await trpc.comments.getAll({
            type: "news",
            id: comments[0].recordId
        });

        // expect(apiComments).toEqual({});

    });
});
