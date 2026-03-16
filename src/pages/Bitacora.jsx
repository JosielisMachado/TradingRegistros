import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Link, useNavigate } from 'react-router-dom'

const COLUMNAS_ORDEN = [
  { value: 'fecha_hora',        label: 'Fecha' },
  { value: 'activo',            label: 'Activo' },
  { value: 'resultado_dinero',  label: 'Resultado $' },
  { value: 'resultado_porcent', label: 'Resultado %' },
  { value: 'tamano_posicion',   label: 'Tamano' },
]

export default function Bitacora() {
  const navigate = useNavigate()
  const [ops, setOps]           = useState([])
  const [loading, setLoading]   = useState(true)
  const [ordenCol, setOrdenCol] = useState('fecha_hora')
  const [ordenDir, setOrdenDir] = useState('desc')
  const [filtroActivo, setFiltroActivo] = useState('')
  const [filtroDir, setFiltroDir]       = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [activos, setActivos]           = useState([])
  const [expandida, setExpandida]       = useState(null)
  const [eliminando, setEliminando]     = useState(null)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const cargarDatos = async () => {
    setLoading(true)
    let q = supabase.from('operaciones').select('*').order(ordenCol, { ascending: ordenDir === 'asc' })
    if (filtroActivo) q = q.eq('activo', filtroActivo)
    if (filtroDir)    q = q.eq('direccion', filtroDir)
    if (filtroEstado) q = q.eq('estado', filtroEstado)
    const { data, error } = await q
    if (!error && data) {
      setOps(data)
      setActivos([...new Set(data.map(o => o.activo))])
    }
    setLoading(false)
  }

  useEffect(() => { cargarDatos() }, [ordenCol, ordenDir, filtroActivo, filtroDir, filtroEstado])

  const toggleOrden = (col) => {
    if (ordenCol === col) setOrdenDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setOrdenCol(col); setOrdenDir('desc') }
  }

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar esta operacion?')) return
    setEliminando(id)
    await supabase.from('operaciones').delete().eq('id', id)
    await cargarDatos()
    setEliminando(null)
  }

  const totalPnl  = ops.reduce((s, o) => s + (o.resultado_dinero || 0), 0)
  const ganadoras = ops.filter(o => (o.resultado_dinero || 0) > 0).length
  const winRate   = ops.length ? ((ganadoras / ops.length) * 100).toFixed(1) : 0
  const hayFiltros = filtroActivo || filtroDir || filtroEstado

  const fmtPrecio = (n) => n != null ? Number(n).toFixed(5) : '-'

  const fmtDinero = (n) => {
    if (n == null) return <span className="text-gray-500">-</span>
    return n >= 0
      ? <span className="text-green-400 font-semibold">+${Number(n).toFixed(2)}</span>
      : <span className="text-red-400 font-semibold">-${Math.abs(Number(n)).toFixed(2)}</span>
  }

  const fmtPorcent = (n) => {
    if (n == null) return <span className="text-gray-500">-</span>
    return n >= 0
      ? <span className="text-green-400">+{Number(n).toFixed(2)}%</span>
      : <span className="text-red-400">{Number(n).toFixed(2)}%</span>
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-green-400">Bitacora</h1>
        <Link to="/nueva"
          className="px-3 py-2 md:px-4 bg-green-500 text-gray-950 rounded-lg font-semibold text-sm hover:bg-green-400 transition-colors">
          + Nueva
        </Link>
      </div>

      {/* Resumen — 2 cols mobile, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 md:p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Operaciones</p>
          <p className="text-xl md:text-2xl font-bold text-white">{ops.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 md:p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">P&L Total</p>
          <p className={`text-xl md:text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 md:p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Win Rate</p>
          <p className={`text-xl md:text-2xl font-bold ${parseFloat(winRate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            {winRate}%
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 md:p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ganadoras</p>
          <p className="text-xl md:text-2xl font-bold text-blue-400">{ganadoras}/{ops.length}</p>
        </div>
      </div>

      {/* Filtros colapsables en mobile */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <button onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 md:hidden">
          <span className="flex items-center gap-2">
            Filtros
            {hayFiltros && <span className="w-2 h-2 rounded-full bg-green-400" />}
          </span>
          <span>{filtrosAbiertos ? '▲' : '▼'}</span>
        </button>
        <div className={`${filtrosAbiertos ? 'block' : 'hidden'} md:block px-4 py-3 border-t border-gray-800 md:border-t-0`}>
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Activo</label>
              <select value={filtroActivo} onChange={e => setFiltroActivo(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500">
                <option value="">Todos</option>
                {activos.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Direccion</label>
              <select value={filtroDir} onChange={e => setFiltroDir(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500">
                <option value="">Todas</option>
                <option value="COMPRA">Compra</option>
                <option value="VENTA">Venta</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500">
                <option value="">Todos</option>
                <option value="CERRADA">Cerrada</option>
                <option value="ABIERTA">Abierta</option>
              </select>
            </div>
            {hayFiltros && (
              <button onClick={() => { setFiltroActivo(''); setFiltroDir(''); setFiltroEstado('') }}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ordenar chips — solo mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {COLUMNAS_ORDEN.map(({ value, label }) => (
          <button key={value} onClick={() => toggleOrden(value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors
              ${ordenCol === value ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
            {label} {ordenCol === value ? (ordenDir === 'asc' ? '↑' : '↓') : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Cargando...</div>
      ) : ops.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Sin operaciones. <Link to="/nueva" className="text-green-400 hover:underline">Agrega la primera</Link>
        </div>
      ) : (
        <>
          {/* CARDS — mobile */}
          <div className="md:hidden space-y-3">
            {ops.map(op => (
              <div key={op.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandida(expandida === op.id ? null : op.id)}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${op.direccion === 'COMPRA' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="font-bold text-white text-sm">{op.activo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(op.fecha_hora).toLocaleDateString('es-UY')} · {new Date(op.fecha_hora).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{fmtDinero(op.resultado_dinero)}</div>
                    <div className="text-xs">{fmtPorcent(op.resultado_porcent)}</div>
                  </div>
                </div>

                <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${op.direccion === 'COMPRA' ? 'bg-green-900/60 text-green-400' : 'bg-red-900/60 text-red-400'}`}>
                    {op.direccion}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${op.estado === 'CERRADA' ? 'bg-gray-800 text-gray-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {op.estado}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">{fmtPrecio(op.precio_entrada)}</span>
                </div>

                {expandida === op.id && (
                  <div className="border-t border-gray-800 px-4 py-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { label: 'Salida',      val: fmtPrecio(op.precio_salida),  color: 'text-gray-300' },
                        { label: 'Tamano',      val: op.tamano_posicion,            color: 'text-gray-300' },
                        { label: 'Stop Loss',   val: fmtPrecio(op.stop_loss),       color: 'text-red-400'  },
                        { label: 'Take Profit', val: fmtPrecio(op.take_profit),     color: 'text-blue-400' },
                      ].map(({ label, val, color }) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                          <p className={color}>{val}</p>
                        </div>
                      ))}
                    </div>
                    {op.motivo_tecnico && <div><p className="text-xs text-gray-500 mb-0.5">Motivo</p><p className="text-gray-300 text-sm">{op.motivo_tecnico}</p></div>}
                    {op.emociones     && <div><p className="text-xs text-gray-500 mb-0.5">Emociones</p><p className="text-gray-300 text-sm">{op.emociones}</p></div>}
                    {op.errores       && <div><p className="text-xs text-gray-500 mb-0.5">Errores</p><p className="text-gray-300 text-sm">{op.errores}</p></div>}
                    {(op.imagen_antes || op.imagen_despues) && (
                      <div className="flex gap-3">
                        {op.imagen_antes   && <div><p className="text-xs text-gray-500 mb-1">Antes</p><img src={op.imagen_antes}   alt="antes"   className="h-24 rounded-lg border border-gray-700 cursor-pointer" onClick={() => window.open(op.imagen_antes)}   /></div>}
                        {op.imagen_despues && <div><p className="text-xs text-gray-500 mb-1">Despues</p><img src={op.imagen_despues} alt="despues" className="h-24 rounded-lg border border-gray-700 cursor-pointer" onClick={() => window.open(op.imagen_despues)} /></div>}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => navigate(`/editar/${op.id}`)}
                        className="flex-1 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                        ✎ Editar
                      </button>
                      <button onClick={() => eliminar(op.id)} disabled={eliminando === op.id}
                        className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                        {eliminando === op.id ? '...' : '✕ Eliminar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* TABLA — desktop */}
          <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                    {COLUMNAS_ORDEN.map(({ value, label }) => (
                      <th key={value} onClick={() => toggleOrden(value)}
                        className="px-4 py-3 text-left cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap">
                        {label} {ordenCol === value ? (ordenDir === 'asc' ? '↑' : '↓') : '↕'}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left">Dir.</th>
                    <th className="px-4 py-3 text-left">Entrada</th>
                    <th className="px-4 py-3 text-left">Salida</th>
                    <th className="px-4 py-3 text-left">SL</th>
                    <th className="px-4 py-3 text-left">TP</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ops.map(op => (
                    <>
                      <tr key={op.id}
                        className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors cursor-pointer"
                        onClick={() => setExpandida(expandida === op.id ? null : op.id)}>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                          {new Date(op.fecha_hora).toLocaleDateString('es-UY')}<br />
                          <span className="text-xs text-gray-500">{new Date(op.fecha_hora).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-white">{op.activo}</td>
                        <td className="px-4 py-3 font-semibold">{fmtDinero(op.resultado_dinero)}</td>
                        <td className="px-4 py-3">{fmtPorcent(op.resultado_porcent)}</td>
                        <td className="px-4 py-3 text-gray-300">{op.tamano_posicion}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${op.direccion === 'COMPRA' ? 'bg-green-900/60 text-green-400' : 'bg-red-900/60 text-red-400'}`}>{op.direccion}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{fmtPrecio(op.precio_entrada)}</td>
                        <td className="px-4 py-3 text-gray-400">{fmtPrecio(op.precio_salida)}</td>
                        <td className="px-4 py-3 text-red-400">{fmtPrecio(op.stop_loss)}</td>
                        <td className="px-4 py-3 text-blue-400">{fmtPrecio(op.take_profit)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${op.estado === 'CERRADA' ? 'bg-gray-800 text-gray-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{op.estado}</span>
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`/editar/${op.id}`)} title="Editar"
                              className="text-gray-500 hover:text-yellow-400 transition-colors text-xs px-2 py-1 rounded hover:bg-yellow-900/20">✎</button>
                            <button onClick={() => eliminar(op.id)} disabled={eliminando === op.id} title="Eliminar"
                              className="text-gray-500 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded hover:bg-red-900/20">
                              {eliminando === op.id ? '...' : '✕'}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandida === op.id && (
                        <tr key={`exp-${op.id}`} className="bg-gray-800/30">
                          <td colSpan={12} className="px-6 py-4">
                            <div className="grid grid-cols-3 gap-6 text-sm">
                              <div><p className="text-xs text-gray-500 uppercase mb-1">Motivo tecnico</p><p className="text-gray-300">{op.motivo_tecnico || '-'}</p></div>
                              <div><p className="text-xs text-gray-500 uppercase mb-1">Emociones</p><p className="text-gray-300">{op.emociones || '-'}</p></div>
                              <div><p className="text-xs text-gray-500 uppercase mb-1">Errores</p><p className="text-gray-300">{op.errores || '-'}</p></div>
                              {(op.imagen_antes || op.imagen_despues) && (
                                <div className="col-span-3 flex gap-4 mt-2">
                                  {op.imagen_antes   && <div><p className="text-xs text-gray-500 mb-1">Antes</p><img src={op.imagen_antes}   alt="antes"   className="h-32 rounded-lg border border-gray-700 cursor-pointer hover:opacity-80" onClick={() => window.open(op.imagen_antes)}   /></div>}
                                  {op.imagen_despues && <div><p className="text-xs text-gray-500 mb-1">Despues</p><img src={op.imagen_despues} alt="despues" className="h-32 rounded-lg border border-gray-700 cursor-pointer hover:opacity-80" onClick={() => window.open(op.imagen_despues)} /></div>}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
