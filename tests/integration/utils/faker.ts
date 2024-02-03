import {faker} from "@faker-js/faker";
import {type Discipline, type Faculty, type File, Semester} from "@prisma/client";

export function generateImage() {
    return {
        id: faker.string.uuid(),
        tag: "avatar",
        filename: faker.system.fileName(),
        url: faker.internet.url(),
        altUrl: faker.internet.url(),
    }
}

export function generateSemester(): Semester {
    return {
        id: faker.string.uuid(),
        name: faker.string.numeric(2),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
    };
}

export function generateDiscipline(): Discipline {
    return {
        id: faker.string.uuid(),
        name: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
    };
}

export function generateFaculty(): Faculty {
    return {
        id: faker.string.uuid(),
        name: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
    };
}

export function generateFile(usersCopy: string[]): File {
    const av = faker.datatype.boolean() ? "avatar" : "other"
    const res = {
        id: faker.string.uuid(),
        url: faker.internet.url(),
        altUrl: faker.internet.url(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
        filename: faker.system.fileName(),
        userId: faker.datatype.boolean() || usersCopy.length === 0 ? null : faker.helpers.arrayElement(usersCopy),
        isImage: av === "avatar",
        tutorId: null,
        materialId: null,
        tag: av,
        size: faker.number.int({min: 0, max: 10000000}),
    }
    // remove user id from users array
    if (res.userId !== null && res.tag === "avatar")
        usersCopy.splice(usersCopy.findIndex(el => el === res.userId), 1)
    return res;
}

export function generateUser() {
    return {
        id: faker.string.uuid(),
        nickname: faker.internet.userName(),
        deletedAt: null,
        // image: {
        //     create: generateImage()
        // },
        role: faker.helpers.arrayElement(["tutor", "default"]),
    };
}

export function generateNews() {
    return {
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
        // userId: null,
    };
}

export function generateComment() {
    const res = {
        id: faker.string.uuid(),
        text: faker.lorem.paragraph(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
        parentId: null,
        userId: null,
        type: faker.helpers.arrayElement(["news", "material", "review"]),
        recordId: null,
        depth: 1,
        commentsCount: 0,
        likesCount: faker.number.int({min: 0, max: 50}),
        dislikesCount: faker.number.int({min: 0, max: 50}),
    };
    return {...res, path: [res.id], score: res.likesCount - res.dislikesCount + res.commentsCount};
}