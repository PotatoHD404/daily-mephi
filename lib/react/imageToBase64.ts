import {StaticImageData} from "next/image";
import {env} from "../env";

export function normalizeUrl(url: string | StaticImageData | null | undefined, alt: StaticImageData | string | null, normalize: boolean = false): string {
    let res: string | null = null;
    const domain = env.NEXTAUTH_URL ?? "http://localhost:3000";
    if (typeof url === "string") {
        res = url;
    } else if (url !== null && url?.src !== undefined) {
        res = domain + url.src;
    }
    if (res === null) {
        res = normalizeUrl(alt, null);
    }
    if (normalize) {
        res = domain + res;
    }
    return res;
}

export async function imageToBase64(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer()
    return "data:" + response.headers.get("content-type") + ";base64," + Buffer.from(buffer).toString('base64');
}
