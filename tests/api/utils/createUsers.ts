import {faker} from "@faker-js/faker";
import {prisma} from "./prisma";
import {User} from "@prisma/client";

async function createUsers() {
    function generateImage() {
        return {
            id: faker.datatype.uuid(),
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

    // generate faker user
    function generateUser() {
        const res = {
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
            imageId: faker.datatype.boolean() ? faker.helpers.arrayElement(imageIds) : null,
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
    //     .get('/api/v1/top')
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