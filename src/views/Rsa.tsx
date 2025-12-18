import '../index.css';
import { useState } from 'react';
import { RSACipher } from '../ciphers/rsa';

function RSAView() {
  const cipher = new RSACipher();

  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');

  const [pubKeyText, setPubKeyText] = useState('');
  const [privKeyText, setPrivKeyText] = useState('');

  const [bitLength, setBitLength] = useState(1024);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const parsePublicKey = (txt: string): { n: string; e: string } | null => {
    try {
      const obj = JSON.parse(txt) as unknown;
      if (
        typeof obj === 'object' &&
        obj !== null &&
        'n' in obj &&
        'e' in (obj as Record<string, unknown>) &&
        (typeof (obj as Record<string, unknown>).n === 'string' ||
          typeof (obj as Record<string, unknown>).n === 'number') &&
        (typeof (obj as Record<string, unknown>).e === 'string' ||
          typeof (obj as Record<string, unknown>).e === 'number')
      ) {
        return {
          n: String((obj as Record<string, unknown>).n),
          e: String((obj as Record<string, unknown>).e),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const parsePrivateKey = (txt: string): { n: string; d: string } | null => {
    try {
      const obj = JSON.parse(txt) as unknown;
      if (
        typeof obj === 'object' &&
        obj !== null &&
        'n' in obj &&
        'd' in (obj as Record<string, unknown>) &&
        (typeof (obj as Record<string, unknown>).n === 'string' ||
          typeof (obj as Record<string, unknown>).n === 'number') &&
        (typeof (obj as Record<string, unknown>).d === 'string' ||
          typeof (obj as Record<string, unknown>).d === 'number')
      ) {
        return {
          n: String((obj as Record<string, unknown>).n),
          d: String((obj as Record<string, unknown>).d),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleGenerateKeys = async () => {
    setMessage('');
    setGenerating(true);
    try {
      await cipher.generateKeys(bitLength, 65537n);
      if (cipher.publicKey) {
        setPubKeyText(JSON.stringify({ n: cipher.publicKey.n.toString(), e: cipher.publicKey.e.toString() }, null, 2));
      }
      if (cipher.privateKey) {
        setPrivKeyText(JSON.stringify({ n: cipher.privateKey.n.toString(), d: cipher.privateKey.d.toString() }, null, 2));
      }
      setMessage('Keys generated and loaded into the UI.');
    } catch (err) {
      setMessage(String(err));
    } finally {
      setGenerating(false);
    }
  };

  const handleLoadPublicKey = () => {
    setMessage('');
    const pk = parsePublicKey(pubKeyText);
    if (!pk) {
      setMessage('Invalid public key JSON. Expected { n: "...", e: "..." }');
      return;
    }
    try {
      cipher.setPublicKey(pk.n, pk.e);
      setMessage('Public key set on cipher instance.');
    } catch (err) {
      setMessage(String(err));
    }
  };

  const handleLoadPrivateKey = () => {
    setMessage('');
    const sk = parsePrivateKey(privKeyText);
    if (!sk) {
      setMessage('Invalid private key JSON. Expected { n: "...", d: "..." }');
      return;
    }
    try {
      cipher.setPrivateKey(sk.n, sk.d);
      setMessage('Private key set on cipher instance.');
    } catch (err) {
      setMessage(String(err));
    }
  };

  const handleEncode = () => {
    setMessage('');
    try {
      const pk = parsePublicKey(pubKeyText);
      const result = pk ? cipher.encode(plaintext, { n: pk.n, e: pk.e }) : cipher.encode(plaintext);
      setCiphertext(result);
    } catch (err) {
      setMessage(String(err));
    }
  };

  const handleDecode = () => {
    setMessage('');
    try {
      const sk = parsePrivateKey(privKeyText);
      const result = sk ? cipher.decode(ciphertext, { n: sk.n, d: sk.d }) : cipher.decode(ciphertext);
      setPlaintext(result);
    } catch (err) {
      setMessage(String(err));
    }
  };

  const handleClear = () => {
    setPlaintext('');
    setCiphertext('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 w-[800px] h-[800px] flex flex-col">
        <h1 className="text-4xl font-extrabold text-emerald-900 text-center">RSA Cipher</h1>

        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="flex flex-col gap-4">
            <label className="font-semibold">Plaintext</label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none transition resize-none"
              rows={6}
              placeholder="Enter text to encrypt"
            />

            <div className="flex gap-3">
              <button
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition font-semibold"
                onClick={handleEncode}
              >
                Encrypt
              </button>
              <button
                className="bg-emerald-200 text-emerald-800 px-6 py-2 rounded-lg hover:bg-emerald-300 transition font-semibold"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-semibold">Ciphertext</label>
            <textarea
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none transition resize-none"
              rows={6}
              placeholder="Ciphertext blocks"
            />

            <div className="flex gap-3">
              <button
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition font-semibold"
                onClick={handleDecode}
              >
                Decrypt
              </button>
              <button
                className="bg-emerald-200 text-emerald-800 px-6 py-2 rounded-lg hover:bg-emerald-300 transition font-semibold"
                onClick={() => {
                  setCiphertext('');
                  setPlaintext('');
                  setMessage('');
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <label className="font-semibold">Public Key (JSON)</label>
            <textarea
              value={pubKeyText}
              onChange={(e) => setPubKeyText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none transition resize-none"
              rows={5}
              placeholder='{"n":"...", "e":"..."}'
            />
            <div className="flex gap-3 mt-2">
              <button
                className="bg-emerald-200 text-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-300 transition font-semibold"
                onClick={handleLoadPublicKey}
              >
                Load Public Key (set on cipher)
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label className="font-semibold">Private Key (JSON)</label>
            <textarea
              value={privKeyText}
              onChange={(e) => setPrivKeyText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none transition resize-none"
              rows={5}
              placeholder='{"n":"...", "d":"..."}'
            />
            <div className="flex gap-3 mt-2">
              <button
                className="bg-emerald-200 text-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-300 transition font-semibold"
                onClick={handleLoadPrivateKey}
              >
                Load Private Key (set on cipher)
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-1">
            <label className="font-semibold">Key Generation</label>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="number"
                min={64}
                step={64}
                value={bitLength}
                onChange={(e) => setBitLength(Number(e.target.value))}
                className="w-[120px] p-2 border border-gray-300 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none"
              />
              <button
                onClick={handleGenerateKeys}
                disabled={generating}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition font-semibold disabled:opacity-60"
              >
                {generating ? 'Generating...' : 'Generate Keys'}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label className="font-semibold">Status</label>
            <div className="w-full p-3 border border-gray-100 rounded-lg text-sm text-gray-700 mt-2 min-h-[72px]">
              {message || <span className="text-gray-400">No messages</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RSAView;
