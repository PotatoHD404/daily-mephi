import crypto from "crypto";
import argon2 from "argon2";


export async function encrypt(plaintext: string, key?: string): Promise<string> {
    if (process.env.AES_NONCE === undefined
        || process.env.AES_KEY256 === undefined)
        throw new Error('There is no some environment variables');
    if (!key)
        key = process.env.AES_KEY256;
    const key256: Buffer = Buffer.from(key, 'base64url');
    const nonce: Buffer = Buffer.from(process.env.AES_NONCE, 'base64url');
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
    if (process.env.AES_NONCE === undefined
        || process.env.AES_KEY256 === undefined)
        throw new Error('There is no some environment variables');
    if (!key)
        key = process.env.AES_KEY256;
    const key256: Buffer = Buffer.from(key, 'base64url');
    const nonce: Buffer = Buffer.from(process.env.AES_NONCE, 'base64url');
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
    if (process.env.HASH_SECRET === undefined
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
    const pepper: string = secret ?? process.env.HASH_SECRET;
    return (await argon2.hash(pass, {
        memoryCost: +process.env.HASH_MEMORY_COST,
        parallelism: +process.env.HASH_PARALLELISM,
        type: hash_type,
        timeCost: +process.env.HASH_TIME_COST,
        secret: Buffer.from(pepper, 'utf8'),
        salt: Buffer.from(process.env.HASH_SALT, 'utf8'),
        raw: true
    })).toString('base64');
}

// Now transmit { ciphertext, nonce, tag }.
