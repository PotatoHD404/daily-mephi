import {PrismaClient, Semester} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {clearDB} from "./utils/clearDB";
import {generateSemester} from "./integration/utils/faker";

export default async function seed() {


    const prisma = new PrismaClient();
    await clearDB(prisma);
    faker.seed(404);

    let semesters = Array.from({length: 10}, generateSemester).sort((a, b) => a.id.localeCompare(b.id));
    // filter unique semesters by name
    semesters = semesters.filter((item, index) => semesters.findIndex(el => el.name === item.name || el.id === item.id) === index)
    // console.log(semesters)
    await prisma.semester.createMany({
        data: semesters
    });
}
