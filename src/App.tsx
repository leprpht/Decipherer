import './index.css';
import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

const CaesarView = lazy(() => import('./views/Caesar'));
const PolybiusView = lazy(() => import('./views/Polybius'));
const VigenereView = lazy(() => import('./views/Vigenere'));
const PlayfairView = lazy(() => import('./views/Playfair'));
const TrifidView = lazy(() => import('./views/Trifid'));
const RSAView = lazy(() => import('./views/Rsa'));

function App() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-emerald-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => nav('/')}>
          Decipherer
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => nav('/')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Home
          </button>
          <button
            onClick={() => nav('/caesar')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Caesar Cipher
          </button>
          <button
            onClick={() => nav('/polybius')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Polybius Cipher
          </button>
          <button
            onClick={() => nav('/vigenere')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Vigenère Cipher
          </button>
          <button
            onClick={() => nav('/playfair')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Playfair Cipher
          </button>
          <button
            onClick={() => nav('/trifid')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Trifid Cipher
          </button>
          <button
            onClick={() => nav('/rsa')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            RSA Cipher
          </button>
        </div>
      </nav>

      <main className="p-8 flex flex-col items-center">
        <Suspense fallback={<div className="text-gray-500">Loading…</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                  <h2 className="text-4xl font-extrabold text-emerald-900 text-center">
                    Projekt zaliczeniowy z przedmiotu Bezpieczeństwo systemów informatycznych
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-justify">
                    Projekt jest aplikacją webową umożliwiającą szyfrowanie i odszyfrowywanie tekstu za pomocą sześciu różnych technik szyfrowania. Program pozwala użytkownikowi zaszyfrowywać teksty za pomocą szyfrów: Cezara, Polibiusza, Vigenère'a, Playfair, Trifid, (dodać później). Każdy z tych szyfrów jest zaimplementowany jako oddzielna klasa zgodna z interfejsem Cipher, co umożliwia łatwe rozszerzanie aplikacji.
                  </p>
                </div>
              }
            />
            <Route path="/caesar" element={<CaesarView />} />
            <Route path="/polybius" element={<PolybiusView />} />
            <Route path="/vigenere" element={<VigenereView />} />
            <Route path="/playfair" element={<PlayfairView />} />
            <Route path="/trifid" element={<TrifidView />} />
            <Route path="/rsa" element={<RSAView />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
