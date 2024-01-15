// generate 3-grams from string
import {tokenize} from "lib/nlp";

export function generate3grams(text: string) {
    // prepare text
    text = prepareText(text);
    // generate 3-grams
    let result: string[] = [];
    // text.length is less or equal to 3
    if (text.length <= 3) {
        result.push(text);
        return result;
    }
    for (let i = 0; i < text.length - 2; i++) {
        result.push(text[i] + text[i + 1] + text[i + 2]);
    }
    return result;
}

export function prepareText(text: string) {
    text = text.toLowerCase();
    text = text.replace(/[^a-z0-9]/g, ' ');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
}

// split text into words
export function generateWords(text: string) {
    // prepare text
    text = prepareText(text);
    // split text
    return tokenize(text);
}

export function getDocument(text: string) {
    return {words: generateWords(text)};
}

