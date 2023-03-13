import type {Discipline, Faculty, Semester, File} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {prismaMock} from "tests/api/mocks/prisma";
import {trpc} from "tests/api/mocks/trpc";
import {prisma} from "lib/database/prisma";



// export type Discipline = {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
// }

beforeAll(async () => {
    // create product categories
    await prisma.category.createMany({
        data: [{ name: 'Wand' }, { name: 'Broomstick' }],
    })

    console.log('✨ 2 categories successfully created!')

    // create products
    await prisma.product.createMany({
        data: [
            {
                name: 'Holly, 11", phoenix feather',
                description: 'Harry Potters wand',
                price: 100,
                sku: 1,
                categoryId: 1,
            },
            {
                name: 'Nimbus 2000',
                description: 'Harry Potters broom',
                price: 500,
                sku: 2,
                categoryId: 2,
            },
        ],
    })

    console.log('✨ 2 products successfully created!')

    // create the customer
    await prisma.customer.create({
        data: {
            name: 'Harry Potter',
            email: 'harry@hogwarts.io',
            address: '4 Privet Drive',
        },
    })

    console.log('✨ 1 customer successfully created!')
})

afterAll(async () => {
    const deleteOrderDetails = prisma.orderDetails.deleteMany()
    const deleteProduct = prisma.product.deleteMany()
    const deleteCategory = prisma.category.deleteMany()
    const deleteCustomerOrder = prisma.customerOrder.deleteMany()
    const deleteCustomer = prisma.customer.deleteMany()

    await prisma.$transaction([
        deleteOrderDetails,
        deleteProduct,
        deleteCategory,
        deleteCustomerOrder,
        deleteCustomer,
    ])

    await prisma.$disconnect()
})

describe('[GET] /api/v1/disciplines', () => {

    it('Test get all', async () => {
        function generateDiscipline(): Discipline {
            return {
                id: faker.datatype.uuid(),
                name: faker.lorem.sentence(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        const disciplines = Array.from({length: 10}, generateDiscipline);

        prismaMock.discipline.findMany.mockResolvedValue(disciplines);

        const apiDisciplines = await trpc.utils.disciplines();

        expect(apiDisciplines).toEqual(disciplines);

    });
});

describe('[GET] /api/v1/faculties', () => {

    it('Test get all', async () => {
        function generateFaculty(): Faculty {
            return {
                id: faker.datatype.uuid(),
                name: faker.lorem.sentence(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        const faculties = Array.from({length: 10}, generateFaculty);

        prismaMock.faculty.findMany.mockResolvedValue(faculties);

        const apiFaculties = await trpc.utils.facilities();

        expect(apiFaculties).toEqual(faculties);

    });
});

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateSemester(): Semester {
            return {
                id: faker.datatype.uuid(),
                name: faker.lorem.sentence(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
            };
        }

        const semesters = Array.from({length: 10}, generateSemester);

        prismaMock.semester.findMany.mockResolvedValue(semesters);

        const apiSemesters = await trpc.utils.semesters();

        expect(apiSemesters).toEqual(semesters);

    });
});

// export type File = {
//     id: string
//     url: string
//     altUrl: string | null
//     createdAt: Date
//     updatedAt: Date
//     deletedAt: Date | null
//     filename: string
//     userId: string | null
//     tutorId: string | null
//     materialId: string | null
//     tag: string | null
//     size: number
//   }

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateFile(): File {
            return {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: null,
                tutorId: null,
                materialId: null,
                tag: "image",
                size: faker.datatype.number(),
            }
        }

        const files = Array.from({length: 50}, generateFile);

        prismaMock.file.findMany.mockResolvedValue(files);

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateFile(): File {
            return {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: null,
                tutorId: null,
                materialId: null,
                tag: "image",
                size: faker.datatype.number(),
            }
        }

        const files = Array.from({length: 50}, generateFile);

        prismaMock.file.findMany.mockResolvedValue(files);

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});

describe('[GET] /api/v1/semesters', () => {

    it('Test get all', async () => {
        function generateFile(): File {
            return {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
                altUrl: faker.internet.url(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.past(),
                deletedAt: null,
                filename: faker.system.fileName(),
                userId: null,
                tutorId: null,
                materialId: null,
                tag: "image",
                size: faker.datatype.number(),
            }
        }

        const files = Array.from({length: 50}, generateFile);

        prismaMock.file.findMany.mockResolvedValue(files);

        const apiAvatars = await trpc.utils.getAvatars();

        expect(apiAvatars).toEqual(files);

    });
});
