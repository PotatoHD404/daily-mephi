import crypto from "crypto";
import argon2 from "argon2";
import {env} from "./env";


export async function encrypt(plaintext: string, key?: string): Promise<string> {
    if (!key)
        key = env.AES_KEY256;
    const key256: Buffer = Buffer.from(key, 'base64url');
    const nonce: Buffer = Buffer.from(env.AES_NONCE, 'base64url');
    const cipher = crypto.createCipheriv(
        "aes-256-ccm",
        key256,
        nonce,
        {
            authTagLength: 16
        });

    const ciphertext: Buffer = cipher.update(plaintext, 'utf8')
    cipher.final();
    const authTag: Buffer = cipher.getAuthTag()
    return Buffer.concat([ciphertext, authTag]).toString('base64');
}

export async function decrypt(ciphertext: string, key?: string): Promise<string> {
    if (!key)
        key = env.AES_KEY256;
    const key256: Buffer = Buffer.from(key, 'base64url');
    const nonce: Buffer = Buffer.from(env.AES_NONCE, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-ccm',
        key256,
        nonce,
        {
            authTagLength: 16
        });
    const buf: Buffer = Buffer.from(ciphertext, 'base64');
    const authTag: Buffer = buf.slice(-16);
    decipher.setAuthTag(authTag);
    const realCiphertext: Buffer = buf.slice(0, -16);
    const res: string = decipher.update(realCiphertext).toString('utf8');
    try {
        decipher.final();
    } catch (err) {
        throw new Error('Decryption failed');
    }
    return res;

}

export async function hash(pass: string, secret: string | undefined = undefined): Promise<string> {


    let hash_type: 0 | 1 | 2 | undefined;
    if (env.HASH_TYPE === '0')
        hash_type = argon2.argon2d;
    else if (env.HASH_TYPE === '1')
        hash_type = argon2.argon2i;
    else
        hash_type = argon2.argon2id;
    const pepper: string = secret ?? env.HASH_SECRET;
    return (await argon2.hash(pass, {
        memoryCost: +env.HASH_MEMORY_COST,
        parallelism: +env.HASH_PARALLELISM,
        type: hash_type,
        timeCost: +env.HASH_TIME_COST,
        secret: Buffer.from(pepper, 'utf8'),
        salt: Buffer.from(env.HASH_SALT, 'utf8'),
        raw: true
    })).toString('base64');
}

// Now transmit { ciphertext, nonce, tag }.
