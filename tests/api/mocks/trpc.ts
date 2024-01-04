import {appRouter} from "server";
import {prisma} from "lib/database/prisma";
import {notion} from "lib/database/notion";
import {createCallerFactory} from "@trpc/server";

// req: NextApiRequest; res: NextApiResponse<any>; prisma: PrismaClient<PrismaClientOptions, never, RejectOnNotFound | RejectPerOperation | undefined>; notion: Client


const ctx = {
    req: {} as any,
    res: {setHeader: jest.fn(), end: jest.fn()} as any,
    prisma,
    notion
}
const createCaller = createCallerFactory()(appRouter);

export const trpc = createCaller(ctx)

