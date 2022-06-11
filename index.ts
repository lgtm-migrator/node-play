

// Much thanks to https://youtu.be/95D99HEn4xU for the clarity of the algorithm process

const bitStream = 'the quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dog'

console.log(`bitStream: ${bitStream}\n`)

let values: number[] = []

for (let i = 0; i < bitStream.length; i++) {
    const bit = bitStream.charCodeAt(i)
    values.push(bit)
}

console.log(`values: ${values.join(', ')}\n`)

console.log('========================================================\n')

const compressed = encode(values)

console.log(`compressed: ${compressed.join(', ')}\n`)

const uncompressedValues = decode(compressed)

let uncompressedBitStream: string[] = []

for (let i = 0; i < uncompressedValues.length; i++) {
    const bit = String.fromCharCode(uncompressedValues[i])
    uncompressedBitStream.push(bit)
}

console.log(`uncompressedBitStream: ${uncompressedBitStream.join('')}\n`)

function encode(values: number[]): number[] {
    let foundValue = 0
    let compressed: number[] = []

    let dictionary: { key: number, value: number }[] = []

    let nextDictionaryIndex = 0

    // Fill the dictionary with the first values
    for (let i = 0; i < 256; i++) {
        dictionary.push({ key: i, value: i })
        nextDictionaryIndex = i
    }


    for (let i = 0; i < values.length; i++) {
        const value = values[i]
        let searchValue = foundValue + value
        const found = dictionary.find(item => item.value === searchValue)

        // Not already in the dictionary
        if (typeof found === 'undefined') {
            console.log(`${searchValue} was not found in the dictionary\n`)
            // Add to the dictionary
            const newItem = { key: nextDictionaryIndex, value: searchValue }
            console.log(`newItem: ${JSON.stringify(newItem)}\n`)
            dictionary.push(newItem)
            
            // Reset the found value
            let previousKey = 0

            // Log the dictionary size
            console.log(`dictionarySize: ${dictionary.length}\n`)

            // Get the key for the previous value
            console.log(`Looking for ${foundValue} in the dictionary`)
            const previousEntry = dictionary.find(item => item.value === foundValue)

            if (typeof previousEntry !== 'undefined') {
                console.log(`previousEntry: ${JSON.stringify(previousEntry)}\n`)
                previousKey = previousEntry.key
            }

            // Add the previous key to the compressed stream
            console.log(`previousKey: ${previousKey}\n`)
            compressed.push(previousKey)
            // Reset the found value to the new value
            foundValue = value
            // Increment the next dictionary index
            nextDictionaryIndex++
        } else {
            console.log(`${searchValue} was found in the dictionary\n`)
            console.log(`found: ${JSON.stringify(found)}\n`)
            foundValue = searchValue
        }
        console.log('========================================================\n')
    }

    console.log(`dictionary: ${JSON.stringify(dictionary)}\n`)

    return compressed
}

function decode(compressed: number[]): number[] {
    let foundValue = 0
    let uncompressed: number[] = []

    let dictionary: { key: number, value: number }[] = []

    let nextDictionaryIndex = 0

    // Fill the dictionary with the first values
    for (let i = 0; i < 256; i++) {
        dictionary.push({ key: i, value: i })
        nextDictionaryIndex = i
    }


    for (let i = 0; i < values.length; i++) {
        const value = values[i]
        let searchValue = foundValue + value
        const previousValue = foundValue
        const found = dictionary.find(item => item.value === searchValue)

        if (typeof found !== 'undefined') {
            console.log(`${searchValue} was found in the dictionary\n`)
            uncompressed.push(found.value)
        } else {
            console.log(`${searchValue} was not found in the dictionary\n`)
            // Add to the dictionary
            const newItem = { key: nextDictionaryIndex, value: searchValue }
            console.log(`newItem: ${JSON.stringify(newItem)}\n`)
            dictionary.push(newItem)

            uncompressed.push(value)
        }
        console.log('========================================================\n')
    }

    console.log(`dictionary: ${JSON.stringify(dictionary)}\n`)

    return uncompressed
}