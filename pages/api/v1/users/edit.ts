// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";
import {getToken} from "next-auth/jwt";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if(req.method !== "PUT"){
        res.status(405).json({status: "method not allowed"});
        return;
    }
    const {name, image} = req.body;
    const {new_user} = req.query;
    if(!new_user && (!name && !image) || new_user && (!name || !image)){
        res.status(400).json({status: "bad request"});
        return;
    }
    const session = await getToken({req})
    if (!session?.sub) {
        res.status(401).json({status: 'You are not authenticated'});
        return;
    }
    // const allUsers = {status: "ok"}
    await prisma.user.update({
            where:{
                id: session.sub
            },
            data: {
                name,
                image,
            }
        }
    )

    res.status(200).json({status: "ok"});
}
