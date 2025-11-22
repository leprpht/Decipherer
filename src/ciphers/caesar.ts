import type { Cipher } from "../types/cipher";

export class CaesarCipher implements Cipher {
    id: number = 1;
    alphabet: string = 'AĄBCĆDEĘFGHIJKLŁMNOÓPQRSŚTUVWXYZŹ';

    encode(text: string, key: number = 3): string {
        return text.toUpperCase().split('').map(char => {
            const index = this.alphabet.indexOf(char);
            if (index === -1) return char;
            const newIndex = (index + key) % this.alphabet.length;
            return this.alphabet[newIndex];
        }).join('');
    }

    decode(text: string, key: number = 3): string {
        return text.toUpperCase().split('').map(char => {
            const index = this.alphabet.indexOf(char);
            if (index === -1) return char;
            const newIndex = (index - key + this.alphabet.length) % this.alphabet.length;
            return this.alphabet[newIndex];
        }).join('');
    }
}