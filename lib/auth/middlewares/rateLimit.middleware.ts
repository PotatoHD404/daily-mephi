import rateLimit from "express-rate-limit";

export const RateLimit = rateLimit({
    skip: (req) => {
        // don't limit /api/notes
        const skipRoutes : string[] = [];

        return req.method === "GET" && skipRoutes.some((v) => v === req.url);


    },
    windowMs: 5 * 60 * 1000,
    max: 500,
});