import crypto from "crypto";


export async function encrypt(plaintext: string): Promise<string> {
    if (process.env.AES_NONCE === undefined
        || process.env.AES_KEY256 === undefined)
        throw Error('There is no some environment variables');
    const key256: Buffer = Buffer.from(process.env.AES_KEY256, 'base64url');
    const nonce: Buffer = Buffer.from(process.env.AES_NONCE, 'base64url');
    const cipher = crypto.createCipheriv(
        "aes-256-ccm",
        key256,
        nonce,
        {
            authTagLength: 16
        });

    const ciphertext: string = cipher.update(plaintext, 'utf8').toString('base64');
    cipher.final();
    const authTag: string = cipher.getAuthTag().toString('base64');
    return ciphertext + authTag;
}

export async function decrypt(ciphertext: string): Promise<string> {
    if (process.env.AES_NONCE === undefined
        || process.env.AES_KEY256 === undefined)
        throw Error('There is no some environment variables');
    const key256: Buffer = Buffer.from(process.env.AES_KEY256, 'base64url');
    const nonce: Buffer = Buffer.from(process.env.AES_NONCE, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-ccm',
        key256,
        nonce,
        {
            authTagLength: 16
        });
    const authTag: Buffer = Buffer.from(ciphertext.split('=')[1] + '=', 'base64');
    decipher.setAuthTag(authTag);
    const realCiphertext: Buffer = Buffer.from(ciphertext.split('=')[0] + '=', 'base64')
    return decipher.update(realCiphertext).toString('utf8');

}

// Now transmit { ciphertext, nonce, tag }.