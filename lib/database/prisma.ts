import {PrismaClient} from '@prisma/client';
import {env} from "../env";
// import {createPrismaRedisCache} from "prisma-redis-middleware";
// import {redis} from "./redis";

let notInitialized = (global as any).prisma === undefined;
const prisma: PrismaClient =
    (global as any).prisma || new PrismaClient();

if (env.NODE_ENV !== 'production') {
    (global as any).prisma = prisma;
}

if (notInitialized) {
    prisma.$use(async (params, next) => {
        // Check incoming query type
        // check if params.model not starts with underscore
        if (!params.model?.startsWith('_')) {
            if (params.action == 'delete') {
                // Delete queries
                // Change action to an update
                params.action = 'update'
                params.args['data'] = {deletedAt: new Date()}
            }
            if (params.action == 'deleteMany') {
                // Delete many queries
                params.action = 'updateMany'
                if (params?.args?.data != undefined) {
                    params.args.data['deletedAt'] = new Date()
                } else {
                    if (params.args === undefined) {
                        params.args = {}
                    }
                    params.args['data'] = {deletedAt: new Date()}
                }
            }
        }
        return next(params)
    })

    // const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    //     models: [
    //         // { model: "User", excludeMethods: ["findMany"] },
    //         // { model: "Post", cacheTime: 180, cacheKey: "article" },
    //     ],
    //     storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 300 }, log: console } },
    //     cacheTime: 300,
    //     excludeModels: ["Product", "Cart"],
    //     excludeMethods: ["count", "groupBy"],
    //     // onHit: (key) => {
    //     //     console.log("hit", key);
    //     // },
    //     // onMiss: (key) => {
    //     //     console.log("miss", key);
    //     // },
    //     // onError: (key) => {
    //     //     console.log("error", key);
    //     // },
    // });
    //
    // prisma.$use(cacheMiddleware);
}

// if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
// } else {
//     // @ts-ignore
//     if (!global.prisma) {
//         // @ts-ignore
//
//         global.prisma = new PrismaClient({log: ['query']});
//         // global.prisma = new PrismaClient();
//         // @ts-ignore
//         global.prisma.$connect();
//
//     }
//     // @ts-ignore
//
//     prisma = global.prisma;
// }


export {prisma};
