import {t} from 'server/utils';
import {utilsRouter} from "./routers/utils";
import {commentsRouter} from "./routers/comments";
import {filesRouter} from "./routers/files";
import {materialsRouter} from "./routers/materials";
import {newsRouter} from "./routers/news";
import {quotesRouter} from "./routers/quotes";
import {reviewsRouter} from "./routers/reviews";
import {tutorsRouter} from "./routers/tutors";
import {usersRouter} from "./routers/users";
import {searchRouter} from "./routers/search";
import {reactionsRouter} from "./routers/reactions";
import {createServerSideHelpers} from "@trpc/react-query/server";
import superjson from "superjson";
import {createContext} from "./utils/context";

export const appRouter = t.router({
    comments: commentsRouter,
    files: filesRouter,
    materials: materialsRouter,
    news: newsRouter,
    quotes: quotesRouter,
    reactions: reactionsRouter,
    reviews: reviewsRouter,
    tutors: tutorsRouter,
    users: usersRouter,
    utils: t.mergeRouters(utilsRouter, searchRouter),
});

export type AppRouter = typeof appRouter;

export const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson, // optional - adds superjson serialization
});
