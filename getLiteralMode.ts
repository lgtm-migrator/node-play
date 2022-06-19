import { ELiteralMode } from "./types";


export function getLiteralMode(byte: number): string {
    if (byte === 0x00) {
        return ELiteralMode.MODE_0;
    } else if (byte === 0x01) {
        // return ELiteralMode.MODE_1
        throw new Error('MODE_1 is not implemented yet');
    } else {
        throw new Error(`literalMode: invalid literalMode byte: ${byte.toString(16)}`);
    }
}
