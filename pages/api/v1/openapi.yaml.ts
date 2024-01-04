import {NextApiRequest, NextApiResponse} from "next";
import {openApiDocument} from "../../../server";
import YAML from "yaml";

const doc = new YAML.Document();
// @ts-ignore
doc.contents = openApiDocument;
// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {

    res.setHeader("Content-Type", "application/yaml");
    // pretty format json
    res.send(doc.toString());
};

export default handler;
