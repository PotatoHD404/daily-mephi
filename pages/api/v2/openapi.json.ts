import {NextApiRequest, NextApiResponse} from "next";
import {openApiDocument} from "server";

let json = openApiDocument;
// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Content-Type", "application/json");
    // pretty format json
    res.send(JSON.stringify(json, null, 2));
};

export default handler;
