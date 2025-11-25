import type { Cipher } from "../types/cipher";

export class PolybiusCipher implements Cipher {
    alphabet: string = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ";

    rows: number = 5;
    cols: number = 7;
    table: string[][] = [];
    charToCode: Map<string, string> = new Map();

    constructor() {
        let idx = 0;
        for (let r = 0; r < this.rows; r++) {
            this.table[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const ch = this.alphabet[idx++];
                this.table[r][c] = ch;
                this.charToCode.set(ch, `${r + 1}${c + 1}`);
            }
        }
    }

    encode(text: string): string {
        const upper = text.toUpperCase();
        const tokens: string[] = [];

        for (const ch of upper) {
            const code = this.charToCode.get(ch);
            if (code !== undefined) {
                tokens.push(code);
            } else {
                tokens.push(ch);
            }
        }

        return tokens.join(" ");
    }

    decode(text: string): string {
        if (/\s/.test(text)) {
            const tokens = text.split(/\s+/).filter(t => t.length > 0);
            return tokens.map(token => {
                if (/^[1-5][1-7]$/.test(token)) {
                    const row = parseInt(token[0], 10) - 1;
                    const col = parseInt(token[1], 10) - 1;
                    return this.table[row][col];
                } else {
                    return token;
                }
            }).join("");
        }

        let out = "";
        let i = 0;
        while (i < text.length) {
            const a = text[i];
            const b = text[i + 1];
            if (a && b && /[1-5]/.test(a) && /[1-7]/.test(b)) {
                const row = parseInt(a, 10) - 1;
                const col = parseInt(b, 10) - 1;
                out += this.table[row][col];
                i += 2;
            } else {
                out += a;
                i += 1;
            }
        }
        return out;
    }
}
