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

    let priorValue:number[] = []

    // Process the first value
    let currentValue = compressed[0]
    console.log(`currentValue: ${currentValue}`)
    uncompressed = uncompressed.concat(currentValue)
    priorValue = [currentValue]
    console.log(`==========================================================`)

    // Loop through the values
    for (let i = 1; i < compressed.length; i++) {
        // Get the next symbol
        const currentSymbol = compressed[i]
        console.log(`currentSymbol: ${currentSymbol}`)

        // Lookup the symbol in the dictionary
        let symbolEntry = dictionary.find(item => item.key === currentSymbol)

        if (typeof symbolEntry === 'undefined') {
            throw new Error("Symbol not found in dictionary")
        }
            
        // Symbol found
        console.log(`symbolEntry found: ${JSON.stringify(symbolEntry)}`)
        uncompressed = uncompressed.concat(symbolEntry.value)

        let ch = symbolEntry.value[0]

        let newEntry: IDictionaryEntry = { key: nextDictionaryIndex, value: [priorValue[0]].concat(ch) }
        console.log(`newEntry: ${JSON.stringify(newEntry)}`)
        dictionary.push(newEntry)
        nextDictionaryIndex++
        priorValue = [ch]

        console.log(`==========================================================`)
    }

    console.log(`dictionary: ${JSON.stringify(dictionary)}`)

    return uncompressed
}

