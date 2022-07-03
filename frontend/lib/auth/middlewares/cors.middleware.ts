import cors from "cors";

export type ALLOWED_METHODS = "PATCH" | "PUT" | "DELETE" | "OPTIONS" | "GET" | "POST";
export const ALLOWED_METHODS = ["PATCH", "PUT", "DELETE", "OPTIONS", "GET", "POST"];

export const Cors = cors({
    credentials: true,
    origin: [process.env.NEXT_PUBLIC_PROD_ORIGIN!, process.env.DEV_ORIGIN!],
    methods: ALLOWED_METHODS,
});