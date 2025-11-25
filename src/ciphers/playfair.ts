import type { Cipher } from "../types/cipher";

export class PlayfairCipher implements Cipher {
  id: number = 4;
  alphabet: string = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ';

  private rows = 5;
  private cols = 7;
  private grid: string[][] = [];

  constructor() {
    const chars = this.alphabet.toUpperCase().split('');
    let idx = 0;
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = chars[idx++];
      }
    }
  }

  private indexInGrid(ch: string): [number, number] {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === ch) return [r, c];
      }
    }
    return [-1, -1];
  }

  encode(text: string): string {
    const cleaned = text
      .toUpperCase()
      .replace(/\s+/g, '')
      .split('')
      .filter(ch => this.alphabet.indexOf(ch) !== -1)
      .join('');

    const padChar = 'X';
    const toEncode = cleaned.length % 2 === 1 ? cleaned + padChar : cleaned;

    let out = '';
    for (let i = 0; i < toEncode.length; i += 2) {
      const a = toEncode[i];
      const b = toEncode[i + 1];

      const [r1, c1] = this.indexInGrid(a);
      const [r2, c2] = this.indexInGrid(b);

      if (r1 === -1 || r2 === -1) {
        throw new Error(`Character not in alphabet: ${r1 === -1 ? a : b}`);
      }

      if (r1 === r2) {
        const nc1 = (c1 + 1) % this.cols;
        const nc2 = (c2 + 1) % this.cols;
        out += this.grid[r1][nc1] + this.grid[r2][nc2];
      } else if (c1 === c2) {
        const nr1 = (r1 + 1) % this.rows;
        const nr2 = (r2 + 1) % this.rows;
        out += this.grid[nr1][c1] + this.grid[nr2][c2];
      } else {
        out += this.grid[r1][c2] + this.grid[r2][c1];
      }
    }

    return out;
  }

  decode(text: string): string {
    const cleaned = text
      .toUpperCase()
      .replace(/\s+/g, '')
      .split('')
      .filter(ch => this.alphabet.indexOf(ch) !== -1)
      .join('');

    let out = '';
    for (let i = 0; i < cleaned.length; i += 2) {
      const a = cleaned[i];
      const b = cleaned[i + 1] ?? 'X';

      const [r1, c1] = this.indexInGrid(a);
      const [r2, c2] = this.indexInGrid(b);

      if (r1 === -1 || r2 === -1) {
        throw new Error(`Character not in alphabet: ${r1 === -1 ? a : b}`);
      }

      if (r1 === r2) {
        const nc1 = (c1 - 1 + this.cols) % this.cols;
        const nc2 = (c2 - 1 + this.cols) % this.cols;
        out += this.grid[r1][nc1] + this.grid[r2][nc2];
      } else if (c1 === c2) {
        const nr1 = (r1 - 1 + this.rows) % this.rows;
        const nr2 = (r2 - 1 + this.rows) % this.rows;
        out += this.grid[nr1][c1] + this.grid[nr2][c2];
      } else {
        out += this.grid[r1][c2] + this.grid[r2][c1];
      }
    }

    return out;
  }
}
