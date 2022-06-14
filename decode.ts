import { initDictionary } from "./functions"
import { IDictionaryEntry } from "./types"

/**
 * 
 * @param compressed 
 * @returns 
 */
export function decode(compressed: number[]): number[] {
    // Initialize the output array
    let uncompressed: number[] = []

    // Initialize the dictionary
    let { dictionary, nextDictionaryIndex } = initDictionary([], 0)

    let priorCode:number = 0

    // Process the first value
    console.log(`priorCode: ${priorCode}`)
    let currentCode = compressed[0]
    console.log(`currentCode: ${currentCode}`)
    uncompressed = [currentCode]
    priorCode = currentCode
    console.log(`==========================================================`)

    // Loop through the values
    for (let i = 1; i < compressed.length; i++) {
        // Get the next symbol
        currentCode = compressed[i]
        console.log(`priorCode: ${priorCode}`)
        console.log(`currentSymbol: ${currentCode}`)

        // Lookup the symbol in the dictionary
        let entry = dictionary.find(item => item.key === currentCode)

        if (typeof entry === 'undefined') {
            throw new Error("Symbol not found in dictionary")
        }
            
        // Symbol found
        console.log(`symbolEntry found: ${JSON.stringify(entry)}`)
        uncompressed = uncompressed.concat(entry.value)

        let ch = entry.value[0]

        const priorCodeEntry = dictionary.find(item => item.key === priorCode)

        if (typeof priorCodeEntry === 'undefined') {
            throw new Error("Symbol not found in dictionary")
        }

        let newEntry: IDictionaryEntry = { key: nextDictionaryIndex, value: priorCodeEntry.value.concat(ch) }
        console.log(`newEntry: ${JSON.stringify(newEntry)}`)
        dictionary.push(newEntry)
        nextDictionaryIndex++
        priorCode = currentCode

        console.log(`==========================================================`)
    }

    console.log(`dictionary: ${JSON.stringify(dictionary)}`)

    return uncompressed
}

