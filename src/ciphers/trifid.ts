import type { Cipher } from "../types/cipher";

export class TrifidCipher implements Cipher {
  id: number = 7;

  private grids: string[][][] = [
    [['R', 'V', 'A'], ['N', 'I', 'C'], ['Q', 'O', 'Z']],
    [['E', 'J', 'B'], ['S', 'L', 'W'], ['Y', 'K', 'H']],
    [['P', 'F', 'U'], ['M', 'G', '*'], ['D', 'T', 'X']],
  ];

  alphabet: string = this.grids.flat(2).join('');

  private charToCode: Record<string, string> = {};
  private codeToChar: Record<string, string> = {};

  constructor() {
    for (let l = 0; l < this.grids.length; l++) {
      for (let r = 0; r < this.grids[l].length; r++) {
        for (let c = 0; c < this.grids[l][r].length; c++) {
          const ch = this.grids[l][r][c];
          const code = `${l + 1}${r + 1}${c + 1}`;
          this.charToCode[ch] = code;
          this.codeToChar[code] = ch;
        }
      }
    }
  }

  encode(text: string): string {
    const cleaned = String(text).toUpperCase().replace(/[^A-Z*]/g, '');

    let numbers = '';
    for (const ch of cleaned) {
      const code = this.charToCode[ch];
      if (code) numbers += code;
    }

    let first = '';
    let second = '';
    let third = '';
    for (let i = 0; i < numbers.length; i += 3) {
      if (i + 2 < numbers.length) {
        first += numbers.charAt(i);
        second += numbers.charAt(i + 1);
        third += numbers.charAt(i + 2);
      }
    }

    const combined = first + second + third;

    let encoded = '';
    for (let i = 0; i < combined.length; i += 3) {
      if (i + 2 >= combined.length) break; // safety
      const l = Number(combined.charAt(i)) - 1;
      const r = Number(combined.charAt(i + 1)) - 1;
      const c = Number(combined.charAt(i + 2)) - 1;

      if (
        l < 0 || l >= this.grids.length ||
        r < 0 || r >= this.grids[0].length ||
        c < 0 || c >= this.grids[0][0].length
      ) {
        continue;
      }
      encoded += this.grids[l][r][c];
    }
    return encoded;
  }

  decode(text: string): string {
    const cleaned = String(text).toUpperCase().replace(/[^A-Z*]/g, '');

    let numbers = '';
    for (const ch of cleaned) {
      const code = this.charToCode[ch];
      if (code) numbers += code;
    }

    if (numbers.length === 0) return '';

    const total = numbers.length;
    const part = Math.floor(total / 3);

    const first = numbers.substring(0, part);
    const second = numbers.substring(part, 2 * part);
    const third = numbers.substring(2 * part);

    let decoded = '';
    for (let i = 0; i < first.length; i++) {
      const l = Number(first.charAt(i)) - 1;
      const r = Number(second.charAt(i)) - 1;
      const c = Number(third.charAt(i)) - 1;

      if (
        l < 0 || l >= this.grids.length ||
        r < 0 || r >= this.grids[0].length ||
        c < 0 || c >= this.grids[0][0].length
      ) {
        continue;
      }
      decoded += this.grids[l][r][c];
    }
    return decoded;
  }
}
