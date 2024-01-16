jest.mock('lib/database/prisma', () => ({
    __esModule: true,
    prisma: jestPrisma.client,
}))
