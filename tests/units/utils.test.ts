import {describe, it, expect} from "@jest/globals";
import {convertGoogleQueryToTsQuery, prepareText} from "../../lib/database/fullTextSearch";
import {tokenizeAndStem} from "../../lib/nlp";
import {getProvidersProps} from "../../lib/react/getProviders";

describe('Text utils', () => {

    it('Simple usage of prepareText', async () => {
        let res = prepareText('Привет, как дела?');
        expect(res).toEqual('привет как дела');
        res = prepareText('Привет, как дела?123 1  12 13123 AAddasd!!!');
        expect(res).toEqual('привет как дела 123 1 12 13123 aaddasd');

    });

    it('Simple usage of convertGoogleQueryToTsQuery', async () => {
        let preparedText = prepareText('"Привет", как -дела?');
        let res = convertGoogleQueryToTsQuery(preparedText);
        expect(res).toEqual('привет:* & !дела:*');
    });
    it ('Test getProviders', async () => {
        const providers = await getProvidersProps();
        console.log(JSON.stringify(providers));
    });

    it('Simple usage of tokenize', async () => {
        let preparedText = tokenizeAndStem('Привет, как дела? Hello, how are you doing?');
        expect(preparedText).toEqual(['привет', 'дел', 'hello', 'how', 'are', 'you', 'doing']);
        // time it takes to tokenize and stem
        // console.time('start wordnet');
        // const wordnet = new WordNet();
        // console.timeLog('start wordnet');
        // console.time('work wordnet');

        // TODO add sinonims
        // let results = await new Promise<DataRecord[]>((resolve, reject) => {
        //     wordnet.lookup('hello', (results) => {
        //         resolve(results);
        //     });
        // });
        // console.timeLog('work wordnet');
        // expect(results).toEqual([{
        //     synsetOffset: 0,
        //     pos: 'n',
        //     lemma: 'привет',
        //     synonyms: ['привет', 'здравствуйте', 'здорово']
        // }]);
    });
});
