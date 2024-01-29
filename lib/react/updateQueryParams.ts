import {NextRouter} from "next/router";

export const updateQueryParamsFactory = <T extends Record<string, unknown>>(
    router: NextRouter
) => async (newParams: T, pathname?: string) => {
    const currentPath = pathname ?? router.pathname;
    const currentQuery = { ...router.query, ...newParams }; // Merge current query params with new ones
    await router.push({
        pathname: currentPath,
        query: currentQuery,
    });
};