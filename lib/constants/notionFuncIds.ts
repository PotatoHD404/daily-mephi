if (!process.env.NOTION_YC_IDS) {
    throw new Error('There is no notion_yc_ids');
}
export const func_ids = process.env.NOTION_YC_IDS.split(';');
