import { toBin } from "./toBin.js";


export class BinaryReader {
    public bitIndex: number;
    public bits: number[];
    public buffer: Buffer;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
        this.bits = [];
        this.bitIndex = 0;

        // Loop through the buffer and convert each byte to bits
        buffer.forEach((byte) => {
            const bits = toBin(Buffer.from([byte]));
            let newByte: number[] = [];
            // Loop through the bits and push them to the front of the new byte
            bits.forEach((bit) => {
                newByte.push(bit);
            });
            // Push the new byte to the bits array
            this.bits = [...this.bits, ...newByte];
        });
    }

    /**
     *
     *
     * @readonly
     * @type {number}
     * @memberof BinaryReader
     */
    public get bitCount(): number {
        return this.bits.length;
    }

    /**
     * Move the index pointer to a specific location
     * @param bitIndex The value to set the bit index to
     */
    public seek(bitIndex: number): void {
        this.bitIndex = bitIndex;
    }

    /**
     * Move the index pointer back by a specific amount
     * @param bitCount The number of bits to rewind the bit index
     */
    public rewind(bitCount: number): void {
        this.bitIndex -= bitCount;
    }

    /**
     * Get the next bit
     * @returns {number} the next bit
     */
    private nextBit(): number {
        // Get the bit at the current index
        const bit = this.bits[this.bitIndex];
        // Increment the bit index
        this.bitIndex++;
        // Return the bit
        return bit;
    }

    /**
     * Get the next n bits
     * @param bitCount The number of bits to read
     * @returns {number} the next n bits
     */
    public nextBits(bitCount: number): number[] {
        console.log(`bitIndex before: ${this.bitIndex}`);

        // Create a new array to hold the bits
        let bits: number[] = [];
        // Loop through the bit count
        for (let i = 0; i < bitCount; i++) {
            // Get the next bit
            const bit = this.nextBit();
            // Push the bit to the bits array
            bits.push(bit);
        }

        console.log(`bitIndex after: ${this.bitIndex}`);

        // Return the number
        return bits;
    }
}
