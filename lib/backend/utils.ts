import https from "https";
import {URL} from "url";
import {ClientRequest} from "http";


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

