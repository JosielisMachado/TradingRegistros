import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Bitacora from './pages/Bitacora'
import NuevaOperacion from './pages/NuevaOperacion'
import Analisis from './pages/Analisis'
import EditarOperacion from './pages/EditarOperacion'
import Login from './pages/Login'

function PantallaCarga() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-4xl">📈</p>
      <p className="text-green-400 font-bold text-lg tracking-wide">Trading Registros</p>
      <div className="flex gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

function RutaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PantallaCarga />
  return user ? children : <Navigate to="/login" replace />
}

function AppInterna() {
  const { user, loading } = useAuth()

  if (loading) return <PantallaCarga />

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {user && <Navbar />}
      <main className={user ? 'max-w-7xl mx-auto px-6 sm:px-10 py-8' : ''}>
        <Routes>
          <Route path="/login"      element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/"           element={<RutaProtegida><Bitacora /></RutaProtegida>} />
          <Route path="/nueva"      element={<RutaProtegida><NuevaOperacion /></RutaProtegida>} />
          <Route path="/analisis"   element={<RutaProtegida><Analisis /></RutaProtegida>} />
          <Route path="/editar/:id" element={<RutaProtegida><EditarOperacion /></RutaProtegida>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInterna />
    </AuthProvider>
  )
}
