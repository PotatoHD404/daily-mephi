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
    const res = {
        id: faker.string.uuid(),
        url: faker.internet.url(),
        altUrl: faker.internet.url(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
        filename: faker.system.fileName(),
        userId: faker.datatype.boolean() || usersCopy.length === 0 ? null : faker.helpers.arrayElement(usersCopy),
        tutorId: null,
        materialId: null,
        tag: faker.datatype.boolean() ? "avatar" : "other",
        size: faker.number.int({min: 0, max: 10000000}),
    }
    // remove user id from users array
    if (res.userId !== null && res.tag === "avatar")
        usersCopy.splice(usersCopy.findIndex(el => el === res.userId), 1)
    return res;
}