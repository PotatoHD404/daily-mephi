import {faker} from "@faker-js/faker";
import {User} from "@prisma/client";
import {prisma} from "lib/database/prisma";

async function createUsers() {
    function generateImage() {
        return {
            id: faker.string.uuid(),
            tag: "avatar",
            filename: faker.system.fileName(),
            url: faker.internet.url(),
            altUrl: faker.internet.url(),
        }
    }

    const images = Array.from({length: 500}, generateImage).sort((a, b) => a.id.localeCompare(b.id));

    await prisma.file.createMany({
        data: images
    });

    const imageIds = images.map(image => image.id);
    function generateNickname() {
        let nickname = faker.internet.userName();
        // Replace disallowed characters with underscores and limit length
        nickname = nickname.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 30);

        // Ensure nickname is at least 3 characters long
        if (nickname.length < 3) {
            nickname += '_'.repeat(3 - nickname.length);
        }

        return nickname;
    }

    // generate faker user
    function generateUser() {
        const res = {
            bio: faker.lorem.sentence(),
            commentsCount: faker.number.int({
                'min': 0,
                'max': 50
            }),
            createdAt: faker.date.past(),
            deletedAt: null,
            dislikesCount: faker.number.int({
                'min': 0,
                'max': 50
            }),
            email: null,
            emailVerified: null,
            id: faker.string.uuid(),
            imageId: faker.datatype.boolean() ? faker.helpers.arrayElement(imageIds) : null,
            likesCount: faker.number.int({
                'min': 0,
                'max': 50
            }),
            materialsCount: faker.number.int({
                'min': 0,
                'max': 50
            }),
            nickname: generateNickname(),
            place: faker.number.int({
                'min': 1,
                'max': 100
            }),
            quotesCount: faker.number.int({
                'min': 0,
                'max': 50
            }),
            rating: faker.number.int({
                'min': 0,
                'max': 100
            }),
            reviewsCount: faker.number.int({
                'min': 0,
                'max': 50
            }),
            role: 'user',
            score: faker.number.int({
                'min': 0,
                'max': 100
            }),
            updatedAt: faker.date.past(),
        }

        // remove selected image from array
        if (res.imageId !== null) {
            const index = imageIds.indexOf(res.imageId);
            if (index > -1) {
                imageIds.splice(index, 1);
            }
        }

        return res;
    }

    // generate 10 users
    const users: User[] = Array.from({length: 100}, generateUser);


    await prisma.user.createMany({
        data: users
    });

    // const result = await supertest(server)
    //     .get('/api/v2/top')
    //     .expect(200)
    //     .expect('Content-Type', /json/);
    // expect(result.body).toBeDefined();
    // expect(result.body).toEqual(users)

    return {
        usersWithImages: users.map((el, index) => {
            let res
            if (el.imageId !== null) {
                const image = images.find(img => img.id === el.imageId)
                if (image === undefined) throw new Error("Image not found")
                res = {
                    ...el,
                    image: {
                        url: image.url,
                    }
                }
            } else {
                res = {...el, image: null}
            }
            // @ts-ignore
            delete res.imageId
            // @ts-ignore
            delete res.email
            // @ts-ignore
            delete res.emailVerified
            // @ts-ignore
            delete res.createdAt
            // @ts-ignore
            delete res.deletedAt
            // @ts-ignore
            delete res.score
            // @ts-ignore
            delete res.updatedAt
            return res
        }), users, imageIds
    }
}

export {createUsers}
