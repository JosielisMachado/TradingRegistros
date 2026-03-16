export default function AyudaModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <h2 className="text-white font-bold text-lg">Trading Registros</h2>
              <p className="text-gray-500 text-xs">Guia de uso completa</p>
            </div>
          </div>
          <button onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800">
            x
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Intro */}
          <p className="text-gray-300 text-sm leading-relaxed">
            Bitacora profesional para registrar, analizar y mejorar tu operativa de trading.
            Todos tus datos se guardan en la nube y estan disponibles desde cualquier dispositivo.
          </p>

          {/* Seccion Bitacora */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Bitacora</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Ver todas tus operaciones en una tabla ordenada</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Ordenar por fecha, activo, resultado en $ o %, y tamano de posicion — clic en el encabezado de columna</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Filtrar por activo, direccion (compra/venta) y estado (abierta/cerrada)</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Clic en cualquier fila para expandir y ver motivo tecnico, emociones, errores y capturas de pantalla</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Editar cualquier operacion existente con el boton de lapiz</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Eliminar operaciones con el boton X</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Resumen rapido: P&L total, Win Rate y conteo de ganadoras</li>
            </ul>
          </section>

          {/* Seccion Nueva Operacion */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Nueva Operacion</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Registrar fecha/hora, activo, direccion (compra o venta)</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Ingresar precios de entrada, salida, Stop Loss y Take Profit</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Registrar tamano de posicion y resultado en $ y %</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Escribir el motivo tecnico de la entrada</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Registrar estado emocional al operar</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Anotar errores cometidos para aprender de ellos</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Subir capturas del grafico antes y despues de la operacion</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">+</span>Marcar la operacion como abierta o cerrada</li>
            </ul>
          </section>

          {/* Seccion Analisis */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Analisis automatico</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>P&L total, Win Rate, promedio de ganancias y perdidas, factor de ganancia</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Evolucion del P&L acumulado en el tiempo (curva de equity)</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Que dia de la semana obtienes mas ganancias — ordenable</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Que periodo del dia es mas rentable (madrugada/manana/tarde/noche) — ordenable</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Rendimiento por activo con P&L, cantidad de ops y Win Rate — ordenable</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Eficiencia en toma de ganancias: que % del recorrido al TP estas capturando vs lo que podrias haber ganado</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Distribucion compras vs ventas</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Resumen ejecutivo automatico con tus mejores dias, periodos y activos</li>
            </ul>
          </section>

          {/* Tips */}
          <section className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Consejo</p>
            <p className="text-sm text-gray-300">
              El analisis se vuelve mas preciso y revelador a medida que registras mas operaciones.
              Con 20+ trades vas a empezar a ver patrones claros en tus habitos de trading.
            </p>
          </section>

          {/* Contacto */}
          <section className="border-t border-gray-800 pt-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Desarrollador</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Josielis Machado</p>
                <p className="text-gray-500 text-xs mt-0.5">Consultas, sugerencias o mejoras</p>
              </div>
              <a
                href="mailto:josielisuruguay@gmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-colors">
                <span>@</span>
                josielisuruguay@gmail.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
