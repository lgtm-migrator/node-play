import { ETokenType } from "./types";

export function getTokenType(byte: number): ETokenType {
    if (byte === 0xFF) {
        // return ETokenType.END_OF_STREAM
        throw new Error('END_OF_STREAM is not implemented yet');
    } else if (byte & 0x01) {
        // return ETokenType.DISTANCE_LENGTH
        throw new Error('DISTANCE_LENGTH is not implemented yet');
    } else {
        return ETokenType.LITERAL;
    }

}
