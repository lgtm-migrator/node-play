import { initDictionary } from "./functions"

/**
 * 
 * @param values 
 * @returns 
 */
 export function encode(values: number[]): number[] {
    let priorValue: number[] = []
    let compressed: number[] = []

    // Initialize the dictionary
    // Fill the dictionary with the first values
    let { dictionary, nextDictionaryIndex } = initDictionary([], 0)

    // Process the first value
    let currentValue = values[0]
    priorValue = [currentValue]


    // Loop through the values
    for (let i = 1; i < values.length; i++) {

        if (i == values.length - 1) {
            // We are at the end of the values
            // Add the last value to the compressed array
            compressed.push(currentValue)
            break
        }

        const value = values[i]
        let searchValue = priorValue.concat([value])

        // Lookup the symbol in the dictionary
        let found = dictionary.find(item => item.value.toString() === searchValue.toString())

        // Not already in the dictionary
        if (typeof found === 'undefined') {
            console.log(`${searchValue} was not found in the dictionary\n`)
            // Add the value to the dictionary
            const newItem = { key: nextDictionaryIndex, value: searchValue }
            console.log(`newItem: ${JSON.stringify(newItem)}\n`)
            dictionary.push(newItem)
            // Increment the next dictionary index
            nextDictionaryIndex++

            // Log the dictionary size
            console.log(`dictionarySize: ${dictionary.length}\n`)

            // Add the previous key to the compressed stream
            console.log(`previousValue: ${priorValue}\n`)

            const previousValue = dictionary.find(item => item.value.toString() === priorValue.toString())

            if (typeof previousValue !== 'undefined') {
                compressed.push(previousValue.key)
            }

            // Reset the found value to the new value
            priorValue = [value]
            console.log(`priorValue: ${priorValue}\n`)


        } else {
            // we found the value in the dictionary
            console.log(`${searchValue} was found in the dictionary\n`)
            console.log(`found: ${JSON.stringify(found)}\n`)
            priorValue = searchValue
            console.log(`priorValue: ${priorValue}\n`)
        }
        console.log('========================================================\n')
    }

    console.log(`dictionary: ${JSON.stringify(dictionary)}\n`)

    return compressed
}