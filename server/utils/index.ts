import {initTRPC} from '@trpc/server';
import superjson from 'superjson';
import {Context} from './context';
import {OpenApiMeta} from 'trpc-openapi';

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export {t};
