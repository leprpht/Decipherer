import type { Cipher } from "../types/cipher";

export class CaesarCipher implements Cipher {
    id: number = 1;

    encode(text: string, key: number = 3): string {
        return text.split('').map(char => {
            if (char >= 'a' && char <= 'z') {
                return String.fromCharCode((char.charCodeAt(0) - 97 + key) % 26 + 97);
            } else if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode((char.charCodeAt(0) - 65 + key) % 26 + 65);
            } else {
                return char;
            }
        }).join('');
    }

    decode(text: string, key: number = 3): string {
        return this.encode(text, 26 - key);
    }
}