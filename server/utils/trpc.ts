import {createTRPCClient, httpBatchLink, loggerLink} from '@trpc/client';
import {createTRPCNext} from '@trpc/next';

import superjson from 'superjson';
import type {AppRouter} from "server";
import {inferRouterInputs, inferRouterOutputs} from "@trpc/server";
import {env} from "../../lib/env";
import {createServerSideHelpers} from "@trpc/react-query/server";

export function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return '';
    }
    // reference for vercel.com
    if (env.VERCEL_URL) {
        return `https://${env.VERCEL_URL}`;
    }

    // // reference for render.com
    if (env.RENDER_INTERNAL_HOSTNAME) {
        return `http://${env.RENDER_INTERNAL_HOSTNAME}:${env.PORT}`;
    }

    // assume localhost
    return `http://localhost:${env.PORT ?? 3000}`;
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
    config() {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        return {
            /**
             * @link https://trpc.io/docs/data-transformers
             */
            transformer: superjson,
            /**
             * @link https://trpc.io/docs/links
             */
            links: [
                // adds pretty logs to your console in development and logs errors in production
                loggerLink({
                    enabled: (opts) =>
                        env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/v2`,
                }),
            ],
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            queryClientConfig: {
                defaultOptions: {
                    queries: {
                        staleTime: 0,
                        gcTime: 0,
                        // refetchOnWindowFocus: false,
                        // enabled: false
                    }
                }
            },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: true,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const proxyClient = createTRPCClient<AppRouter>({
    transformer: superjson,
    /**
     * @link https://trpc.io/docs/links
     */
    links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
            enabled: (opts) =>
                env.NODE_ENV === 'development' ||
                (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
            url: `${getBaseUrl()}/api/v2`,
        }),
    ],
})

export const proxyHelpers = createServerSideHelpers({
    client: proxyClient
});