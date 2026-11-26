// Prueba en seco del agente de Pedidos: analiza conversaciones guardadas en un JSON y muestra
// qué detecta y qué correo escribiría. No lee ni escribe en Gmail: no crea borradores ni envía nada.
//
// Uso (necesita ANTHROPIC_API_KEY en el entorno):
//   npx tsx --conditions=react-server scripts/probar-agente-pedidos.ts ruta/casos.json
//
// casos.json: [{ "caso": "nombre", "lead": Lead, "hilo": MensajeHilo[] }]  (tipos en lib/pedidos/gmail.ts)
// Los casos tienen datos reales de clientes: guárdalos fuera del repo.
import { readFileSync } from 'node:fs'
import { analizarPedido, conFirma } from '../lib/pedidos/agente'
import { CAMPOS } from '../lib/pedidos/campos'
import type { Lead, MensajeHilo } from '../lib/pedidos/gmail'

type Caso = { caso: string; lead: Lead; hilo: MensajeHilo[] }

const ruta = process.argv[2]
if (!ruta) {
  console.error('Indica el archivo de casos: scripts/probar-agente-pedidos.ts casos.json')
  process.exit(1)
}
const casos = JSON.parse(readFileSync(ruta, 'utf-8')) as Caso[]
const nombreCampo = Object.fromEntries(CAMPOS.map((c) => [c.clave, c.t]))
const icono = { ok: '✓', confirmar: '◐', falta: '○' } as const

async function main() {
for (const c of casos) {
  console.log(`\n=== ${c.caso} (${c.hilo.length} correos) ===`)
  try {
    const a = await analizarPedido(c.lead, c.hilo)
    console.log(a.resumen)
    for (const f of a.campos) console.log(`  ${icono[f.estado]} ${nombreCampo[f.clave] ?? f.clave}${f.valor ? ': ' + f.valor : ''}`)
    console.log(`Listo para cotizar: ${a.listo_para_cotizar ? 'sí' : 'no'} · Probabilidad: ${Math.round(a.probabilidad)} %`)
    if (a.debe_escribir) console.log(`\n--- Correo propuesto: ${a.correo_asunto}\n${conFirma(a.correo_cuerpo)}`)
    else console.log('\n--- El agente sugiere no escribir todavía.')
  } catch (e) {
    console.error('Error:', e instanceof Error ? e.message : e)
  }
}
}

main()
