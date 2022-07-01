/**
 * Each block is compressed using a complination of LZ77 and Huffman coding
 */

/**
 * Each block consists of two parts: a pair of huffman code trees, describing the conpressed part, 
 * and the compressed part.
 * The huffman trees are compressed using Huffman encoding
 */

/**
 * The compressed part consists of elements of two types: liternal bytes of strings that have not 
 * been seen in the past 32K bytes, and pointers to duplicated strings
 * The pointer is comprised of Length, Backwards Distance
 */

/**
 * A block can be any size, except for uncompressable data. The uncompressed data is the huffman 
 * trees themselves
 * Distances are a max size of 32k bytes
 * Lengths are a max size of 256 bytes
 */

/**
 * There are two Huffman trees: Literals and Lengths, and Distances
 * These two trees occer at the beginning of the block prior to the conpressed data
 */

/**
 * Multi-0byte values are stored least-significant byte first (LE)
 * Data elements are stored LE-bit first
 * Codes are stored BE-bit first
 */

// === constants
const MAX_CODE = 256
const MAX_BITS = 8

// === structures
interface IBitLengthCount {
    len: number
    count: number
}

// === clases
class CodeLengths {
    lengths: IBitLengthCount[] = []

    getCount(len: number): IBitLengthCount {
        let found = this.lengths.find(bl => {
            return bl.len === len
        })
        if (typeof found === "undefined") {
            // note, we do not insert the record in this case
            found = { len, count: 1}
        }
        return found
    }

    incCount(len: number): void {
        const lengthToUpdate = this.getCount(len)

        lengthToUpdate.count = lengthToUpdate.count + 1
        this.updateBitLength(len, {len, count: lengthToUpdate.count})
    }

    private updateBitLength(len: number, newRecord: IBitLengthCount): void {
        let insertIndex = this.lengths.findIndex(bl => bl.len === len)

        if (insertIndex === -1) {
            insertIndex = this.lengths.length
        }
        this.lengths.splice(insertIndex, 1, newRecord)
    }
}

let codeLengths = new CodeLengths

for (let l = 0; l <= MAX_CODE; l++) {
    codeLengths.incCount(l.toString(2).length)
    console.log(codeLengths.getCount(l))
}

console.log(codeLengths.lengths)

// qa good until here

let code = 0
let blCount: number[] = []
let nextCode: number[] = []
blCount[0] = 0
for (let bits = 1; bits <= MAX_BITS; bits++) {
    code = (code + (codeLengths.getCount(bits-1).count)) << 1
    nextCode[bits] = code
}

console.log(nextCode)