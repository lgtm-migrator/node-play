// Implimenting https://groups.google.com/g/comp.compression/c/M5P064or93o/m/W1ca1-ad6kgJ?pli=1

import { generateLiteralCodesMode0 } from "./generateLiteralCodesMode0"
import { getDictionarySize } from "./getDictionarySize"
import { getLiteralMode } from "./getLiteralMode"
import { getLiteralToken } from "./getLiteralToken"
import { ETokenType, LiteralTokens } from "./types"

const decodeBytes = Buffer.from([0x00, 0x04, 0x82, 0x24, 0x25, 0x8f, 0x80, 0x7f])

/**
 * Transforms a byte array into an array of bit values.
 * @param inBuffer Buffer to transform
 * @returns {number[]} Array of bit values
 */
export function toBin(inBuffer: Buffer): number[] {
    let bits: number[] = []

    const num = inBuffer.readInt8(0)

    for (let i = 0; i < 8; i++) {
        bits.push(num & (1 << i) ? 1 : 0)
    }

    console.log(`bits: ${JSON.stringify(bits)}`)
    return bits

}

/**
 * Tranform a array of bit values into a byte
 * @param bits an array of bits
 * @returns {number} the number represented by the bits
 */
export function toByte(bits: number[]): number {
    let num = 0
    bits.forEach((bit, index) => {
        num += bit << index
    })
    console.log(`num: ${num}`)
    return num
}

export function reverseByte(byte: number): number {
    let flippedByte = 0
    const bits = toBin(Buffer.from([byte]))
    let newByte: number[] = []
    // Loop through the bits and push them to the front of the new byte
    bits.forEach((bit) => {
        newByte.push(bit)
    })
    // Push the new byte to the bits array
    return toByte(bits)
}

export class BinaryReader {
    public bitIndex: number
    public bits: number[]
    public buffer: Buffer

    constructor(buffer: Buffer) {
        this.buffer = buffer
        this.bits = []
        this.bitIndex = 0

        // Loop through the buffer and convert each byte to bits
        buffer.forEach((byte) => {
            const bits = toBin(Buffer.from([byte]))
            let newByte: number[] = []
            // Loop through the bits and push them to the front of the new byte
            bits.forEach((bit) => {
                newByte.push(bit)
            })
            // Push the new byte to the bits array
            this.bits = [...this.bits, ...newByte]
        })
    }

    /**
     *
     *
     * @readonly
     * @type {number}
     * @memberof BinaryReader
     */
    public get bitCount(): number {
        return this.bits.length
    }

    /**
     * Move the index pointer to a specific location
     * @param bitIndex The value to set the bit index to
     */
    public seek(bitIndex: number): void {
        this.bitIndex = bitIndex
    }

    /**
     * Move the index pointer back by a specific amount
     * @param bitCount The number of bits to rewind the bit index
     */
    public rewind(bitCount: number): void {
        this.bitIndex -= bitCount
    }

    /**
     * Get the next bit
     * @returns {number} the next bit
     */
    private nextBit(): number {
        // Get the bit at the current index
        const bit = this.bits[this.bitIndex]
        // Increment the bit index
        this.bitIndex++
        // Return the bit
        return bit
    }

    /**
     * Get the next n bits
     * @param bitCount The number of bits to read
     * @returns {number} the next n bits
     */
    public nextBits(bitCount: number): number[] {
        console.log(`bitIndex before: ${this.bitIndex}`)

        // Create a new array to hold the bits
        let bits: number[] = []
        // Loop through the bit count
        for (let i = 0; i < bitCount; i++) {
            // Get the next bit
            const bit = this.nextBit()
            // Push the bit to the bits array
            bits.push(bit)
        }

        console.log(`bitIndex after: ${this.bitIndex}`)

        // Return the number
        return bits
    }
}

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



