import { IDictionaryEntry } from "./types"



/**
 * 
 * @param dictionary 
 * @param nextDictionaryIndex 
 * @returns {dictionary: IDictionaryEntry[], nextDictionaryIndex: number}
 */
export function initDictionary(dictionary: IDictionaryEntry[], nextDictionaryIndex: number) {
    for (let i = 0; i < 256; i++) {
        dictionary.push({ key: i, value: [i] })
        nextDictionaryIndex = i
    }
    nextDictionaryIndex++
    return { dictionary, nextDictionaryIndex }
}
