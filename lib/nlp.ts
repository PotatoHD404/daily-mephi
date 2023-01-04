import {PorterStemmerRu} from 'natural';


declare interface String {
    tokenizeAndStem(): string[];
}

PorterStemmerRu.attach();

// function to tokenize and stem text
export function tokenizeAndStem(text: String) {
    return text.tokenizeAndStem();
}
