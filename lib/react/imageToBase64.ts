import {StaticImageData} from "next/future/image";

export function normalizeUrl(url: string | StaticImageData | null, alt: StaticImageData | null): string {
    let res: string | null = null;
    if (typeof url === "string") {
        res = url;
    } else if (url !== null && url?.src !== undefined) {
        const domain = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
        res = domain + url.src;
    }
    if (res === null) {
        res = normalizeUrl(alt, null);
    }
    return res;
}
export async function imageToBase64(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer()
    return "data:" + response.headers.get("content-type") + ";base64," + Buffer.from(buffer).toString('base64');
}
