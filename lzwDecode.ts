import { initDictionary } from "./functions";
import { ILZWDictionaryEntry } from "./ILZWDictionaryEntry";
var debug = require('debug')('boom10:lzwDecode');

/**
 *
 * @param compressed
 * @returns
 */

export function lzwDecode(compressed: number[]): number[] {
    // Initialize the output array
    let uncompressed: number[] = [];

    // Initialize the dictionary
    let { dictionary, nextDictionaryIndex } = initDictionary([], 0);

    let priorCode: number = 0;

    // Process the first value
    debug(`priorCode: ${priorCode}`);
    let currentCode = compressed[0];
    debug(`currentCode: ${currentCode}`);
    uncompressed = [currentCode];
    priorCode = currentCode;
    debug(`==========================================================`);

    // Loop through the values
    for (let i = 1; i < compressed.length; i++) {
        // Get the next symbol
        currentCode = compressed[i];
        debug(`priorCode: ${priorCode}`);
        debug(`currentSymbol: ${currentCode}`);

        // Lookup the symbol in the dictionary
        let entry = dictionary.find(item => item.key === currentCode);

        if (typeof entry === 'undefined') {
            throw new Error("Symbol not found in dictionary");
        }

        // Symbol found
        debug(`symbolEntry found: ${JSON.stringify(entry)}`);
        uncompressed = uncompressed.concat(entry.value);

        let ch = entry.value[0];

        const priorCodeEntry = dictionary.find(item => item.key === priorCode);

        if (typeof priorCodeEntry === 'undefined') {
            throw new Error("Symbol not found in dictionary");
        }

        let newEntry: ILZWDictionaryEntry = { key: nextDictionaryIndex, value: priorCodeEntry.value.concat(ch) };
        debug(`newEntry: ${JSON.stringify(newEntry)}`);
        dictionary.push(newEntry);
        nextDictionaryIndex++;
        priorCode = currentCode;

        debug(`==========================================================`);
    }

    debug(`dictionary: ${JSON.stringify(dictionary)}`);

    return uncompressed;
}
