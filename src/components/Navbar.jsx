import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AyudaModal from './AyudaModal'

export default function Navbar() {
  const { pathname } = useLocation()
  const [ayuda, setAyuda] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  const links = [
    { to: '/',         label: 'Bitacora',         icon: '📋' },
    { to: '/nueva',    label: 'Nueva Operacion',  icon: '➕' },
    { to: '/analisis', label: 'Analisis',          icon: '📊' },
  ]

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <span className="text-green-400 font-bold text-base md:text-lg tracking-wide">
            📈 Trading Registros
          </span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pathname === to
                    ? 'bg-green-500 text-gray-950'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {label}
              </Link>
            ))}
            <button onClick={() => setAyuda(true)}
              className="ml-2 w-8 h-8 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-green-500 transition-colors text-sm font-bold flex items-center justify-center">
              ?
            </button>
          </div>

          {/* Mobile: ayuda + hamburguesa */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setAyuda(true)}
              className="w-8 h-8 rounded-full border border-gray-700 text-gray-400 text-sm font-bold flex items-center justify-center">
              ?
            </button>
            <button onClick={() => setMenuAbierto(!menuAbierto)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-200 ${menuAbierto ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-200 ${menuAbierto ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-200 ${menuAbierto ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuAbierto && (
          <div className="md:hidden mt-3 border-t border-gray-800 pt-3 flex flex-col gap-1">
            {links.map(({ to, label, icon }) => (
              <Link key={to} to={to}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${pathname === to
                    ? 'bg-green-500 text-gray-950'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <span>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {ayuda && <AyudaModal onClose={() => setAyuda(false)} />}
    </>
  )
}
