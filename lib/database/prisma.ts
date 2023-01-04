import {PrismaClient} from '@prisma/client';

let prisma: PrismaClient = new PrismaClient();

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
            if (params.args.data != undefined) {
                params.args.data['deletedAt'] = new Date()
            } else {
                params.args['data'] = {deletedAt: new Date()}
            }
        }
    }
    return next(params)
})

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

// @ts-ignore
export default prisma;
