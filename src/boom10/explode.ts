/* 
* boom10.js
* Copyright (C) 2022 Joe Becher (Drazi Crendraven)
*
* Change history:
* 1.0  22 June 2022 - First Version
* 
* Credits:
* Mark Adler - Creation of blast.c
* Ben Rudiak-Gould - Documentation of the PKWARE DCL compression format
* Phillip W. Katz - Inventor of the algorithum, US Patent 6,051,745
*/

import { BinaryReader } from "../BinaryReader.js"
import { reverseByte } from "../reverseByte.js"
import { toBin } from "../toBin.js"
import { toByte } from "../toByte.js"

/**
 * input and output state
 */
interface state {
    /**
     * input state
     */
    infun: (inhow: void, inloc: number) => number   // input function provided by user
    inhow: void         // opaque information passed to infun
    inloc: number        // next input location
    left: number        // availiable input at in
    bitbuf: BinaryReader    // bit buffer
    bitcnt: number      // iumber of bits in bit buffer

    /**
     * output state
     */
    outfun: () => void  // output function provided by user
    outhow: void        // opaque information passed to outfun()
    next: number        // index of next write location in out[]
    first: number       // true to check distances (for first 4K)
    out: number[]       // output buffer and sliding window
}

/*
 * Return need bits from the input stream.  This always leaves less than
 * eight bits in the buffer.  bits() works properly for need == 0.
 *
 * Format notes:
 *
 * - Bits are stored in bytes from the least significant bit to the most
 *   significant bit.  Therefore bits are dropped from the bottom of the bit
 *   buffer, using shift right, and new bytes are appended to the top of the
 *   bit buffer, using shift left.
 */
function bits(s: state, need: number): number[] {
    let val: number[] = []            // bit accumulator

    // load at least need bits into val
    if (s.bitbuf.hasBits(need)) {
        return s.bitbuf.nextBits(8)
    }
    while (s.bitcnt < need) {
        if (s.left === 0) {
            s.left = s.infun(s.inhow, s.inloc)
            if (s.left === 0) {
                throw new Error("Out of input");                
            }
        }
        val = s.bitbuf.nextBits(need)      // load 8 bits
    }
    return val
}

/*
 * Huffman code decoding tables.  count[1..MAXBITS] is the number of symbols of
 * each length, which for a canonical code are stepped through in order.
 * symbol[] are the symbol values in canonical order, where the number of
 * entries is the sum of the counts in count[].  The decoding process can be
 * seen in the function decode() below.
 */
interface huffman {
    count: number;	/* number of symbols of each length */
    symbol: number[];	/* canonically ordered symbols */
};

/*
 * Decode a code from the stream s using huffman table h.  Return the symbol or
 * a negative value if there is an error.  If all of the lengths are zero, i.e.
 * an empty code, or if the code is incomplete and an invalid code is received,
 * then -9 is returned after reading MAXBITS bits.
 *
 * Format notes:
 *
 * - The codes as stored in the compressed data are bit-reversed relative to
 *   a simple integer ordering of codes of the same lengths.  Hence below the
 *   bits are pulled from the compressed data one at a time and used to
 *   build the code value reversed from what is in the stream in order to
 *   permit simple integer comparisons for decoding.
 *
 * - The first code for the shortest length is all ones.  Subsequent codes of
 *   the same length are simply integer decrements of the previous code.  When
 *   moving up a length, a one bit is appended to the code.  For a complete
 *   code, the last code of the longest length will be all zeros.  To support
 *   this ordering, the bits pulled during decoding are inverted to apply the
 *   more "natural" ordering starting with all zeros and incrementing.
 */
function decode(s: state, h: huffman): number {
    let len: number /* current number of bits in code */
    let code: number /* len bits being decoded */
    let first: number /* first code of length len */
    let index: number /* index of first code of length len in symbol table */
    let bitbuf: BinaryReader /* bits from stream */
    let left: number /* bits left in next and left to process */
    let next: number /* next number of codes */

    bitbuf = s.bitbuf
    left = s.bitcnt
    code = first = index = 0
    len = 1
    next = h.count + 1
    while (true) {
        while (left--) {
            code = reverseByte(code) /* invert code */
        }
    }
}