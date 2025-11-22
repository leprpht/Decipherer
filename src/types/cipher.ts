export interface Cipher {
    id: number;
    encode(text: string, key?: unknown): string;
    decode(text: string, key?: unknown): string;
    defaultOptions?(): unknown;
}
  