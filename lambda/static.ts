import * as path from "path";

const StaticFileHandler = require('serverless-aws-static-file-handler')


const clientFilesPath = path.join(__dirname, "./../.next")
const fileHandler = new StaticFileHandler(clientFilesPath)


module.exports.handler = async (event: { path: string; }, context: any) => {
    event.path = event.path.replace('/_next/', "")
    console.log(clientFilesPath, event.path)
    // event.path = "index.html" // forcing a specific page for this handler, ignore requested path. This would serve ./data-files/index.html
    return fileHandler.get(event, context)
}