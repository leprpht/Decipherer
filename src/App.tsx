import './index.css'
import { CaesarCipher } from './ciphers/caesar';

function App() {
  const caesar = new CaesarCipher();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl font-bold text-gray-800">{caesar.encode("text")}</p>
        <p className="text-2xl font-bold text-gray-800">{caesar.decode("text")}</p>
      </div>
    </>
  )
}

export default App
