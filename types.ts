export const LiteralTokens: Record<string, IToken[]> = {
    MODE_0: [],
    MODE_1: []
};


export enum EDictionarySize {
    '0x04' = 1024,
    '0x05' = 2048,
    '0x06' = 4096,
}

export enum ELiteralMode {
    'MODE_0' = 'MODE_0',
    'MODE_1' = 'MODE_1',
}

export enum ETokenType {
    'LITERAL' = 0,
    'DISTANCE_LENGTH' = 1,
    'END_OF_STREAM' = 0xff,
}

export interface IToken {
    tokenType: ETokenType,
    literalMode: ELiteralMode,
    literal: number,
    value: number,
    distance: number,
    length: number
}