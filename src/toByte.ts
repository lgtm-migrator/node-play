/**
 * Tranform a array of bit values into a byte
 * @param bits an array of bits
 * @returns {number} the number represented by the bits
 */

export function toByte(bits: number[]): number {
    let num = 0;
    bits.forEach((bit, index) => {
        num += bit << index;
    });
    console.log(`num: ${num}`);
    return num;
}
