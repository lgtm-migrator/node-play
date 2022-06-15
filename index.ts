// Implimenting https://groups.google.com/g/comp.compression/c/M5P064or93o/m/W1ca1-ad6kgJ?pli=1

const decodeBytes = Buffer.from([0x00, 0x04, 0x82, 0x24, 0x25, 0x8f, 0x80, 0x7f])

let streamIndex = 0

console.log(`decodeBytes: ${decodeBytes.toString('hex')}\n`)

for (let i = 0; i < decodeBytes.length; i++) {
    const byte = decodeBytes[i]
    console.log(`byte ${i}: ${byte.toString(16)}`)
}
console.log('========================================================\n')

export enum ELiteralMode {
    'MODE_0' = 'MODE_0',
    'MODE_1' = 'MODE_1',
}

export enum EDictionarySize {
    '0x04' = 1024,
    '0x05' = 2048,
    '0x06' = 4096,
}

export function getLiteralMode(byte: number): string {
    if (byte === 0x00) {
        return ELiteralMode.MODE_0
    } else if (byte === 0x01) {
        // return ELiteralMode.MODE_1
        throw new Error('MODE_1 is not implemented yet')
    } else {
        throw new Error(`literalMode: invalid literalMode byte: ${byte.toString(16)}`)
    }
}

export function getDictionarySize(byte: number): number {
    if (byte === 0x04) {
        return EDictionarySize['0x04']
    } else if (byte === 0x05) {
        // return EDictionarySize['0x05']
        throw new Error('Not implemented')
    // deepcode ignore DuplicateIfBody: Not implemented yet
    } else if (byte === 0x06) {
        // return EDictionarySize['0x06']
        throw new Error('Not implemented')
    } else {
        throw new Error(`dictionarySize: invalid dictionarySize byte: ${byte.toString(16)}`)
    }
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

export enum ETokenType {
    'LITERAL' = 'LITERAL',
    'DISTANCE_LENGTH' = 'DISTANCE_LENGTH',
    'END_OF_STREAM' = 'END_OF_STREAM',
}

export function getTokenType(byte: number): ETokenType {
    if (byte === 0xFF) {
        // return ETokenType.END_OF_STREAM
        throw new Error('END_OF_STREAM is not implemented yet')
    } else if ( byte & 0x01) {
        // return ETokenType.DISTANCE_LENGTH
        throw new Error('DISTANCE_LENGTH is not implemented yet')
    } else {
        return ETokenType.LITERAL
    } 
    
}

export interface IToken {
    tokenType: ETokenType,
    literalMode: ELiteralMode,
    literal: number,
    value: number,
    distance: number,
    length: number
}

export function generateLiteralCodesMode0(): IToken[] {
    const literalCodes: IToken[] = []
    for (let i = 0; i < 256; i++) {
        const newToken: IToken = {
            tokenType: ETokenType.LITERAL,
            literalMode: ELiteralMode.MODE_0,
            literal: i,
            value: i,
            distance: 0,
            length: 0
        }
        literalCodes.push(newToken)
    }
    return literalCodes
}

const literalCodesMode0 = generateLiteralCodesMode0()

const LiteralTokens: Record<string, IToken[]> = {
    MODE_0: literalCodesMode0,
    MODE_1: []
}

export function getLiteralToken(mode: string, literal: number): IToken {
    const literalCodes = LiteralTokens[mode]

    console.log(`literal prior to type removal: ${literal.toString(16)}`)

    // Clear the literal type bit
    literal = literal >>> 1

    return literalCodes[literal]
}

/**
 * Return the number of bits in the given number
 * @param {number} byte 
 * @returns {number}
 */
 export function getBitLength(byte: number): number {
    return Math.ceil(Math.log2(byte))
}

/**
 * Pop the number of bits from the given byte
 * @param {number} byte 
 * @param {number} count 
 * @returns {bits: number, remainingBits: number}
 */
export function popBits(byte: number, count: number): {bits: number, remainingBits: number} {
    let one = new Number(byte).valueOf()
    let two = new Number(byte).valueOf()
    const bits = one >>> count
    const remainingBits = two - bits
    return { bits, remainingBits }
}

const { bits, remainingBits } = popBits(0x159, 4)

console.log(`bits: ${bits.toString(16)}`)
console.log(`remainingBits: ${remainingBits.toString(16)}`)

while (streamIndex < decodeBytes.length) {
    const byte = decodeBytes[streamIndex]
    streamIndex++
    const tokenType = getTokenType(byte)
    if (tokenType === ETokenType.LITERAL || tokenType === ETokenType.DISTANCE_LENGTH) {
        const literal = getLiteralToken(literalMode, byte)
        console.log(`literal: ${literal.value}`)
    } else if (tokenType === ETokenType.END_OF_STREAM) {
        throw new Error('END_OF_STREAM is not implemented yet')
    }
}


