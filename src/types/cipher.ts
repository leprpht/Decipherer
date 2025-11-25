export interface Cipher {
    alphabet: string;
    encode(text: string, key?: unknown): string;
    decode(text: string, key?: unknown): string;
}
  