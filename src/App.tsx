import './index.css';
import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

const CaesarView = lazy(() => import('./views/Caesar'));

function App() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <nav className="bg-gray-800 text-white p-4 flex gap-10 top-0 shadow-md z-10">
        <button 
          onClick={() => nav('/')} 
          className="px-3 py-1 rounded hover:bg-gray-700 transition"
        >
          Home
        </button>
        <button 
          onClick={() => nav('/caesar')} 
          className="px-3 py-1 rounded hover:bg-gray-700 transition"
        >
          Caesar Cipher
        </button>
      </nav>

      <main className="p-6 flex flex-col items-center">
        <Suspense fallback={<div className="text-gray-700">Loading…</div>}>
          <Routes>
            <Route path="/caesar" element={<CaesarView />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
