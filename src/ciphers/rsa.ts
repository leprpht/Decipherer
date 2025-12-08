import type { Cipher } from "../types/cipher";

export interface RSAKeyPublic {
  n: bigint | string;
  e: bigint | string;
}

export interface RSAKeyPrivate {
  n: bigint | string;
  d: bigint | string;
}

export type RSAKey = RSAKeyPublic | RSAKeyPrivate;

export class RSACipher implements Cipher {
  alphabet = "";

  public publicKey: { n: bigint; e: bigint } | undefined;
  public privateKey: { n: bigint; d: bigint } | undefined;

  private randBetween(min: bigint, max: bigint): bigint {
    const range = max - min + 1n;
    const bits = range.toString(2).length;
    const bytes = Math.ceil(bits / 8);

    const buf = new Uint8Array(bytes);
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      crypto.getRandomValues(buf);
    } else {
      for (let i = 0; i < bytes; i++) buf[i] = Math.floor(Math.random() * 256);
    }

    let rnd = 0n;
    for (const b of buf) rnd = (rnd << 8n) + BigInt(b);

    return min + (rnd % range);
  }


  private modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = 1n;
    let b = base % mod;
    let e = exp;

    while (e > 0n) {
      if (e & 1n) result = (result * b) % mod;
      b = (b * b) % mod;
      e >>= 1n;
    }
    return result;
  }

  private async isProbablePrime(n: bigint, rounds = 8): Promise<boolean> {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    let s = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
      d /= 2n;
      s += 1n;
    }

    const tryComposite = (a: bigint): boolean => {
      let x = this.modPow(a, d, n);
      if (x === 1n || x === n - 1n) return false;

      for (let i = 1n; i < s; i++) {
        x = this.modPow(x, 2n, n);
        if (x === n - 1n) return false;
      }
      return true;
    };

    for (let i = 0; i < rounds; i++) {
      const a = this.randBetween(2n, n - 2n);
      if (tryComposite(a)) return false;
    }
    return true;
  }

  private async generatePrime(bits: number): Promise<bigint> {
    while (true) {
      const bytes = Math.ceil(bits / 8);
      const buf = new Uint8Array(bytes);

      crypto.getRandomValues(buf);

      buf[0] |= 0x80;
      buf[buf.length - 1] |= 1;

      let n = 0n;
      for (const b of buf) n = (n << 8n) + BigInt(b);

      if (await this.isProbablePrime(n)) return n;
    }
  }

  private egcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
    if (b === 0n) return [a, 1n, 0n];
    const [g, x1, y1] = this.egcd(b, a % b);
    return [g, y1, x1 - (a / b) * y1];
  }

  private modInv(a: bigint, m: bigint): bigint {
    const [g, x] = this.egcd(a, m);
    if (g !== 1n) throw new Error("No modular inverse");
    return ((x % m) + m) % m;
  }

  async generateKeys(bitLength = 1024, e = 65537n): Promise<void> {
    const half = Math.floor(bitLength / 2);
    const p = await this.generatePrime(half);
    let q = await this.generatePrime(half);

    while (p === q) q = await this.generatePrime(half);

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    const d = this.modInv(e, phi);

    this.publicKey = { n, e };
    this.privateKey = { n, d };
  }

  setPublicKey(n: bigint | string, e: bigint | string): void {
    this.publicKey = {
      n: typeof n === "string" ? BigInt(n) : n,
      e: typeof e === "string" ? BigInt(e) : e,
    };
  }

  setPrivateKey(n: bigint | string, d: bigint | string): void {
    this.privateKey = {
      n: typeof n === "string" ? BigInt(n) : n,
      d: typeof d === "string" ? BigInt(d) : d,
    };
  }

  private bitLength(n: bigint): number {
    return n.toString(2).length;
  }

  private textToBlocks(text: string, n: bigint): bigint[] {
    const bytes = new TextEncoder().encode(text);
    const maxBytes = Math.floor((this.bitLength(n) - 1) / 8);

    const blocks: bigint[] = [];
    for (let i = 0; i < bytes.length; i += maxBytes) {
      let m = 0n;
      for (const b of bytes.slice(i, i + maxBytes)) {
        m = (m << 8n) + BigInt(b);
      }
      blocks.push(m);
    }
    return blocks;
  }

  private blocksToText(blocks: bigint[], n: bigint): string {
    const maxBytes = Math.floor((this.bitLength(n) - 1) / 8);

    const out: number[] = [];

    for (const m of blocks) {
      const arr = new Array<number>(maxBytes).fill(0);
      let tmp = m;

      for (let i = maxBytes - 1; i >= 0; i--) {
        arr[i] = Number(tmp & 0xffn);
        tmp >>= 8n;
      }
      out.push(...arr);
    }

    while (out.length > 0 && out[0] === 0) out.shift();

    return new TextDecoder().decode(new Uint8Array(out));
  }

  encode(text: string, key?: RSAKey): string {
    const pub =
      key && "e" in key
        ? { n: BigInt(key.n), e: BigInt(key.e) }
        : this.publicKey;

    if (!pub) throw new Error("Public key missing");

    const blocks = this.textToBlocks(text, pub.n);
    const encrypted = blocks.map((m) =>
      this.modPow(m, pub.e, pub.n).toString()
    );

    return encrypted.join(" ");
  }

  decode(text: string, key?: RSAKey): string {
    const priv =
      key && "d" in key
        ? { n: BigInt(key.n), d: BigInt(key.d) }
        : this.privateKey;

    if (!priv) throw new Error("Private key missing");

    const ciphertext = text
      .trim()
      .split(/\s+/)
      .map((b) => BigInt(b));

    const blocks = ciphertext.map((c) =>
      this.modPow(c, priv.d, priv.n)
    );

    return this.blocksToText(blocks, priv.n);
  }
}
