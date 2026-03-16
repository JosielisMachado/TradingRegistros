import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Bitacora from './pages/Bitacora'
import NuevaOperacion from './pages/NuevaOperacion'
import Analisis from './pages/Analisis'
import EditarOperacion from './pages/EditarOperacion'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/"           element={<Bitacora />} />
          <Route path="/nueva"      element={<NuevaOperacion />} />
          <Route path="/analisis"   element={<Analisis />} />
          <Route path="/editar/:id" element={<EditarOperacion />} />
        </Routes>
      </main>
    </div>
  )
}
