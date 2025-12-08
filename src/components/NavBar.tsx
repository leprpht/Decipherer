import '../index.css'
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const nav = useNavigate();

  return (
    <nav className="bg-emerald-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => nav('/')}>
          Decipherer
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => nav('/caesar')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Caesar
          </button>
          <button
            onClick={() => nav('/polybius')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Polybius
          </button>
          <button
            onClick={() => nav('/vigenere')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Vigenère
          </button>
          <button
            onClick={() => nav('/playfair')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Playfair
          </button>
          <button
            onClick={() => nav('/trifid')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Trifid
          </button>
          <button
            onClick={() => nav('/rsa')}
            className="px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            RSA
          </button>
        </div>
      </nav>
  )
}