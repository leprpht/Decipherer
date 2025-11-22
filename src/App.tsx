import './index.css';
import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

const CaesarView = lazy(() => import('./views/Caesar'));

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
                    Projekt jest aplikacją webową umożliwiającą szyfrowanie i odszyfrowywanie tekstu za pomocą pięciu różnych technik szyfrowania. Program pozwala użytkownikowi zaszyfrowywać teksty za pomocą szyfrów: Cezara, Vigenère'a, Playfair, Trifid, (dodać później). Każdy z tych szyfrów jest zaimplementowany jako oddzielna klasa zgodna z interfejsem Cipher, co umożliwia łatwe rozszerzanie aplikacji.
                  </p>
                </div>
              }
            />
            <Route path="/caesar" element={<CaesarView />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
