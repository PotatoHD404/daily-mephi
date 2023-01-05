import {PorterStemmerRu, WordTokenizer} from 'natural';


declare interface String {
    tokenizeAndStem(): string[];
}

PorterStemmerRu.attach();

// function to tokenize and stem text
export function tokenize(text: string) {
    let tokenizer = new WordTokenizer();
    return  tokenizer.tokenize(text);
}

export function tokenizeAndStem(text: String) {
    return text.tokenizeAndStem();
}
