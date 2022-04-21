// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "reflect-metadata"
import type {NextApiRequest, NextApiResponse} from 'next'
import {CommentsService} from "lib/api/comments/comments.service";
import {autoInjectable} from "tsyringe";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {

    @autoInjectable()
    class Test1 {
        constructor(public database?: CommentsService) {}
        // constructor(
        //     @InjectMany(id) private sensorTypes: any[],
        // ) {}


    }

    const tmp = new Test1();

    // console.log(tmp.subcommands);

    // const db = getDb();
    // await db.connect()
    res.status(200).json('host');
}
