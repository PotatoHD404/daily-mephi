import {Client} from '@notionhq/client'
import {env} from "../env";

const notion: Client =
    (global as any).notion || new Client({
        auth: env.NOTION_TOKEN,
    });

if (env.NODE_ENV !== 'production') {
    (global as any).notion = notion;
}

export {notion};
