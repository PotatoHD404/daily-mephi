import https from "https";
import {URL} from "url";
import {ClientRequest} from "http";
import argon2 from "argon2";


export function doRequest(options: string | https.RequestOptions | URL): Promise<string | Error> {
    return new Promise((resolve, reject) => {
        const req: ClientRequest = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody: string = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(responseBody);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        // req.write(data)
        req.end();
    });
}

export async function hash(pass: string): Promise<string> {
    if (process.env.HASH_PEPPER === undefined
        || process.env.HASH_SALT === undefined
        || process.env.HASH_MEMORY_COST === undefined
        || process.env.HASH_TYPE === undefined
        || process.env.HASH_TIME_COST === undefined
        || process.env.HASH_PARALLELISM === undefined)
        throw new Error('There is no some environment variables');
    let hash_type: 0 | 1 | 2 | undefined;
    if (process.env.HASH_TYPE === '0')
        hash_type = argon2.argon2d;
    else if (process.env.HASH_TYPE === '1')
        hash_type = argon2.argon2i;
    else
        hash_type = argon2.argon2id;
    return (await argon2.hash(pass, {
        memoryCost: +process.env.HASH_MEMORY_COST,
        parallelism: +process.env.HASH_PARALLELISM,
        type: hash_type,
        timeCost: +process.env.HASH_TIME_COST,
        secret: Buffer.from(process.env.HASH_PEPPER, 'utf8'),
        salt: Buffer.from(process.env.HASH_SALT, 'utf8'),
        raw: true
    })).toString('base64');
}
