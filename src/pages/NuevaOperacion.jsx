import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ACTIVOS_COMUNES = [
  'EURUSD','GBPUSD','USDJPY','USDCHF','AUDUSD','USDCAD',
  'XAUUSD','XAGUSD','US30','NAS100','SP500',
  'BTCUSD','ETHUSD','BNBUSD'
]

const EMOCIONES = [
  'Tranquilo/a','Ansioso/a','Confiado/a','Dudoso/a',
  'Euforico/a','Miedoso/a','Impaciente','Disciplinado/a'
]

export default function NuevaOperacion() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [imagenAntes, setImagenAntes]     = useState(null)
  const [imagenDespues, setImagenDespues] = useState(null)

  const [form, setForm] = useState({
    fecha_hora:        new Date().toISOString().slice(0, 16),
    activo:            '',
    activoCustom:      '',
    direccion:         'COMPRA',
    precio_entrada:    '',
    precio_salida:     '',
    stop_loss:         '',
    take_profit:       '',
    tamano_posicion:   '',
    resultado_dinero:  '',
    resultado_porcent: '',
    motivo_tecnico:    '',
    emociones:         '',
    errores:           '',
    estado:            'CERRADA',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const subirImagen = async (file, nombre) => {
    if (!file) return null
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}_${nombre}.${ext}`
    const { error } = await supabase.storage.from('capturas').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('capturas').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const urlAntes   = await subirImagen(imagenAntes,   'antes')
      const urlDespues = await subirImagen(imagenDespues, 'despues')
      const activoFinal = form.activo === 'OTRO' ? form.activoCustom : form.activo

      const { error } = await supabase.from('operaciones').insert([{
        user_id:           user.id,
        fecha_hora:        form.fecha_hora,
        activo:            activoFinal,
        direccion:         form.direccion,
        precio_entrada:    parseFloat(form.precio_entrada),
        precio_salida:     form.precio_salida     ? parseFloat(form.precio_salida)     : null,
        stop_loss:         form.stop_loss         ? parseFloat(form.stop_loss)         : null,
        take_profit:       form.take_profit       ? parseFloat(form.take_profit)       : null,
        tamano_posicion:   parseFloat(form.tamano_posicion),
        resultado_dinero:  form.resultado_dinero  ? parseFloat(form.resultado_dinero)  : null,
        resultado_porcent: form.resultado_porcent ? parseFloat(form.resultado_porcent) : null,
        motivo_tecnico:    form.motivo_tecnico    || null,
        emociones:         form.emociones         || null,
        errores:           form.errores           || null,
        imagen_antes:      urlAntes,
        imagen_despues:    urlDespues,
        estado:            form.estado,
      }])
      if (error) throw error
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-green-400 mb-6">Nueva Operacion</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BLOQUE 1 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Datos de la operacion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Fecha y hora *</label>
              <input type="datetime-local" required value={form.fecha_hora}
                onChange={e => set('fecha_hora', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
                <option value="CERRADA">Cerrada</option>
                <option value="ABIERTA">Abierta</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Activo *</label>
              <select required value={form.activo} onChange={e => set('activo', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
                <option value="">Selecciona...</option>
                {ACTIVOS_COMUNES.map(a => <option key={a} value={a}>{a}</option>)}
                <option value="OTRO">Otro...</option>
              </select>
              {form.activo === 'OTRO' && (
                <input type="text" placeholder="Ej: TSLA, AMZN..."
                  value={form.activoCustom} onChange={e => set('activoCustom', e.target.value)}
                  className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500" />
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Direccion *</label>
              <div className="flex gap-3 mt-1">
                {['COMPRA','VENTA'].map(d => (
                  <button type="button" key={d} onClick={() => set('direccion', d)}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors
                      ${form.direccion === d
                        ? d === 'COMPRA' ? 'bg-green-500 text-gray-950' : 'bg-red-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {d === 'COMPRA' ? 'COMPRA' : 'VENTA'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 2 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Precios y gestion de riesgo</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { field: 'precio_entrada', label: 'Precio entrada *', required: true  },
              { field: 'precio_salida',  label: 'Precio salida',    required: false },
              { field: 'stop_loss',      label: 'Stop Loss',        required: false },
              { field: 'take_profit',    label: 'Take Profit',      required: false },
            ].map(({ field, label, required }) => (
              <div key={field}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <input type="number" step="any" required={required} value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500" />
              </div>
            ))}
          </div>
        </section>

        {/* BLOQUE 3 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tamano y resultado</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tamano posicion *</label>
              <input type="number" step="any" required value={form.tamano_posicion}
                onChange={e => set('tamano_posicion', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Resultado $</label>
              <input type="number" step="any" value={form.resultado_dinero}
                onChange={e => set('resultado_dinero', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Resultado %</label>
              <input type="number" step="any" value={form.resultado_porcent}
                onChange={e => set('resultado_porcent', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500" />
            </div>
          </div>
        </section>

        {/* BLOQUE 4 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Analisis personal</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Motivo tecnico de entrada</label>
            <textarea rows={3} value={form.motivo_tecnico} onChange={e => set('motivo_tecnico', e.target.value)}
              placeholder="Ej: Ruptura de resistencia con volumen, patron bandera en H1..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Estado emocional</label>
            <select value={form.emociones} onChange={e => set('emociones', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
              <option value="">Selecciona...</option>
              {EMOCIONES.map(em => <option key={em} value={em}>{em}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Errores cometidos</label>
            <textarea rows={2} value={form.errores} onChange={e => set('errores', e.target.value)}
              placeholder="Ej: Entre antes de la confirmacion, movi el stop..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 resize-none" />
          </div>
        </section>

        {/* BLOQUE 5 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Capturas del grafico</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Antes de la operacion',  setter: setImagenAntes,   val: imagenAntes   },
              { label: 'Despues de la operacion', setter: setImagenDespues, val: imagenDespues },
            ].map(({ label, setter, val }) => (
              <div key={label}>
                <label className="block text-sm text-gray-400 mb-2">{label}</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                  {val
                    ? <span className="text-green-400 text-sm text-center px-2">{val.name}</span>
                    : <span className="text-gray-500 text-sm">Subir imagen</span>
                  }
                  <input type="file" accept="image/*" className="hidden" onChange={e => setter(e.target.files[0])} />
                </label>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            Error: {error}
          </div>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors font-medium">
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 rounded-xl bg-green-500 text-gray-950 font-bold hover:bg-green-400 transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Operacion'}
          </button>
        </div>
      </form>
    </div>
  )
}
