// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import https from 'https'
import {hostname} from "os";
import * as util from "util";
import {doRequest} from '../../lib/utils';
import {string} from "prop-types";

type Data = {
    res: string | null | undefined
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {ticket}: { [key: string]: string | string[]; } = req.query;
    if (ticket === undefined) {
        res.status(500).json({res: 'There is no ticket'});
        return;
    }
    const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
    const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
    const options: https.RequestOptions = {
        hostname: 'login.mephi.ru',
        port: 443,
        path: `/validate?service=${host}&ticket=${ticket}`,
        method: 'GET',
    };
    const response: string | Error = await doRequest(options);
    if (util.types.isNativeError(response)) {
        res.status(500).json({res: response.message})
        return;
    }
    const resArr: string[] = response.split('\n');
    if (resArr.length != 3) {
        res.status(500).json({res: 'There is an error 1: ' + response});
        return;
    }

    if (resArr[0] === 'yes') {
        const login: string = resArr[1];

    } else if (resArr[0] === 'no') {
        res.redirect(301, '/api/auth?error=true');
    } else {
        res.status(500).json({res: 'There is an error 2: ' + response});
    }

    // res.status(200).json({res: response})
}

// yes\nkmv026\n
// no\n\n