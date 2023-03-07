import Redis from 'ioredis';


if (!process.env.REDIS_PORT ||
    !+process.env.REDIS_PORT ||
    !process.env.REDIS_HOST ||
    !process.env.REDIS_PASSWORD ||
    !process.env.REDIS_USERNAME) {
    throw new Error('There is no redis_port or redis_host or redis_password');
}
export const redis: Redis =
    (global as any).redis || new Redis({
        port: +process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: 0, // Defaults to 0
    });

if (process.env.NODE_ENV !== 'production') {
    (global as any).redis = redis;
}
