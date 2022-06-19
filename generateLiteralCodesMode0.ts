import { ELiteralMode, ETokenType, IToken } from "./types";




export function generateLiteralCodesMode0(): IToken[] {
    const literalCodes: IToken[] = [];
    for (let i = 0; i < 256; i++) {
        const newToken: IToken = {
            tokenType: ETokenType.LITERAL,
            literalMode: ELiteralMode.MODE_0,
            literal: i,
            value: i,
            distance: 0,
            length: 0
        };
        literalCodes.push(newToken);
    }
    return literalCodes;
}
