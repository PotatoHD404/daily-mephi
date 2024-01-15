import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

beforeAll(async () => {
    console.log("Setting up tests...")
})

afterEach(async () => {
    if (process.env.NOTION_PRIVATE_PAGE === undefined) {
        throw new Error("NOTION_PRIVATE_PAGE is not defined")
    }
    // Query all pages in the database
    const response = await notion.databases.query({
        database_id: process.env.NOTION_PRIVATE_PAGE,
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
