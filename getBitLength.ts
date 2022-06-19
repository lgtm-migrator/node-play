/**
 * Return the number of bits in the given number
 * @param {number} byte
 * @returns {number}
 */

export function getBitLength(byte: number): number {
    return Math.ceil(Math.log2(byte));
}
