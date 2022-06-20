/**
 * Transforms a byte array into an array of bit values.
 * @param inBuffer Buffer to transform
 * @returns {number[]} Array of bit values
 */

export function toBin(inBuffer: Buffer): number[] {
    let bits: number[] = [];

    const num = inBuffer.readInt8(0);

    for (let i = 0; i < 8; i++) {
        bits.push(num & (1 << i) ? 1 : 0);
    }

    console.log(`bits: ${JSON.stringify(bits)}`);
    return bits;

}
