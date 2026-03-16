import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Bitacora from './pages/Bitacora'
import NuevaOperacion from './pages/NuevaOperacion'
import Analisis from './pages/Analisis'
import EditarOperacion from './pages/EditarOperacion'
import Login from './pages/Login'

function RutaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AppInterna() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {user && <Navbar />}
      <main className={user ? 'max-w-7xl mx-auto px-4 py-8' : ''}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<RutaProtegida><Bitacora /></RutaProtegida>} />
          <Route path="/nueva" element={<RutaProtegida><NuevaOperacion /></RutaProtegida>} />
          <Route path="/analisis" element={<RutaProtegida><Analisis /></RutaProtegida>} />
          <Route path="/editar/:id" element={<RutaProtegida><EditarOperacion /></RutaProtegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
