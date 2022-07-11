"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.handler = void 0;
const ___next_launcher_cjs_1 = __importDefault(require("./api/auth/[...nextauth].func/___next_launcher.cjs"));
const serverless_http_1 = __importDefault(require("serverless-http"));

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseJson(str) {
    if (str.length === 0) {
        // special-case empty json body, as it's a common client-side mistake
        return {}
    }

    try {
        return JSON.parse(str)
    } catch (e) {
        throw new Error('Invalid JSON')
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function parseParams(body) {
    const entries = (new URLSearchParams(body)).entries();
    const result = {}
    for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}

let slsHandler;

async function handler(event, context) {
    // if(event.method === "POST")  {
    //     console.log("We are here")
    //     console.log(event)
    // }
    event.path = event["url"].split("?")[0]
    if (!slsHandler) {
        const app = {
            handle: (request, response) => {
                request.headers = {};
                // for (const [key, value] of Object.entries(event.headers)) {
                //     headers.append(key.toLowerCase(), value);
                // }
                for (const [key, value] of Object.entries(request.apiGateway.event.multiValueHeaders)) {
                    request.headers[key.toLowerCase()] = value.join("; ")
                }

                request.rawHeaders = [];
                Object.entries(request.headers).forEach(([key, value]) => {
                    request.rawHeaders.push(capitalizeFirstLetter(key), value)
                })
                if (request.upgrade === null)
                    request.upgrade = false;
                const type = request.headers['content-type']
                if (type !== undefined) {
                    const body = request.apiGateway.event.isBase64Encoded ? b64DecodeUnicode(request.apiGateway.event.body) : request.apiGateway.event.body;
                    if (type === 'application/json' || type === 'application/ld+json') {
                        request.body = parseJson(body)
                    } else if (type === 'application/x-www-form-urlencoded') {
                        request.body = parseParams(body)
                    } else {
                        request.body = body
                    }
                }

                // console.log(request)
                // if ('cookie' in headers) {
                //     request['cookie'] = request[Symbol('kHeaders')].length
                return (0, ___next_launcher_cjs_1.default)(request, response)
            }
        };
        slsHandler = (0, serverless_http_1.default)(app);
    }
    return await slsHandler(event, context);
}

exports.handler = handler;
