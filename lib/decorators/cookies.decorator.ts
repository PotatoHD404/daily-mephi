import {createParamDecorator} from '@storyofams/next-api-decorators';
import { NextApiRequest } from 'next';

export const Cookies = createParamDecorator<NextApiRequest["cookies"]>(
    req => {
        return req.cookies
    }
);

export const Cookie = (name: string) => createParamDecorator<string | undefined>(
    req => {
        return req.cookies[name]
    }
);