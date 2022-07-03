import {createParamDecorator} from "@storyofams/next-api-decorators";
import {NextApiRequest} from "next";
import {Session as Sess} from "next-auth";
import {getSession} from "next-auth/react";

export const NextSession = createParamDecorator<Promise<Sess | null>>(
    async (req) => {
        return await getSession({ req })
    }
);