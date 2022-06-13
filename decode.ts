import { initDictionary } from "./functions"
import { IDictionaryEntry } from "./types"

/**
 * 
 * @param compressed 
 * @returns 
 */
export function decode(compressed: number[]): number[] {

    let workingValues: number[] = []

    // Initialize the dictionary
    let { dictionary, nextDictionaryIndex } = initDictionary([], 0)

    // Initialize the output array
    let uncompressed: number[] = []

    // Process the first value
    let currentValue = compressed[0]
    uncompressed = uncompressed.concat(currentValue)
    workingValues = [currentValue]

    // Loop through the values
    for (let i = 1; i < compressed.length; i++) {
        // Get the next symbol
        const currentSymbol = compressed[i]
        console.log(`currentSymbol: ${currentSymbol}`)

        console.log(`workingValues: ${workingValues}`)

        // Lookup the symbol in the dictionary
        let symbolEntry = dictionary.find(item => item.key === currentSymbol)

        // Symbol found
        if (symbolEntry) {
            console.log(`symbolEntry found: ${JSON.stringify(symbolEntry)}`)
            uncompressed = uncompressed.concat(symbolEntry.value)
            let newPossibleEntry = workingValues.concat(symbolEntry.value)
            workingValues = symbolEntry.value

            if (newPossibleEntry.length > 1) {
                let newEntry: IDictionaryEntry = { key: nextDictionaryIndex, value: newPossibleEntry }
                console.log(`newEntry: ${JSON.stringify(newEntry)}`)
                dictionary.push(newEntry)
                nextDictionaryIndex++
            }

            console.log(`new workingValues: ${workingValues}`)
        } else {
            console.log(`symbolEntry not found`)
            break
        }

        console.log(`==========================================================`)
    }

    console.log(`dictionary: ${JSON.stringify(dictionary)}`)

    return uncompressed
}

