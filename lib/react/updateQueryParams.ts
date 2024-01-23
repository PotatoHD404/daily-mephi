import {NextRouter} from "next/router";

export const updateQueryParamsFactory = <T extends Record<string, unknown>>(
    router: NextRouter
) => (newParams: T) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query, ...newParams }; // Merge current query params with new ones
    router.push({
        pathname: currentPath,
        query: currentQuery,
    });
};