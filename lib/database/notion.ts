import {Client} from '@notionhq/client'

const notion: Client =
    (global as any).notion || new Client({
        auth: process.env.NOTION_TOKEN,
    });

if (process.env.NODE_ENV !== 'production') {
    (global as any).notion = notion;
}

export { notion };
