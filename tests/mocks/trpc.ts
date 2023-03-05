import {appRouter} from "../../server";
import {prisma} from "lib/database/prisma";
import {notion} from "lib/database/notion";

// req: NextApiRequest; res: NextApiResponse<any>; prisma: PrismaClient<PrismaClientOptions, never, RejectOnNotFound | RejectPerOperation | undefined>; notion: Client


const ctx = {
    req: {} as any,
    res: {} as any,
    prisma,
    notion
}
export const trpc = appRouter.createCaller(ctx)

