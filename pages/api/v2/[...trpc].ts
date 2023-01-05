import { createOpenApiNextHandler } from "trpc-openapi";
import {appRouter} from "server";
import {createContext} from "lib/trpc/context";

export default createOpenApiNextHandler({
    router: appRouter,
    createContext,
    onError({ error }) {
        if (error.code === 'INTERNAL_SERVER_ERROR') {
            // send to bug reporting
            console.error('Something went wrong', error);
        }
    },
});
