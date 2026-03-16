import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const PERIODOS = [
  { label: 'Madrugada', min: 0,  max: 6  },
  { label: 'Manana',    min: 6,  max: 12 },
  { label: 'Tarde',     min: 12, max: 18 },
  { label: 'Noche',     min: 18, max: 24 },
]
const COLORES = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899']

export default function Analisis() {
  const [ops, setOps] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordenActivos, setOrdenActivos] = useState('desc')
  const [ordenDias, setOrdenDias] = useState('desc')
  const [ordenPeriodos, setOrdenPeriodos] = useState('desc')

  useEffect(() => {
    supabase
      .from('operaciones')
      .select('*')
      .eq('estado', 'CERRADA')
      .then(({ data }) => {
        setOps(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-500">Calculando analisis...</div>

  if (ops.length === 0) return (
    <div className="text-center py-20 text-gray-500">
      No hay operaciones cerradas para analizar todavia.
    </div>
  )

  // --- CALCULOS GENERALES ---
  const cerradas = ops.filter(o => o.resultado_dinero != null)
  const totalPnl = cerradas.reduce((s, o) => s + Number(o.resultado_dinero), 0)
  const ganadoras = cerradas.filter(o => Number(o.resultado_dinero) > 0)
  const perdedoras = cerradas.filter(o => Number(o.resultado_dinero) < 0)
  const winRate = cerradas.length ? (ganadoras.length / cerradas.length * 100).toFixed(1) : 0
  const avgGanancia = ganadoras.length ? ganadoras.reduce((s, o) => s + Number(o.resultado_dinero), 0) / ganadoras.length : 0
  const avgPerdida = perdedoras.length ? perdedoras.reduce((s, o) => s + Number(o.resultado_dinero), 0) / perdedoras.length : 0
  const factorGanancia = avgPerdida !== 0 ? Math.abs(avgGanancia / avgPerdida).toFixed(2) : 'N/A'

  // Porciento tomado vs posible
  const conTP = cerradas.filter(o => o.take_profit && o.precio_entrada && o.precio_salida)
  let pctTomado = 0, pctPosible = 0
  conTP.forEach(o => {
    const entrada = Number(o.precio_entrada)
    const salida  = Number(o.precio_salida)
    const tp      = Number(o.take_profit)
    const sl      = o.stop_loss ? Number(o.stop_loss) : null
    const rango   = Math.abs(tp - entrada)
    const tomado  = Math.abs(salida - entrada)
    if (rango > 0) {
      pctTomado  += (tomado / rango) * 100
      pctPosible += 100
    }
  })
  const pctTomadoAvg  = conTP.length ? (pctTomado  / conTP.length).toFixed(1) : null
  const pctPosibleAvg = conTP.length ? (pctPosible / conTP.length).toFixed(1) : null

  // --- POR DIA DE LA SEMANA ---
  const porDia = DIAS.map((dia, idx) => {
    const opsDia = cerradas.filter(o => new Date(o.fecha_hora).getDay() === idx)
    const pnl    = opsDia.reduce((s, o) => s + Number(o.resultado_dinero), 0)
    const wr     = opsDia.length ? (opsDia.filter(o => Number(o.resultado_dinero) > 0).length / opsDia.length * 100).toFixed(0) : 0
    return { dia, pnl: Number(pnl.toFixed(2)), ops: opsDia.length, winRate: Number(wr) }
  }).filter(d => d.ops > 0)

  const porDiaOrdenado = [...porDia].sort((a, b) =>
    ordenDias === 'desc' ? b.pnl - a.pnl : a.pnl - b.pnl
  )

  // --- POR PERIODO DE HORA ---
  const porPeriodo = PERIODOS.map(({ label, min, max }) => {
    const opsP = cerradas.filter(o => {
      const h = new Date(o.fecha_hora).getHours()
      return h >= min && h < max
    })
    const pnl = opsP.reduce((s, o) => s + Number(o.resultado_dinero), 0)
    const wr  = opsP.length ? (opsP.filter(o => Number(o.resultado_dinero) > 0).length / opsP.length * 100).toFixed(0) : 0
    return { periodo: label, pnl: Number(pnl.toFixed(2)), ops: opsP.length, winRate: Number(wr) }
  }).filter(p => p.ops > 0)

  const porPeriodoOrdenado = [...porPeriodo].sort((a, b) =>
    ordenPeriodos === 'desc' ? b.pnl - a.pnl : a.pnl - b.pnl
  )

  // --- POR ACTIVO ---
  const activosMap = {}
  cerradas.forEach(o => {
    if (!activosMap[o.activo]) activosMap[o.activo] = { activo: o.activo, pnl: 0, ops: 0, ganadoras: 0 }
    activosMap[o.activo].pnl += Number(o.resultado_dinero)
    activosMap[o.activo].ops += 1
    if (Number(o.resultado_dinero) > 0) activosMap[o.activo].ganadoras += 1
  })
  const porActivo = Object.values(activosMap).map(a => ({
    ...a,
    pnl: Number(a.pnl.toFixed(2)),
    winRate: Number((a.ganadoras / a.ops * 100).toFixed(0))
  }))
  const porActivoOrdenado = [...porActivo].sort((a, b) =>
    ordenActivos === 'desc' ? b.pnl - a.pnl : a.pnl - b.pnl
  )

  // --- EVOLUCION DEL PNL ---
  const opsOrdenadas = [...cerradas].sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
  let acum = 0
  const evolucion = opsOrdenadas.map((o, i) => {
    acum += Number(o.resultado_dinero)
    return { n: i + 1, pnl: Number(acum.toFixed(2)), op: o.activo }
  })

  // --- PIE CHART direccion ---
  const pieData = [
    { name: 'COMPRA', value: cerradas.filter(o => o.direccion === 'COMPRA').length },
    { name: 'VENTA',  value: cerradas.filter(o => o.direccion === 'VENTA').length  },
  ].filter(d => d.value > 0)

  const BtnOrden = ({ orden, setOrden }) => (
    <button
      onClick={() => setOrden(o => o === 'desc' ? 'asc' : 'desc')}
      className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-green-500 transition-colors ml-2">
      {orden === 'desc' ? 'Mayor a menor' : 'Menor a mayor'}
    </button>
  )

  const colorPnl = (v) => v >= 0 ? '#22c55e' : '#ef4444'

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-green-400">Analisis automatico</h1>

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'P&L Total',         value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'text-green-400' : 'text-red-400' },
          { label: 'Win Rate',           value: `${winRate}%`,     color: parseFloat(winRate) >= 50 ? 'text-green-400' : 'text-red-400' },
          { label: 'Promedio ganadora',  value: `+$${avgGanancia.toFixed(2)}`, color: 'text-green-400' },
          { label: 'Promedio perdedora', value: `$${avgPerdida.toFixed(2)}`,   color: 'text-red-400'   },
          { label: 'Factor de ganancia', value: factorGanancia, color: 'text-blue-400' },
          { label: 'Total operaciones',  value: cerradas.length,   color: 'text-white' },
          { label: 'Ganadoras',          value: ganadoras.length,  color: 'text-green-400' },
          { label: 'Perdedoras',         value: perdedoras.length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* PORCIENTO TOMADO VS POSIBLE */}
      {conTP.length > 0 && (
        <div className="bg-gray-900 border border-green-900/40 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4">
            Eficiencia en toma de ganancias
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">% promedio tomado del recorrido al TP</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-yellow-400">{pctTomadoAvg}%</p>
                <p className="text-gray-500 text-sm mb-1">tomado en promedio</p>
              </div>
              <div className="mt-3 h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${Math.min(pctTomadoAvg, 100)}%` }}
                />
              </div>
            </div>
            <div className="border-l border-gray-800 pl-6">
              <p className="text-xs text-gray-500 mb-2">Lo que podrias haber ganado llegando al TP:</p>
              <p className="text-gray-300 text-sm">
                En {conTP.length} operaciones con TP definido, si hubieras dejado correr hasta el Take Profit, habrias capturado el <span className="text-green-400 font-semibold">100%</span> del recorrido planeado.
              </p>
              <p className="text-yellow-400 text-sm mt-2 font-medium">
                Estas capturando solo el {pctTomadoAvg}% de tu objetivo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EVOLUCION DEL PNL */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Evolucion del P&L acumulado</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={evolucion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="n" tick={{ fill: '#6b7280', fontSize: 11 }} label={{ value: 'Operacion N', position: 'insideBottom', offset: -2, fill: '#6b7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(v) => [`$${v}`, 'P&L acumulado']}
            />
            <Line type="monotone" dataKey="pnl" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* POR DIA */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Ganancias por dia de la semana
          </h2>
          <BtnOrden orden={ordenDias} setOrden={setOrdenDias} />
        </div>
        <div className="space-y-3">
          {porDiaOrdenado.map((d, i) => (
            <div key={d.dia} className="flex items-center gap-4">
              <span className="text-gray-400 text-sm w-24">{d.dia}</span>
              <div className="flex-1 h-7 bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg flex items-center px-2 text-xs font-semibold transition-all"
                  style={{
                    width: `${Math.max(8, Math.abs(d.pnl) / Math.max(...porDia.map(x => Math.abs(x.pnl))) * 100)}%`,
                    backgroundColor: d.pnl >= 0 ? '#16a34a' : '#dc2626',
                    color: '#fff'
                  }}>
                  {d.pnl >= 0 ? '+' : ''}${d.pnl}
                </div>
              </div>
              <span className="text-xs text-gray-500 w-20 text-right">{d.ops} ops · {d.winRate}% WR</span>
            </div>
          ))}
        </div>
      </div>

      {/* POR PERIODO */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Ganancias por periodo del dia
          </h2>
          <BtnOrden orden={ordenPeriodos} setOrden={setOrdenPeriodos} />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={porPeriodoOrdenado}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="periodo" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              formatter={(v, n) => [n === 'pnl' ? `$${v}` : `${v}%`, n === 'pnl' ? 'P&L' : 'Win Rate']}
            />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Bar dataKey="pnl" name="P&L ($)" fill="#3b82f6" radius={[4,4,0,0]}>
              {porPeriodoOrdenado.map((entry, i) => (
                <Cell key={i} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* POR ACTIVO */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Rendimiento por activo
          </h2>
          <BtnOrden orden={ordenActivos} setOrden={setOrdenActivos} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                <th className="pb-2 text-left">Activo</th>
                <th className="pb-2 text-right">P&L $</th>
                <th className="pb-2 text-right">Operaciones</th>
                <th className="pb-2 text-right">Win Rate</th>
                <th className="pb-2 text-left pl-4">Barra</th>
              </tr>
            </thead>
            <tbody>
              {porActivoOrdenado.map((a, i) => {
                const maxPnl = Math.max(...porActivo.map(x => Math.abs(x.pnl)))
                const pct = Math.max(5, Math.abs(a.pnl) / maxPnl * 100)
                return (
                  <tr key={a.activo} className="border-b border-gray-800/40">
                    <td className="py-2 font-medium text-white">{a.activo}</td>
                    <td className={`py-2 text-right font-semibold ${a.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {a.pnl >= 0 ? '+' : ''}${a.pnl}
                    </td>
                    <td className="py-2 text-right text-gray-400">{a.ops}</td>
                    <td className="py-2 text-right text-gray-400">{a.winRate}%</td>
                    <td className="py-2 pl-4">
                      <div className="h-4 bg-gray-800 rounded overflow-hidden w-40">
                        <div
                          className="h-full rounded transition-all"
                          style={{ width: `${pct}%`, backgroundColor: a.pnl >= 0 ? '#16a34a' : '#dc2626' }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIE - COMPRA vs VENTA */}
      {pieData.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Compras vs Ventas</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Resumen ejecutivo</h2>
            <div className="space-y-3 text-sm">
              {porDiaOrdenado.length > 0 && (
                <p className="text-gray-300">
                  Mejor dia: <span className="text-green-400 font-semibold">{porDiaOrdenado[0].dia}</span> con ${porDiaOrdenado[0].pnl >= 0 ? '+' : ''}{porDiaOrdenado[0].pnl}
                </p>
              )}
              {porPeriodoOrdenado.length > 0 && (
                <p className="text-gray-300">
                  Mejor periodo: <span className="text-green-400 font-semibold">{porPeriodoOrdenado[0].periodo}</span> con ${porPeriodoOrdenado[0].pnl >= 0 ? '+' : ''}{porPeriodoOrdenado[0].pnl}
                </p>
              )}
              {porActivoOrdenado.length > 0 && (
                <p className="text-gray-300">
                  Mejor activo: <span className="text-green-400 font-semibold">{porActivoOrdenado[0].activo}</span> con ${porActivoOrdenado[0].pnl >= 0 ? '+' : ''}{porActivoOrdenado[0].pnl}
                </p>
              )}
              {pctTomadoAvg && (
                <p className="text-gray-300">
                  Eficiencia TP: <span className="text-yellow-400 font-semibold">{pctTomadoAvg}%</span> del recorrido capturado
                </p>
              )}
              <p className="text-gray-300">
                Factor de ganancia: <span className="text-blue-400 font-semibold">{factorGanancia}</span>
                {factorGanancia !== 'N/A' && Number(factorGanancia) >= 1.5
                  ? <span className="text-green-400"> (solido)</span>
                  : factorGanancia !== 'N/A'
                    ? <span className="text-yellow-400"> (mejorable)</span>
                    : null
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
