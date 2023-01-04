import {t} from 'lib/trpc';
import {generateOpenApiDocument} from "trpc-openapi";
import {getBaseUrl} from "lib/trpc/utils";
import {utilsRouter} from "./utils";
import {commentsRouter} from "./comments";
import {filesRouter} from "./files";
import {materialsRouter} from "./materials";
import {newsRouter} from "./news";
import {quotesRouter} from "./quotes";
import {reviewsRouter} from "./reviews";
import {thumbnailsRouter} from "./thumbnails";
import {tutorsRouter} from "./tutors";
import {usersRouter} from "./users";

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
    utils: utilsRouter,
});

export type AppRouter = typeof appRouter;

export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'DailyMEPhI OpenAPI',
    version: '2.0.0',
    baseUrl: getBaseUrl() + "/api/v2",
})
