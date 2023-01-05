import {ClientRequest} from "http";
import https from "https";
import * as fs2 from 'fs'
import {promises as fs} from 'fs'
import path from 'path'
import {createHash} from "crypto";
import {NextApiRequest} from "next";


export function defaultCookies(useSecureCookies: boolean) {
    const cookiePrefix = useSecureCookies ? "__Secure-" : ""
    return {
        // default cookie options
        sessionToken: {
            name: `${cookiePrefix}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        callbackUrl: {
            name: `${cookiePrefix}next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        csrfToken: {
            // Default to __Host- for CSRF token for additional protection if using useSecureCookies
            // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
            name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        pkceCodeVerifier: {
            name: `${cookiePrefix}next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        state: {
            name: `${cookiePrefix}next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        nonce: {
            name: `${cookiePrefix}next-auth.nonce`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        }
    }
}

export function checkStatus(options: https.RequestOptions, data?: any): Promise<{ code: number | undefined, redirect: string | undefined }> {
    return new Promise((resolve, reject) => {
        if (data) {
            data = JSON.stringify(data);
            if (!options.headers)
                options.headers = {}
            options.headers['Content-Length'] = data.length;
            options.headers['Content-Type'] = 'application/json';
        }
        const req: ClientRequest = https.request(options, (res) => {
            resolve({code: res.statusCode, redirect: res.headers['location']});
        });

        req.on('error', (err) => {
            throw err;
        });
        if (data)
            req.write(data);
        req.end();
    });
}

export async function getCache(id: string, name: string): Promise<any | null | undefined> {
    const data = await fs.readFile(path.join(process.cwd(), `/tmp/${name}.json`));
    const products: any = JSON.parse(data as unknown as string)

    return products.find((el: { id: string; }) => el.id === id)
}

export async function setCache(products: any[], name: string) {
    if (!fs2.existsSync(path.join(process.cwd(), '/tmp/'))) {
        fs2.mkdirSync(path.join(process.cwd(), '/tmp/'));
    }
    return await fs.writeFile(
        path.join(process.cwd(), `/tmp/${name}.json`),
        JSON.stringify(products)
    )
}

export function getHost() {
    // If we detect a Vercel environment, we can trust the host
    // if (process.env.VERCEL) return forwardedHost
    // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
    // return process.env.NEXTAUTH_URL
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}


export const camelToSnakeCase = (str: string) =>
    str.replace(/^[A-Z]/g, letter => letter.toLowerCase())
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// export const nextOptions = (await NextAuth(nextAuthOptions)).options;

export function verifyCSRFToken(req: NextApiRequest) {
    const nextOptions: any = {
        ...defaultCookies(
            req.url?.startsWith("https://") ?? false
        ),
        secret: process.env.NEXTAUTH_SECRET,
    };

    const cookieValue = req.cookies[nextOptions.csrfToken.name];
    const {csrfToken: bodyValue} = req.body;
    if (!cookieValue || !bodyValue) {
        return false;
    }
    const [csrfToken, csrfTokenHash] = cookieValue.split("|")
    const expectedCsrfTokenHash = createHash("sha256")
        .update(`${csrfToken}${nextOptions.secret}`)
        .digest("hex")

    if (csrfTokenHash === expectedCsrfTokenHash) {
        // If hash matches then we trust the CSRF token value
        // If this is a POST request and the CSRF Token in the POST request matches
        // the cookie we have already verified is the one we have set, then the token is verified!
        return csrfToken === bodyValue;
    }
    return false;
}

export async function verifyRecaptcha(req: NextApiRequest) {
    const {recaptchaToken: token} = req.body;
    if(!process.env.RECAPTCHA_SECRET) {
        throw new Error('RECAPTCHA_SECRET is not defined')
    }

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    return data.success && data.score >= 0.5;
}

export function timeout(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
