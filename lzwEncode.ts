import { initDictionary } from "./functions";
import { ILZWDictionaryEntry } from "./ILZWDictionaryEntry";
var debug = require('debug')('boom10:lzwEncode');

/**
 *
 * @param values
 * @returns
 */

export function lzwEncode(values: number[]): number[] {
    let compressed: number[] = [];

    // Initialize the dictionary
    // Fill the dictionary with the first values
    let { dictionary, nextDictionaryIndex } = initDictionary([], 0);

    let priorValue: number[] = [];

    for (let i = 0; i < values.length; i++) {
        let currentValue = values[i];
        const searchValue = priorValue.concat(currentValue);
        debug(`priorValue: ${priorValue.join(', ')}`);
        debug(`searchValue: ${searchValue}`);
        const entry = dictionary.find(item => item.value.toString() === searchValue.toString());
        debug(`entry: ${JSON.stringify(entry)}`);

        if (entry) {
            debug('yes');
            // found in the dictionary
            priorValue = searchValue;
            debug(`priorValue: ${priorValue}`);
        } else {
            debug('no');
            // not found in the dictionary
            const priorKey = dictionary.find(item => item.value.toString() === priorValue.toString());

            if (typeof priorKey === 'undefined') {
                throw new Error("Symbol not found in dictionary");
            }

            debug(`priorKey: ${priorKey.key}`);
            compressed = compressed.concat(priorKey.key);

            let newEntry: ILZWDictionaryEntry = { key: nextDictionaryIndex, value: searchValue };
            debug(`newEntry: ${JSON.stringify(newEntry)}`);
            dictionary.push(newEntry);
            nextDictionaryIndex++;

            priorValue = [currentValue];
            debug(`priorValue: ${priorValue}`);
        }
    }

    // Add the last value
    const priorKey = dictionary.find(item => item.value.toString() === priorValue.toString());

    if (typeof priorKey === 'undefined') {
        throw new Error("Symbol not found in dictionary");
    }

    debug(`priorKey: ${priorKey.key}`);
    compressed = compressed.concat(priorKey.key);

    debug(`dictionary: ${JSON.stringify(dictionary)}\n`);

    debug(`compressed: ${JSON.stringify(compressed)}`);

    return compressed;
}
