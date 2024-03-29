import {z} from 'zod';
import {t} from 'server/utils';
import {extToMimes} from "lib/constants/extToMimes";
import jwt, {JwtPayload} from "jsonwebtoken";
import {func_ids} from "lib/constants/notionFuncIds";
import {TRPCError} from "@trpc/server";
import {isAuthorized} from "server/middlewares/isAuthorized";
import {verifyCSRFToken} from "server/middlewares/verifyCSRFToken";
import {verifyRecaptcha} from "server/middlewares/verifyRecaptcha";
import {timeout} from "lib/utils";
import {env} from "../../lib/env";


async function getNotionToken() {
    return env.NOTION_TOKEN_V2 ?? ""
    /*let token_v2: string | null = null;
    const db_token_data = await prisma.internal.findUnique({where: {name: 'notion_token_v2'}});

    let expires: Date | null = null;

    if (db_token_data) {
        let {value: enc_token} = db_token_data;
        expires = db_token_data.expires
        try {
            token_v2 = await decrypt(enc_token, env.DATABASE_KEY);
        } catch (e) {
        }
    }
    const d = new Date();
    d.setHours(d.getHours() - 24);
    let res1: Response
    if (!expires || expires < d || !token_v2) {
        token_v2 = null
        let expires: Date | null = null;
        const {cookies} = await doRequest({
                hostname: 'www.notion.so',
                port: 443,
                path: `/api/v3/loginWithEmail`,
                method: 'POST',
            },
            {
                email: env.NOTION_EMAIL,
                password: env.NOTION_PASSWORD
            });
        token_v2 = cookies["token_v2"].value;
        expires = cookies["token_v2"].expires !== 'Infinity' ? cookies["token_v2"].expires : null;
        if (!token_v2)
            throw new Error('There is no token_v2');
        if (!expires)
            throw new Error('There is no expires');
        token_v2 = await encrypt(token_v2, env.DATABASE_KEY)

        await prisma.internal.upsert({
            where: {name: 'notion_token_v2'},
            create: {
                name: 'notion_token_v2',
                value: token_v2,
                expires: expires
            },
            update: {
                value: token_v2,
                expires: expires
            }
        });
    }
    return token_v2;*/
}

export const filesRouter = t.router({
    get: t.procedure.meta({
        openapi: {
            method: 'GET',
            path: '/files/{id}',
        }
    })
        .input(z.object({
            id: z.string().uuid(),
        }))
        /* .output(z.any()) */
        .query(({input: {id}, ctx: {prisma}}) => {
            return prisma.file.findUnique({
                where: {
                    id
                },
                select: {
                    filename: true,
                    url: true,
                    altUrl: true,
                    size: true,
                }
            });
        }),
    getLink: t.procedure.meta({
        openapi: {
            method: 'POST',
            path: '/files',
            protect: true
        }
    })
        .input(z.object({
            filename: z.string(),
            csrfToken: z.string(),
            recaptchaToken: z.string(),
        }))
        /* .output(z.any()) */
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({input: {filename}, ctx: {prisma, notion}}) => {
            const tmp = filename.split('.');
            let ext = tmp.pop();
            filename = tmp.join('.').substring(0, 64 - (ext ? ext.length + 1 : 0));
            if (filename === '') {
                filename = '.' + ext;
                ext = '';
            }

            const mime = extToMimes[ext as keyof typeof extToMimes] || 'text/plain';
            const destinationDatabaseId = env.NOTION_PRIVATE_PAGE;

            let block_id: string = '';
            let i: number;
            const properties = {
                "Name": {"title": [{"text": {"content": filename + (ext ? '.' + ext : '')}}]},
                "File": {
                    "files": [{
                        "name": filename + (ext ? '.' + ext : ''),
                        "external": {"url": 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d8c2e5c5-4914-452d-963b-d3718defa035/pending'}
                    }]
                },
            };
            if (destinationDatabaseId === undefined) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'NOTION_PRIVATE_PAGE is not defined'
                });
            }
            const parent_id = {"type": "database_id" as const, "database_id": destinationDatabaseId};
            let new_page;
            for (i = 0; i < 3; ++i) {
                try {
                    new_page = await notion.pages.create({parent: parent_id, properties: properties});
                    break;
                } catch (e) {
                    await timeout(500);
                    console.log("Notion is not responding");
                    console.log(e);
                }
            }

            if (i === 3) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Notion is not responding'
                });
            }
            let token_v2: string = await getNotionToken();


            let func_id: string

            const params = new URLSearchParams({
                block: block_id,
                token_v2,
                filename: filename + (ext ? '.' + ext : ''),
                mime,
                space_id: "0ef770c4-d60f-4f3b-bb1c-35398b2e65b8"
            });
            let url: string
            let res1: Response | null = null
            let ms = 200
            // console.log(url)
            while (!res1?.ok) {
                func_id = func_ids[Math.floor(Math.random() * func_ids.length)];
                url = `https://functions.yandexcloud.net/${func_id}?${params.toString()}`;
                // console.log(url)
                res1 = await fetch(url);
                if (!res1?.ok) {
                    await timeout(ms)
                    if (ms < 1000 * 60 * 15)
                        ms *= 2;
                    console.log("Retrying...")
                }
            }

            if (!res1.ok) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Yandex is not responding'
                });
            }
            const links = await res1.json();
            if (!env.JWT_PRIVATE) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'JWT_PRIVATE is not set'
                });
            }
            let token = jwt.sign({
                signedPutUrl: links['signedPutUrl'],
                block: block_id,
                ext,
                filename
            }, env.JWT_PRIVATE);
            return {token, signedGetUrl: links['signedGetUrl']};
        }),
    putFile: t.procedure.meta({
        openapi: {
            method: 'PUT',
            path: '/files',
            protect: true
        }
    })
        .input(z.object({
            token: z.string(),
            csrfToken: z.string(),
            recaptchaToken: z.string(),
        }))
        /* .output(z.any()) */
        .use(isAuthorized)
        .use(verifyCSRFToken)
        .use(verifyRecaptcha)
        .mutation(async ({input: {token}, ctx: {prisma, notion, user}}) => {
            if (!env.JWT_PRIVATE)
                throw new Error('Jwt key is undefined');
            let data: JwtPayload | string
            try {
                data = jwt.verify(token, env.JWT_PRIVATE);
            } catch (e) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Invalid token'
                });
            }

            const {
                signedPutUrl,
                block,
                ext,
                filename
            } = data as { signedPutUrl: string, block: string, ext: string, filename: string };
            const dbFile = await prisma.file.findFirst({where: {id: block}})
            if (dbFile) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'File already exists'
                });
            }
            const unsignedUrl: string = signedPutUrl.split('?')[0];
            // console.log(`https://www.notion.so/signed/${encodeURIComponent(unsignedUrl)}?table=block&cache=v2&id=${block}`)
            // console.log(unsignedUrl)
            // console.log(`https://www.notion.so/signed/${encodeURIComponent(unsignedUrl)}?table=block&cache=v2&id=${block}`)
            const res1 = await fetch(unsignedUrl, {
                method: 'HEAD',
            })
            const size = parseInt(res1.headers.get('content-length') || '0');
            if (!res1.ok || size === 0) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'The file is not uploaded'
                });
            }
            // find file size

            const isImage = ext.toLowerCase() === 'png' || ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg';
            const createdUrl = (isImage ? `https://www.notion.so/image/${encodeURIComponent(unsignedUrl)}?cache=v2` : unsignedUrl)

            // Retrieve the page
            // const page = await notion.pages.retrieve(block);
            // Update the page properties
            const properties = {
                "Name": {"title": [{"text": {"content": filename + (ext ? '.' + ext : '')}}]},
                "File": {"files": [{"name": filename + (ext ? '.' + ext : ''), "external": {"url": createdUrl}}]},
            };
            await notion.pages.update({
                page_id: block,
                properties: properties
            });

            await prisma.file.create({
                data: {
                    id: block,
                    url: createdUrl,
                    // altUrl: isImage ? unsignedUrl : undefined,
                    filename: filename + (ext ? '.' + ext : ''),
                    size,
                    user: user.id ? {connect: {id: user.id}} : undefined,
                    tag: "material"
                },
            });
            return {url: createdUrl};
        })

});
