import { toBin } from "./toBin";
import { toByte } from "./toByte";

export function reverseByte(byte: number): number {
    let flippedByte = 0;
    const bits = toBin(Buffer.from([byte]));
    let newByte: number[] = [];
    // Loop through the bits and push them to the front of the new byte
    bits.forEach((bit) => {
        newByte.push(bit);
    });
    // Push the new byte to the bits array
    return toByte(bits);
}
