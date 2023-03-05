import {t} from 'server/trpc';
import {generateOpenApiDocument} from "trpc-openapi";
import {getBaseUrl} from "server/trpc/utils";
import {utilsRouter} from "./routers/utils";
import {commentsRouter} from "./routers/comments";
import {filesRouter} from "./routers/files";
import {materialsRouter} from "./routers/materials";
import {newsRouter} from "./routers/news";
import {quotesRouter} from "./routers/quotes";
import {reviewsRouter} from "./routers/reviews";
import {thumbnailsRouter} from "./routers/thumbnails";
import {tutorsRouter} from "./routers/tutors";
import {usersRouter} from "./routers/users";
import {searchRouter} from "./routers/search";

export const appRouter = t.router({
    comments: commentsRouter,
    files: filesRouter,
    materials: materialsRouter,
    news: newsRouter,
    quotes: quotesRouter,
    reviews: reviewsRouter,
    thumbnails: thumbnailsRouter,
    tutors: tutorsRouter,
    users: usersRouter,
    utils: t.mergeRouters(utilsRouter, searchRouter),
});

export type AppRouter = typeof appRouter;

const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'DailyMEPhI OpenAPI',
    version: '1.0.0',
    baseUrl: getBaseUrl() + "/api/v1",
});

openApiDocument['paths']["/search"] = {
    "get": {
        "operationId": "query.utils.search",
        "security": [
            {
                "Authorization": []
            }
        ],
        "parameters": [
            {
                "name": "query",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            },
            {
                "name": "sort",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "enum": ["relevance", "time"],
                    "default": "relevance"
                }
            },
            {
                "name": "faculty_ids",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "string" // actually array
                }
            },
            {
                "name": "discipline_ids",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "string" // actually array
                }
            },
            {
                "name": "rating_from",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "integer"
                }
            },
            {
                "name": "rating_to",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "integer"
                }
            },
            {
                "name": "types",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "string" // actually array
                }
            },
            {
                "name": "limit",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "integer"
                }
            },
            {
                "name": "offset",
                "in": "path",
                "required": false,
                "schema": {
                    "type": "integer"
                }
            },
        ],
        "responses": {
            "200": {
                "description": "Successful response",
                "content": {
                    "application/json": {
                        "schema": {}
                    }
                }
            },
            "default": {
                "$ref": "#/components/responses/error"
            }
        }
    }
}

openApiDocument['paths']["/openapi.json"] = {
    "get": {
        "operationId": "openapi_json",
        "security": [
            {
                "Authorization": []
            }
        ],
        "parameters": [],
        "responses": {
            "200": {
                "description": "Successful response",
                "content": {
                    "application/json": {
                        "schema": {}
                    }
                }
            },
            "default": {
                "$ref": "#/components/responses/error"
            }
        }
    }
}

openApiDocument['paths']["/openapi.yaml"] = {
    "get": {
        "operationId": "openapi_yaml",
        "security": [
            {
                "Authorization": []
            }
        ],
        "parameters": [],
        "responses": {
            "200": {
                "description": "Successful response",
                "content": {
                    "application/yaml": {
                    }
                }
            },
            "default": {
                "$ref": "#/components/responses/error"
            }
        }
    }
}

export {openApiDocument};
