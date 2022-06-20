// Implimenting https://groups.google.com/g/comp.compression/c/M5P064or93o/m/W1ca1-ad6kgJ?pli=1

import { BinaryReader } from "./BinaryReader.js"
import { getLiteralMode } from "./getLiteralMode.js"
import { getDictionarySize } from "./getDictionarySize.js"
import { getLiteralToken } from "./getLiteralToken.js"
import { toByte } from "./toByte.js"
import { ETokenType, LiteralTokens } from "./types.js"
import { generateLiteralCodesMode0 } from "./generateLiteralCodesMode0.js"

const decodeBytes = Buffer.from([0x00, 0x04, 0x82, 0x24, 0x25, 0x8f, 0x80, 0x7f])

// After header is removed
// 10000010 0 01001000 01001011 00011111000000001111111

let streamIndex = 0

console.log(`decodeBytes: ${decodeBytes.toString('hex')}\n`)

for (let i = 0; i < decodeBytes.length; i++) {
    const byte = decodeBytes[i]
    console.log(`byte ${i}: ${byte.toString(16)}`)
}

let byteToCheck = decodeBytes[streamIndex]
streamIndex++

console.log(`byteToCheck: ${byteToCheck.toString(16)}`)

const literalMode = getLiteralMode(byteToCheck)

console.log(`literalMode: ${literalMode}\n`)

byteToCheck = decodeBytes[streamIndex]
streamIndex++

console.log(`byteToCheck: ${byteToCheck.toString(16)}`)

const dictionarySize = getDictionarySize(byteToCheck)

console.log(`dictionarySize: ${dictionarySize}\n`)


LiteralTokens.MODE_0 = generateLiteralCodesMode0()

console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n')

console.log('========================================================\n')

const binaryReader = new BinaryReader(decodeBytes.slice(2, decodeBytes.length))
console.log(`bitCount: ${binaryReader.bitCount}`)
console.log(`bitIndex: ${binaryReader.bitIndex}`)
console.log(`bits: ${JSON.stringify(binaryReader.bits)}`)

console.log('========================================================\n')

while (streamIndex < binaryReader.bitCount) {

    streamIndex++

    const tokenType = toByte(binaryReader.nextBits(1))
    tokenType === 0 ? console.log('tokenType: 0') : console.log('tokenType: 1')
    if (tokenType === ETokenType.LITERAL) {

        const byte = binaryReader.nextBits(8)
        console.log(`byte: ${byte.toString()}`)

        const literal = getLiteralToken(literalMode, toByte(byte))
        console.log(`literal: ${literal.value}`)
    } else if (tokenType === ETokenType.DISTANCE_LENGTH) {
        throw new Error('Distance index not implemented')
    } else if (tokenType === ETokenType.END_OF_STREAM) {
        throw new Error('END_OF_STREAM is not implemented yet')
    }
    console.log('========================================================\n')
}



