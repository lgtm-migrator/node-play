import { initDictionary } from "./functions"
import { IDictionaryEntry } from "./types"

/**
 * 
 * @param values 
 * @returns 
 */
 export function encode(values: number[]): number[] {
    let compressed: number[] = []

    // Initialize the dictionary
    // Fill the dictionary with the first values
    let { dictionary, nextDictionaryIndex } = initDictionary([], 0)

    let priorValue:number[] = []

    for (let i = 0; i < values.length; i++) {
        let currentValue = values[i]
        const searchValue = priorValue.concat(currentValue)
        console.log(`priorValue: ${priorValue.join(', ')}`)
        console.log(`searchValue: ${searchValue}`)
        const entry = dictionary.find(item => item.value.toString() === searchValue.toString())
        console.log(`entry: ${JSON.stringify(entry)}`)

        if (entry) {
            console.log('yes')
            // found in the dictionary
            priorValue = searchValue
            console.log(`priorValue: ${priorValue}`)
        } else {
            console.log('no')
            // not found in the dictionary
            const priorKey = dictionary.find(item => item.value.toString() === priorValue.toString())

            if (typeof priorKey === 'undefined') {
                throw new Error("Symbol not found in dictionary")
            }

            console.log(`priorKey: ${priorKey.key}`)
            compressed = compressed.concat(priorKey.key)

            let newEntry: IDictionaryEntry = { key: nextDictionaryIndex, value: searchValue }
            console.log(`newEntry: ${JSON.stringify(newEntry)}`)
            dictionary.push(newEntry)
            nextDictionaryIndex++

            priorValue = [currentValue]
            console.log(`priorValue: ${priorValue}`)
        }
        console.log(`==========================================================`)
    }

    // Add the last value
    const priorKey = dictionary.find(item => item.value.toString() === priorValue.toString())

    if (typeof priorKey === 'undefined') {
        throw new Error("Symbol not found in dictionary")
    }

    console.log(`priorKey: ${priorKey.key}`)
    compressed = compressed.concat(priorKey.key)

    console.log(`dictionary: ${JSON.stringify(dictionary)}\n`)

    console.log(`compressed: ${JSON.stringify(compressed)}`)

    return compressed
}