import { Client } from '@notionhq/client';
import {env} from "../../lib/env";
import {beforeAll, afterEach, afterAll} from '@jest/globals';

const notion = new Client({ auth: env.NOTION_TOKEN });

beforeAll(async () => {
    console.log("Setting up tests...")
})

afterEach(async () => {
    // Query all pages in the database
    const response = await notion.databases.query({
        database_id: env.NOTION_PRIVATE_PAGE,
    });



    // Delete all pages
    for (let result of response.results) {
        await notion.blocks.delete({ block_id: result.id });
    }
})

afterAll(async () => {
    console.log("All tests done.")
})

export { notion }
