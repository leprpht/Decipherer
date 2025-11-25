import type { Cipher } from "../types/cipher";

export class VigenereCipher implements Cipher {
    id: number = 3;
    alphabet: string = 'AĄBCĆDEĘFGHIJKLŁMNOÓPRSŚTUVWXYZŹ';

    encode(text: string, key: unknown = ''): string {
        const rawKey = String(key ?? '').toUpperCase();
        const filteredKey = rawKey.split('').filter(k => this.alphabet.indexOf(k) !== -1);
        if (filteredKey.length === 0) return text.toUpperCase();

        let keyPos = 0;
        const len = this.alphabet.length;

        return text.toUpperCase().split('').map(char => {
            const idx = this.alphabet.indexOf(char);
            if (idx === -1) return char;

            const kchar = filteredKey[keyPos % filteredKey.length];
            const kidx = this.alphabet.indexOf(kchar);
            const newIdx = (idx + kidx) % len;

            keyPos++;
            return this.alphabet[newIdx];
        }).join('');
    }

    decode(text: string, key: unknown = ''): string {
        const rawKey = String(key ?? '').toUpperCase();
        const filteredKey = rawKey.split('').filter(k => this.alphabet.indexOf(k) !== -1);
        if (filteredKey.length === 0) return text.toUpperCase();

        let keyPos = 0;
        const len = this.alphabet.length;

        return text.toUpperCase().split('').map(char => {
            const idx = this.alphabet.indexOf(char);
            if (idx === -1) return char;

            const kchar = filteredKey[keyPos % filteredKey.length];
            const kidx = this.alphabet.indexOf(kchar);
            const newIdx = (idx - kidx + len) % len;

            keyPos++;
            return this.alphabet[newIdx];
        }).join('');
    }
}
