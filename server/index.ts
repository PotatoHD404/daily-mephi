import {t} from 'lib/trpc';
import {generateOpenApiDocument} from "trpc-openapi";
import {getBaseUrl} from "lib/trpc/utils";
import {utilsRouter} from "./routers/utils";
import {commentsRouter} from "./routers/comments";
import {filesRouter} from "./routers/files";
import {materialsRouter} from "./routers/materials";
import {newsRouter} from "./routers/news";
import {quotesRouter} from "./routers/quotes";
import {reviewsRouter} from "./routers/reviews";
import {thumbnailsRouter} from "./routers/thumbnails";
import {tutorsRouter} from "./routers/tutors";
import {usersRouter} from "./routers/users";
import {searchRouter} from "./routers/search";

export const appRouter = t.router({
    comments: commentsRouter,
    files: filesRouter,
    materials: materialsRouter,
    news: newsRouter,
    quotes: quotesRouter,
    reviews: reviewsRouter,
    thumbnails: thumbnailsRouter,
    tutors: tutorsRouter,
    users: usersRouter,
    utils: t.mergeRouters(utilsRouter, searchRouter),
});

export type AppRouter = typeof appRouter;

export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'DailyMEPhI OpenAPI',
    version: '1.0.0',
    baseUrl: getBaseUrl() + "/api/v1",
})
