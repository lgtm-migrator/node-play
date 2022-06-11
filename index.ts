import { randomBytes } from "node:crypto";

export class Node {
    protected frequency: number = 0
    private leftNode: Node | undefined
    private rightNode: Node | undefined

    constructor(leftNode: Node | undefined, rightNode: Node | undefined) {
        this.leftNode = leftNode
        this.rightNode = rightNode

        if (typeof leftNode !== "undefined" && typeof rightNode !== "undefined") {
            this.frequency = leftNode.frequency + rightNode.frequency
        }
    }

    public static compare(node1: Node, node2: Node): number {
        if (node2.frequency === node1.frequency) {
            return 0
        }
        return node1.frequency > node2.frequency ? 1 : -1
    }
}

export class Leaf extends Node {
    private byte: number

    constructor(byte: number, frequency: number) {
        super(undefined, undefined)
        this.byte = byte
        this.frequency = frequency
    }
}

export class Huffman {
    private rootNode: Node | undefined = undefined
    private input: Buffer
    private frequencies: {byte: number, frequency: number}[] = []
    private codes: {byte: number, code: string}[] = []
    private huffmanTree: Leaf[] = []

    constructor(input: Buffer) {
        this.input = input
        this.fillFrequencies()
    }
    fillFrequencies() {
        for (let i = 0; i < this.input.length; i++) {
            let byte = this.input[i]
            let code = this.frequencies.find(f => f.byte === byte)
            if (code) {
                code.frequency++
            }
            else {
                this.frequencies.push({byte, frequency: 1})
            }
        }
    }

    buildTree() {
        for (let index = 0; index < this.frequencies.length; index++) {
            this.huffmanTree.push(new Leaf(this.frequencies[index].byte, this.frequencies[index].frequency))            
        }
    }   

    sortTree() {
        this.huffmanTree.sort(Node.compare)
    }
    
    /**
     * getTree
     */
    public getTree() {
        return this.huffmanTree        
    }
}

const bitStream = 'the quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dogthe quick brown fox jumps over the lazy dog'

console.log(`bitStream: ${bitStream}\n`)


const huffmanTree = new Huffman(Buffer.from(bitStream))
huffmanTree.buildTree()
huffmanTree.sortTree()

console.dir(huffmanTree.getTree())

console.dir(huffmanTree)

process.exit()




// /**
//  * 
//  * @param {string} inStream 
//  * @param {number} index 
//  * @param {number} windowSize 
//  * @returns {number}
//  */
// function getWindow(inStream: string, index: number, windowSize: number) {
//     if (index < windowSize) {
//         windowSize = index
//     }
//     const window = inStream.substring(index - windowSize, index +1)

//     return window
    
// }

// /**
//  * What position does the search string first occur at?
//  * @param {string} searchString 
//  * @param {string} searchWindow 
//  * @returns 
//  */
// function getMatchIndex(searchString: string, searchWindow: string) {

//     return searchWindow.indexOf(searchString)
    
// }

// /**
//  * 
//  * @param {string} searchString 
//  * @param {number} startIndex 
//  * @param {number} searchWindow 
//  * @param {number} windowSize
//  * @returns {number}
//  */
// function getMatchLength(searchString: string, startIndex: number, searchWindow: string, windowSize: number ) {
//     console.log('In getMatchLength()')
//     console.log(searchString, startIndex, searchWindow)
//     let matchLength = 1
//     let count = 0
//     do {
//         // If we have searched past the windows edge, break
//         if (count >= windowSize) {
//             break
//         }
//         console.log(`[${searchString.substring(0, startIndex + matchLength)}] === [${searchWindow.substring(startIndex, startIndex + matchLength)}]`, startIndex, matchLength, searchWindow.substring(startIndex, matchLength).startsWith(searchString.substring(startIndex, matchLength)))
//         count = count + 1

//         matchLength = matchLength + 1  

//     } while (searchWindow.substring(startIndex, startIndex + matchLength).startsWith(searchString.substring(0, startIndex + matchLength)) === true);
//     // Last loop failed, back up by one
//     const match = searchWindow.substring(startIndex, matchLength - 1)
//     console.log(`Final match: [${match}]`)
//     return match.length
// }

// /******************************************************************************************** 
//  * Program start 
//  * *****************************************************************************************/


// const WINDOW_SIZE = 10

// console.log('windowSize', WINDOW_SIZE)

// const streamLength = bitStream.length

// console.log('streamLength:', streamLength)

// let cursor = 0
// let searchLength = 1

// console.log(`starting cursor: ${cursor}\n`)

// do {
//     let matchLength = 0
//     // Emergency break if needed
//     let count = 1
//     const inputByte = bitStream.substring(cursor, cursor + searchLength)

//     console.log('cursor:', cursor)
//     console.log('current byte:', inputByte)
//     console.log('searchLength:', searchLength)

//     const window = getWindow(bitStream, cursor, WINDOW_SIZE)

//     console.log(`search window: /${window}/`)

//     let found = false
    
//     const positionInWindow = getMatchIndex(inputByte, window)

//     if (positionInWindow >= 0) {
//         // A match was found
//         found = true

//         console.log('!!!!!!!!!! match found in window at position:', positionInWindow)

//         const matchStart = cursor + positionInWindow
//         console.log(`starting search length check at absolute position: ${matchStart}`)

//         // How long does the match extend?
//         const matchLength = getMatchLength(inputByte, matchStart, bitStream, WINDOW_SIZE)

//         console.log(`match was n characters long: ${matchLength}\n`)
//         searchLength = matchStart + matchLength
//         cursor = cursor + matchLength
//     } else {
//         console.log(`==No Match found==: ${cursor}\n`)
//         cursor = cursor  + 1
//         matchLength = 0
//         searchLength = 1
//     }
//     count = count + 1
//     if (count > streamLength) {
//         break
//     }
// } while (cursor < streamLength) 
