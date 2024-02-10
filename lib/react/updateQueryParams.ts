import {NextRouter} from "next/router";
import {deepEqual} from "./deepEqual";

export const updateQueryParamsFactory = <T extends Record<string, unknown>>(
    router: NextRouter
) => async (newParams: T, pathname?: string) => {
    const currentPath = pathname ?? router.pathname;
    const newQuery = { ...router.query, ...newParams }; // Merge current query params with new ones
    if (!deepEqual(router.query, newQuery)) {
        await router.push({
            pathname: currentPath,
            query: newQuery,
        });
    }
};