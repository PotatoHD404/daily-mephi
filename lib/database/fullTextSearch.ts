// generate 3-grams from string
export function prepareText(text: string) {
    text = text.toLowerCase();
    text = text.replace(/[^a-zа-яё0-9"-]/g, ' ');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
}


export function convertGoogleQueryToTsQuery(googleQuery: string): string {
    // Split the query into parts based on spaces outside of quotes
    const mustBe = Array.from(googleQuery.matchAll(/"([^ ]+)"/g), (el) => el[1]);
    const mustNotBe = Array.from(googleQuery.matchAll(/-([^ ]+)/g), (el) => el[1])
        .map((part) => `!${part}`);
    // Process each part to convert it into a tsquery string

    // Join the processed parts using the & operator
    // Return the final tsquery string
    return mustBe.concat(mustNotBe).map(part => `${part}:*`).join(' & ')
}