

import { BinaryReader } from "./BinaryReader.js"
import { decodeBytes } from "./boom10/explode.spec.js"
import { generateLiteralCodesMode0 } from "./generateLiteralCodesMode0.js"
import { getDictionarySize } from "./getDictionarySize.js"
import { getLiteralMode } from "./getLiteralMode.js"
import { getLiteralToken } from "./getLiteralToken.js"
import { toByte } from "./toByte.js"
import { ETokenType, LiteralTokens } from "./types.js"

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

makeTree()

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
        const nextBits = binaryReader.nextBits(3)
        console.log(`nextBits: ${nextBits.toString()}`)
        throw new Error('Distance index not implemented')
    } else if (tokenType === ETokenType.END_OF_STREAM) {
        throw new Error('END_OF_STREAM is not implemented yet')
    }
    console.log('========================================================\n')
}

export class TreeNode {
    private _zero: TreeNode | number = -1
    private _one: TreeNode | number = -1

    constructor(zero?: TreeNode | number, one?: TreeNode | number) {
        this._zero = zero || -1
        this._one = one || -1
    }

    public static new(zero?: TreeNode | number, one?: TreeNode | number) {
        const newNode = new TreeNode(zero, one)
        return newNode
    }

    public get 0(): TreeNode | number {
        return this._zero
    }

    public set 0(value: TreeNode | number) {
        this._zero = value
    }

    public get 1(): TreeNode | number {
        return this._one
    }

    public set 1(value: TreeNode | number) {
        this._one = value
    }
}

export interface ITreeNode {
    1: ITreeNode | number,
    0: ITreeNode | number
}

export function makeDistanceTree(): number {
    let distanceCodes = TreeNode.new()

    distanceCodes[1] = TreeNode.new()
    distanceCodes[0] = TreeNode.new()

    distanceCodes[1][1] = 3
    distanceCodes[1][0] = TreeNode.new()

    distanceCodes[1][0][1] = 2
    distanceCodes[1][0][0] = 4

    distanceCodes[0][1] = TreeNode.new()
    distanceCodes[0][0] = TreeNode.new()

    distanceCodes[0][1][1] = 5
    distanceCodes[0][1][0] = TreeNode.new()

    distanceCodes[0][1][0][1] = 6
    distanceCodes[0][1][0][0] = 7

    distanceCodes[0][0][1] = TreeNode.new()
    distanceCodes[0][0][0] = TreeNode.new()

    distanceCodes[0][0][1][1] = 8
    distanceCodes[0][0][1][0] = TreeNode.new()

    distanceCodes[0][0][1][0][1] = 9
    distanceCodes[0][0][1][0][0] = TreeNode.new()

    return -1
}


const lengthCodes = {
    1: {
        1: 3,
        0: {
            1: 2,
            0: 4
        }
    },
    0: {
        1: {
            1: 5,
            0: {
                1: 6,
                0: 7
            }
        },
        0: {
            1: {
                1: 8,
                0: {
                    1: 9,
                    0: {

                    }
                }
            }
        }
    }
}

export function makeTree() {
    let counter = 0xFE
    let numbers: Record<number, string> = {}
    for (let index = 518; index >= 2; index--) {
        numbers[index] = counter.toString(2)
        counter--        
    }

    console.log(`numbers: ${JSON.stringify(numbers)}`)
}