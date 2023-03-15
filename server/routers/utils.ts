import {z} from 'zod';
import {t} from 'server/trpc';

let epoch = new Date(1970, 1, 1);

function epoch_seconds(date: Date) {
    return date.getSeconds() - epoch.getSeconds();
}

function score(likes: number, dislikes: number) {
    return likes - dislikes;
}

function getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
}

function hot(likes: number, dislikes: number, date: Date) {
    let s = score(likes, dislikes);
    let order = getBaseLog(Math.max(Math.abs(s), 1), 10);
    let sign: number;
    if (s > 0) {
        sign = 1;
    } else if (s < 0) {
        sign = -1;
    } else {
        sign = 0;
    }
    let seconds = epoch_seconds(date) - 1134028003;
    return sign * order + seconds / 45000;
}

function confidence(likes: number, dislikes: number): number {
    const n = likes + dislikes;

    if (n === 0) {
        return 0;
    }

    const z = 1.281551565545;
    const p = likes / n;

    const left = p + 1 / (2 * n) * z * z;
    const right = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
    const under = 1 + 1 / n * z * z;

    return (left - right) / under;
}

export const utilsRouter = t.router({
    disciplines: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/disciplines'
        }
    })
        .input(z.void())
        .output(z.any())
        .query(async ({ctx: {prisma}}) => {
            return prisma.discipline.findMany();
        }),
    // departments: t.procedure.meta({
    //     openapi: {
    //         method: 'GET',
    //         path: '/departments'
    //     }
    // })
    //     .input(z.void())
    //     .output(z.any())
    //     .query(async ({ctx: {prisma}}) => {
    //         return prisma.departments.findMany();
    //     }),
    facilities: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/facilities'
        }
    })
        .input(z.void())
        .output(z.any())
        .query(async ({ctx: {prisma}}) => {
            return prisma.faculty.findMany();
        }),
    semesters: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/semesters'
        }
    })
        .input(z.void())
        .output(z.any())
        .query(async ({ctx: {prisma}}) => {
            return (await prisma.semester.findMany()).map(el => {
                el['name'] = el['name'][0];
                return el;
            });
        }),
    getAvatars: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/get_avatars'
        }
    })
        .input(z.void())
        .output(z.any())
        .query(async ({ctx: {prisma}}) => {
            return await prisma.file.findMany(
                {
                    where: {
                        tag: "avatar",
                        userId: null
                    },
                    select: {
                        url: true,
                        altUrl: true,
                    },
                }
            );
        }),
    top: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/top'
        }
    }).input(z.object({
        place: z.number().int().default(0),
        take: z.number().int().default(10),
    }))
        .output(z.any())
        .query(async ({ctx: {prisma}, input: {place, take}}) => {
            const userCount = await prisma.user.count();
            let skip: number;
            // show only take users
            // in such way that the user is in the middle
            if (userCount > take) {
                skip = Math.max(0, place - Math.floor(take / 2));
            } else {
                skip = 0;
            }
            let users = await prisma.user.findMany({
                    select: {
                        nickname: true,
                        id: true,
                        image: {
                            select: {
                                url: true
                            }
                        },
                        rating: true,
                    },
                    orderBy: {
                        rating: 'desc',
                    },
                    take,
                    skip
                }
            );
            return users.map((el, i) => {
                return {...el, place: i + skip + 1};
            });
        }),
    // calculateScore: t.procedure.meta({
    //     openapi: {
    //         method: 'GET',
    //         path: '/calculate_score',
    //         enabled: false
    //     }
    // })
    //     .input(z.void())
    //     .output(z.any())
    //     .query(async ({ctx: {prisma}}) => {
    //         return "calculate_score";
    //     })
});
