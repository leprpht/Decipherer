export interface Cipher {
    id: number;
    alphabet: string;
    encode(text: string, key?: unknown): string;
    decode(text: string, key?: unknown): string;
}
  