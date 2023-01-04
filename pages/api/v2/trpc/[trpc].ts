// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import {appRouter} from "server/_app";
import {createContext} from "lib/trpc/context";


// export API handler
export default createNextApiHandler({
    router: appRouter,
    createContext: createContext,
});
