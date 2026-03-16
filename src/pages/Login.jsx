import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [modo, setModo]       = useState('login') // 'login' | 'registro'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMensaje(null)

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMensaje('Cuenta creada. Ya podes iniciar sesion.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">📈</p>
          <h1 className="text-2xl font-bold text-white">Trading Registros</h1>
          <p className="text-gray-500 text-sm mt-1">Tu bitacora personal de trading</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          {/* Tabs */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
            {[
              { key: 'login',    label: 'Iniciar sesion' },
              { key: 'registro', label: 'Crear cuenta'   },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => { setModo(key); setError(null); setMensaje(null) }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                  ${modo === key ? 'bg-green-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contrasena</label>
              <input
                type="password" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Minimo 6 caracteres"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}
            {mensaje && (
              <div className="bg-green-900/40 border border-green-700/50 text-green-300 rounded-xl px-4 py-3 text-sm">
                {mensaje}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-green-500 text-gray-950 font-bold rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 mt-2">
              {loading
                ? 'Procesando...'
                : modo === 'login' ? 'Entrar' : 'Crear cuenta'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Tus datos son privados y solo vos podes verlos.
        </p>
      </div>
    </div>
  )
}
