import {PrismaClient, Semester} from "@prisma/client";
import {faker} from "@faker-js/faker";

export default async function seed() {
    const prisma = new PrismaClient();
    faker.seed(404);

    function generateSemester(): Semester {
        return {
            id: faker.datatype.uuid(),
            name: faker.random.numeric(2),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
            deletedAt: null,
        };
    }

    let semesters = Array.from({length: 10}, generateSemester).sort((a, b) => a.id.localeCompare(b.id));
// filter unique semesters by name
    semesters = semesters.filter((item, index) => semesters.findIndex(el => el.name === item.name) === index)
    await prisma.semester.createMany({
        data: semesters
    });
}
