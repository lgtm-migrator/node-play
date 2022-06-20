import { IToken, LiteralTokens } from "./types.js";


export function getLiteralToken(mode: string, literal: number): IToken {
    const literalCodes = LiteralTokens[mode];

    console.log(`literal prior to type removal: ${literal.toString(16)}`);

    return literalCodes[literal];
}
