import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AyudaModal from './AyudaModal'

export default function Navbar() {
  const { pathname } = useLocation()
  const [ayuda, setAyuda] = useState(false)

  const links = [
    { to: '/',         label: 'Bitacora' },
    { to: '/nueva',    label: '+ Nueva Operacion' },
    { to: '/analisis', label: 'Analisis' },
  ]

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-green-400 font-bold text-lg tracking-wide">
            Trading Registros
          </span>
          <div className="flex items-center gap-2">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pathname === to
                    ? 'bg-green-500 text-gray-950'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => setAyuda(true)}
              title="Ayuda"
              className="ml-2 w-8 h-8 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-green-500 transition-colors text-sm font-bold flex items-center justify-center">
              ?
            </button>
          </div>
        </div>
      </nav>

      {ayuda && <AyudaModal onClose={() => setAyuda(false)} />}
    </>
  )
}
