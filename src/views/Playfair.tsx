import '../index.css';
import { useState } from 'react';
import { PlayfairCipher } from '../ciphers/playfair';

function Playfair() {
  const playfair = new PlayfairCipher();
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    try {
      setOutput(playfair.encode(text));
    } catch (err) {
      setOutput(String(err));
    }
  };

  const handleDecode = () => {
    try {
      setOutput(playfair.decode(text));
    } catch (err) {
      setOutput(String(err));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 w-[600px] h-[600px] flex flex-col">
        <h1 className="text-4xl font-extrabold text-emerald-900 text-center">
          Playfair Cipher
        </h1>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="inputText">
              Input Text
            </label>
            <textarea
              id="inputText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none transition resize-none"
              rows={4}
              placeholder="Enter text to encode or decode"
            ></textarea>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition font-semibold"
              onClick={handleEncode}
            >
              Encode
            </button>
            <button
              className="bg-emerald-200 text-emerald-800 px-6 py-2 rounded-lg hover:bg-emerald-300 transition font-semibold"
              onClick={handleDecode}
            >
              Decode
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1 overflow-auto break-words whitespace-pre-wrap">
          {output ? (
            <div className="text-sm">{output}</div>
          ) : (
            <span className="text-gray-400">
              Your encoded/decoded text will appear here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Playfair;
