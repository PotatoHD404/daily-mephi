import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";


// DATABASE_URL31="postgresql://potatohd:bgg81W6wH5Bvtb5iG9-IBg@free-tier13.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dforest-frog-2669"
// DATABASE_URL2="postgresql://potatohd:qzJosUOCbjvZKWg3ryoVvg@wolf-mammal-8408.7tc.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
// DATABASE_URL="postgresql://root@127.0.0.1:26258/defaultdb?sslmode=disable"
// DATABASE_URL1="postgresql://root@127.0.0.1:26257/defaultdb?sslmode=disable"
// LOCAL="true"
//
// NEXTAUTH_SECRET="V7hE9ryvTyugdm8RCnJB46qW26hPtYsg"
// HASH_SECRET="Am3c]N?Ho5g?D\M0(`F.hEz<hx\V'.;8o"
// HASH_SALT="dD7fSH;JjMGW`C4$T,u8;O;5'tI(B^`"
// HASH_MEMORY_COST="37888"
// HASH_TYPE="2"
// HASH_TIME_COST="3"
// HASH_PARALLELISM="1"
// AES_NONCE="PgkWLi0eaDq357Viaw"
// AES_KEY256="4kgv1m1x91JUfkcGAz-sCCtoekCmju7xhD11boYeCbI"
// NEXTAUTH_URL1="https://347a-188-32-238-99.eu.ngrok.io"
// JWT_PRIVATE="zX8jnjG8cJGXhfec4VdYXC5EpHFCFZTHQasw8BSEzg9ffYkQj85dbZQLcvmHE2TW"
// NOTION_TOKEN="secret_VfjmerP6b308orVtgLExKD3Ssmfqnv2pkPKFxCU56Vo"
// NOTION_PRIVATE_PAGE="d8c2e5c5-4914-452d-963b-d3718defa035"
// NOTION_TOKEN_V2="e0518f03a2a1b82f1a645747b53b9b9a02a995c87e514f5591dbda12e7c1492bff1db2a10d3ef069895d827f2a47e517873906a5913c048139f778ebdf890f6c695c89499702c373383f61ff5c5e"
// NOTION_EMAIL="kornachuk.mark@gmail.com"
// NOTION_PASSWORD="HL.@c4;5BzP[%h\"s6xNMYEV="
// NOTION_YC_IDS="['d4eq4auta4ibjogc54f0']"
// RECAPTCHA_SECRET="6LdfAGAeAAAAAM22mov5IYUhvcWWvyx-PZlIbjY-"
// NEXT_PUBLIC_RECAPTCHA_PUBLIC="6LdfAGAeAAAAAGqxZV9-Jpqc5uJ2wQLP6dD7t-zq"
// DATABASE_KEY="y52K+66iTBFYUH9UXYwqV5BddpxjcguHpY+PLTGtfm8="
// REDIS_PORT="10259"
// REDIS_HOST="redis-10259.c250.eu-central-1-1.ec2.cloud.redislabs.com"
// REDIS_USERNAME="default"
// REDIS_PASSWORD="Da24bwQ0IZru3qLjN8QmRkfXRTxFSvnq"
// ANALYZE="false"
//
// GOOGLE_API_KEY="AIzaSyBCrJA_-EntBGTBtrXopjhgYCzfo71cAyc"

// authorization: `https://oauth.vk.com/authorize?scope=email&v=${vkApiVersion}`,
//     token: `https://oauth.vk.com/access_token?v=${vkApiVersion}`,
//     userinfo: `https://api.vk.com/method/users.get?fields=photo_100&v=${vkApiVersion}`,
//     clientId: '',
//     clientSecret: ''
// }),
// GoogleProvider({
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET
// }),
//     YandexProvider({
//         clientId: process.env.YANDEX_CLIENT_ID,
//         clientSecret: process.env.YANDEX_CLIENT_SECRET

export const env = createEnv({
    /*
     * Serverside Environment variables, not available on the client.
     * Will throw if you access these variables on the client.
     */
    server: {
        DATABASE_URL: z.string().min(1),
        LOCAL: z.string().min(1).optional(),
        NEXTAUTH_SECRET: z.string().min(1),
        HASH_SECRET: z.string().min(1),
        HASH_SALT: z.string().min(1),
        HASH_MEMORY_COST: z.string().min(1),
        HASH_TYPE: z.string().min(1),
        HASH_TIME_COST: z.string().min(1),
        HASH_PARALLELISM: z.string().min(1),
        AES_NONCE: z.string().min(1),
        AES_KEY256: z.string().min(1),
        JWT_PRIVATE: z.string().min(1),
        NOTION_TOKEN: z.string().min(1),
        NOTION_PRIVATE_PAGE: z.string().min(1),
        NOTION_TOKEN_V2: z.string().min(1),
        NOTION_EMAIL: z.string().min(1),
        NOTION_PASSWORD: z.string().min(1),
        NOTION_YC_IDS: z.string().min(1),
        RECAPTCHA_SECRET: z.string().min(1),
        DATABASE_KEY: z.string().min(1),
        GOOGLE_API_KEY: z.string().min(1),
        VK_CLIENT_ID: z.string().min(1),
        VK_CLIENT_SECRET: z.string().min(1),
        YANDEX_CLIENT_ID: z.string().min(1),
        YANDEX_CLIENT_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
    },
    /*
     * Environment variables available on the client (and server).
     *
     * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
     */
    client: {
        NEXT_PUBLIC_RECAPTCHA_PUBLIC: z.string().min(1),
    },
    /*
     * Due to how Next.js bundles environment variables on Edge and Client,
     * we need to manually destructure them to make sure all are included in bundle.
     *
     * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        LOCAL: process.env.LOCAL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        HASH_SECRET: process.env.HASH_SECRET,
        HASH_SALT: process.env.HASH_SALT,
        HASH_MEMORY_COST: process.env.HASH_MEMORY_COST,
        HASH_TYPE: process.env.HASH_TYPE,
        HASH_TIME_COST: process.env.HASH_TIME_COST,
        HASH_PARALLELISM: process.env.HASH_PARALLELISM,
        AES_NONCE: process.env.AES_NONCE,
        AES_KEY256: process.env.AES_KEY256,
        JWT_PRIVATE: process.env.JWT_PRIVATE,
        NOTION_TOKEN: process.env.NOTION_TOKEN,
        NOTION_PRIVATE_PAGE: process.env.NOTION_PRIVATE_PAGE,
        NOTION_TOKEN_V2: process.env.NOTION_TOKEN_V2,
        NOTION_EMAIL: process.env.NOTION_EMAIL,
        NOTION_PASSWORD: process.env.NOTION_PASSWORD,
        NOTION_YC_IDS: process.env.NOTION_YC_IDS,
        RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET,
        DATABASE_KEY: process.env.DATABASE_KEY,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        VK_CLIENT_ID: process.env.VK_CLIENT_ID,
        VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET,
        YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID,
        YANDEX_CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        NEXT_PUBLIC_RECAPTCHA_PUBLIC: process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC,
    },
});