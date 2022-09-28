const Config = require("../../.next-tf/config.json");
const yaml = require("js-yaml");
const fs = require("fs");

// Read the yaml config file
const result = {
    "openapi": "3.0.0",
    "info": {
        "title": "daily-mephi",
        "version": "1.0.0"
    },
    "paths": {}
};
const config = yaml.load(fs.readFileSync('./terraform/yandex-gateway.yaml', 'utf8'), {});

result.paths["/"] = {
    "get": {
        "x-yc-apigateway-integration": {
            "type": "object_storage",
            "bucket": "${bucket_name}",
            "object": "static/index.html",
            "presigned_redirect": true,
            "service_account_id": "${service_account_id}",
            "error_object": "static/404.html"
        },
        "summary": "Serve static file from Yandex Cloud Object Storage"
    }
}
for (const path of Config.staticRoutes) {
    // check if dot is in path
    if (!path.includes(".")) {
        result.paths[path] = {
            "get": {
                "x-yc-apigateway-integration": {
                    "type": "object_storage",
                    "bucket": "${bucket_name}",
                    "object": `static${path}.html`,
                    "presigned_redirect": true,
                    "service_account_id": "${service_account_id}",
                    "error_object": "static/404.html"
                },
                "summary": "Serve static file from Yandex Cloud Object Storage"
            }
        }
    }
}
console.log(Config.routes)
// add dynamic routes


// console.log(JSON.stringify(config, null, 2));
console.log(JSON.stringify(result, null, 2));
