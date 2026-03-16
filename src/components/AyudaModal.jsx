export default function AyudaModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
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
            Todos tus datos son privados, se guardan en la nube y estan disponibles desde cualquier dispositivo.
          </p>

          {/* Cuenta y seguridad */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-400 font-bold text-sm uppercase tracking-wider">Cuenta y privacidad</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-purple-400 mt-0.5">+</span>Registro con email y contrasena — tus datos son solo tuyos</li>
              <li className="flex gap-2"><span className="text-purple-400 mt-0.5">+</span>Inicio de sesion desde cualquier dispositivo (PC, tablet, celular)</li>
              <li className="flex gap-2"><span className="text-purple-400 mt-0.5">+</span>Nadie mas puede ver tus operaciones — cada registro esta vinculado a tu cuenta</li>
              <li className="flex gap-2"><span className="text-purple-400 mt-0.5">+</span>Cerrar sesion desde el menu de navegacion en cualquier momento</li>
            </ul>
          </section>

          {/* Bitacora */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Bitacora</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Ver todas tus operaciones en tabla (PC) o tarjetas (movil)</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Ordenar por fecha, activo, resultado en $ o %, y tamano de posicion</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Filtrar por activo, direccion (compra/venta) y estado (abierta/cerrada)</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Expandir cualquier fila para ver motivo tecnico, emociones, errores y capturas</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Editar cualquier operacion existente</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Eliminar operaciones</li>
              <li className="flex gap-2"><span className="text-green-400 mt-0.5">+</span>Resumen rapido: total operaciones, P&L, Win Rate y ganadoras</li>
            </ul>
          </section>

          {/* Nueva Operacion */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Registro de operaciones</span>
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

          {/* Analisis */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Analisis automatico</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>P&L total, Win Rate, promedio de ganancias y perdidas, factor de ganancia</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Curva de equity — evolucion del P&L acumulado en el tiempo</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Que dia de la semana obtienes mas ganancias — ordenable mayor a menor</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Que periodo del dia es mas rentable (madrugada/manana/tarde/noche) — ordenable</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Rendimiento por activo con P&L, cantidad de operaciones y Win Rate — ordenable</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Eficiencia en toma de ganancias: que % del recorrido al TP estas capturando vs lo que podrias haber ganado</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Distribucion compras vs ventas en grafico circular</li>
              <li className="flex gap-2"><span className="text-yellow-400 mt-0.5">+</span>Resumen ejecutivo automatico: mejor dia, mejor periodo y mejor activo</li>
            </ul>
          </section>

          {/* Dispositivos */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">Acceso multidispositivo</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">+</span>Diseno adaptado a PC, tablet y celular</li>
              <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">+</span>En movil: menu hamburguesa, tarjetas expandibles y chips de ordenamiento deslizables</li>
              <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">+</span>Los datos se sincronizan en tiempo real entre dispositivos</li>
              <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">+</span>Funciona desde cualquier navegador sin instalar nada</li>
            </ul>
          </section>

          {/* Tip */}
          <section className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Consejo</p>
            <p className="text-sm text-gray-300">
              El analisis se vuelve mas preciso a medida que registras mas operaciones.
              Con 20+ trades vas a empezar a ver patrones claros en tus habitos de trading.
            </p>
          </section>

          {/* Contacto */}
          <section className="border-t border-gray-800 pt-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Programador: Cubano en Uruguay</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-gray-300 text-sm font-medium">Josielis Machado</p>
                <p className="text-gray-500 text-xs mt-0.5">Consultas, sugerencias o mejoras</p>
              </div>
              <a href="mailto:josielisuruguay@gmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-colors">
                @ josielisuruguay@gmail.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
