import {PorterStemmerRu, WordTokenizer} from 'natural';




// PorterStemmerRu.attach();

// function to tokenize and stem text
export function tokenize(text: string) {
    let tokenizer = new WordTokenizer();
    return  tokenizer.tokenize(text);
}

export function tokenizeAndStem(text: string) {
    return PorterStemmerRu.tokenizeAndStem(text)
}
