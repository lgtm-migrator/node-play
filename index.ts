

// Much thanks to https://youtu.be/95D99HEn4xU for the clarity of the algorithm process
// Also thanks to https://www2.cs.duke.edu/csed/curious/compression/lzw.html for the clarity of the algorithm process

import { encode } from "./encode"
import { decode } from "./decode"

const bitStream = 'the quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dog'

// const bitStream = 'ba ba ba ba'

console.log(`bitStream: ${bitStream}\n`)

console.log(`bitStream length: ${bitStream.length}\n`)

let values: number[] = []

for (let i = 0; i < bitStream.length; i++) {
    const bit = bitStream.charCodeAt(i)
    values.push(bit)
}

console.log(`values: ${values.join(', ')}\n`)

console.log('========================================================\n')

const compressed = encode(values)

console.log(`compressed length: ${compressed.length}\n`)

console.log(`compressed: ${compressed.join(', ')}\n`)

console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n')

const uncompressedValues = decode(compressed)

console.log('========================================================\n')

console.log(`uncompressedValues: ${uncompressedValues.join(', ')}\n`)
console.dir(uncompressedValues, { depth: null })

let uncompressedBitStream: string[] = []

for (let i = 0; i < uncompressedValues.length; i++) {
    const bit = String.fromCharCode(uncompressedValues[i])
    uncompressedBitStream.push(bit)
}

console.log(`uncompressedBitStream: ${JSON.stringify(uncompressedBitStream.join(''))}\n`)
