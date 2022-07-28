import {Client} from '@notionhq/client'

let notion: Client;

if (process.env.NODE_ENV === 'production') {
    notion = new Client({
        auth: process.env.NOTION_TOKEN,
    });
} else {
    // @ts-ignore
    if (!global.notion) {
        // @ts-ignore
        global.notion = new Client({
            auth: process.env.NOTION_TOKEN,
        });
    }
    // @ts-ignore
    notion = global.notion;
}

export default notion;
