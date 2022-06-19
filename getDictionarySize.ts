import { EDictionarySize } from "./types";


export function getDictionarySize(byte: number): number {
    if (byte === 0x04) {
        return EDictionarySize['0x04'];
    } else if (byte === 0x05) {
        // return EDictionarySize['0x05']
        throw new Error('Not implemented');
        // deepcode ignore DuplicateIfBody: Not implemented yet
    } else if (byte === 0x06) {
        // return EDictionarySize['0x06']
        throw new Error('Not implemented');
    } else {
        throw new Error(`dictionarySize: invalid dictionarySize byte: ${byte.toString(16)}`);
    }
}
