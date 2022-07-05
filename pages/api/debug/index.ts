// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from "@prisma/client";
import prisma from "../../../lib/database/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    // const allUsers = {status: "ok"}
    let allUsers = await prisma.user.findMany(
    )

    // allUsers = await prisma.user.findMany(
    // )

    // use `console.dir` to print nested objects
    // console.dir(, {depth: null})
    res.status(200).json(allUsers);
}
