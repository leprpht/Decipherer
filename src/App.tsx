import './index.css';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';

const CaesarView = lazy(() => import('./views/Caesar'));
const PolybiusView = lazy(() => import('./views/Polybius'));
const VigenereView = lazy(() => import('./views/Vigenere'));
const PlayfairView = lazy(() => import('./views/Playfair'));
const TrifidView = lazy(() => import('./views/Trifid'));
const RSAView = lazy(() => import('./views/Rsa'));

function App() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <NavBar />

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
