import {z} from 'zod';
import {t} from 'lib/trpc';

// https://github.com/jlalmes/trpc-openapi

export const utilsRouter = t.router({
    search: t.procedure.meta({openapi: {method: 'GET', path: '/search'}}).input(z.void()).output(z.any()).query(() => {
        return "search";
    }),
    disciplines: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/disciplines'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "disciplines";
    }),
    facilities: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/facilities'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "facilities";
    }),
    semesters: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/semesters'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "semesters";
    }),
    reactions: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/reactions'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "reactions";
    }),
    getAvatars: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/get_avatars'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "get_avatars";
    }),
    top: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/top'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "top";
    }),
    calculateScore: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/calculate_score'
        }
    }).input(z.void()).output(z.any()).query(() => {
        return "calculate_score";
    })
});
