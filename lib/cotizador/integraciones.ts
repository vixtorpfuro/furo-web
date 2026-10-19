import 'server-only'
import { mondayFetch } from '@/lib/interno/monday'

// Integraciones del cotizador obra gruesa V3. Antes el navegador guardaba los tokens en
// localStorage y llamaba directo a Monday y al Apps Script; ahora todo pasa por aquí.

// Las APIs usan la cookie de sesión (sameSite=lax). Exigir JSON y mismo origen evita que otro
// sitio dispare envíos con un formulario.
export function solicitudMismoOrigen(req: Request): boolean {
  if (!req.headers.get('content-type')?.includes('application/json')) return false
  const origen = req.headers.get('origin')
  return !origen || origen === new URL(req.url).origin
}

const SHEET_URL = process.env.COTIZADOR_SHEET_URL
const SHEET_TOKEN = process.env.COTIZADOR_SHEET_TOKEN

function configSheet() {
  if (!SHEET_URL || !SHEET_TOKEN) {
    throw new Error('Falta configurar COTIZADOR_SHEET_URL y COTIZADOR_SHEET_TOKEN en el servidor.')
  }
  if (!SHEET_URL.startsWith('https://script.google.com/')) {
    throw new Error('COTIZADOR_SHEET_URL debe ser una URL de Apps Script (https://script.google.com/...).')
  }
  return { url: SHEET_URL, token: SHEET_TOKEN }
}

// El Apps Script existente responde el correlativo como JSONP (`callback({...})`). Se mantiene ese
// contrato para no tocar el script, pero aquí se interpreta como texto y nunca se ejecuta.
export async function pedirCorrelativo(): Promise<string> {
  const { url, token } = configSheet()
  const params = new URLSearchParams({ action: 'correlativo', token, callback: 'cb' })
  const res = await fetch(`${url}?${params}`, { cache: 'no-store', redirect: 'follow' })
  if (!res.ok) throw new Error(`El Sheet respondió ${res.status} al pedir correlativo.`)

  const texto = (await res.text()).trim()
  const jsonp = texto.match(/^cb\(([\s\S]*)\)\s*;?$/)
  let data: { ok?: boolean; correlativo?: string | number; error?: string }
  try {
    data = JSON.parse(jsonp ? jsonp[1] : texto)
  } catch {
    throw new Error('Respuesta del Sheet no reconocida al pedir correlativo.')
  }
  if (!data.ok || data.correlativo === undefined || data.correlativo === '') {
    throw new Error(data.error || 'El Sheet no entregó correlativo.')
  }
  return String(data.correlativo)
}

const CAMPOS_SHEET = [
  'fecha', 'numCotizacion', 'proyecto', 'cliente', 'etapa', 'capa', 'tipoProyecto', 'proveedor',
  'margen', 'numVolumenes', 'supM2', 'mlTotal', 'm3Madera', 'ufTotal', 'ufPorM2', 'mlPorM2',
  'm3PorM2', 'notas',
] as const

export type FilaSheet = Partial<Record<(typeof CAMPOS_SHEET)[number], string | number>>

export function limpiarFilaSheet(entrada: unknown): FilaSheet {
  const fila: FilaSheet = {}
  if (!entrada || typeof entrada !== 'object') return fila
  const obj = entrada as Record<string, unknown>
  for (const campo of CAMPOS_SHEET) {
    const v = obj[campo]
    if (typeof v === 'number' && Number.isFinite(v)) fila[campo] = v
    else if (typeof v === 'string') fila[campo] = v.slice(0, 1000)
  }
  return fila
}

// Mismo formato que usaba el formulario oculto: POST x-www-form-urlencoded con `payload` (JSON).
// Devuelve `confirmado: true` solo si el Apps Script responde explícitamente { ok: true }.
export async function registrarEnSheet(fila: FilaSheet, cotizador: string): Promise<{ confirmado: boolean }> {
  const { url, token } = configSheet()
  const payload = JSON.stringify({ ...fila, token, cotizador })
  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    redirect: 'follow',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ payload }),
  })
  if (!res.ok) throw new Error(`El Sheet respondió ${res.status}.`)

  const texto = (await res.text()).trim()
  try {
    const data = JSON.parse(texto) as { ok?: boolean; error?: string }
    if (data.ok === false) throw new Error(data.error || 'El Sheet rechazó la fila.')
    return { confirmado: data.ok === true }
  } catch (e) {
    if (e instanceof SyntaxError) return { confirmado: false }
    throw e
  }
}

export type DatosMonday = {
  proyecto: string
  cliente: string
  etapa: string
  ufNeto: number
  m2: number
}

export function limpiarDatosMonday(entrada: unknown): DatosMonday | null {
  if (!entrada || typeof entrada !== 'object') return null
  const o = entrada as Record<string, unknown>
  const texto = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 255) : '')
  const numero = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
  const datos = {
    proyecto: texto(o.proyecto),
    cliente: texto(o.cliente),
    etapa: texto(o.etapa),
    ufNeto: numero(o.ufNeto),
    m2: numero(o.m2),
  }
  return datos.proyecto ? datos : null
}

// Board y columnas se configuran en el servidor (antes cada usuario los escribía en su navegador).
export async function crearItemMonday(datos: DatosMonday): Promise<string> {
  const boardId = process.env.MONDAY_COTIZADOR_BOARD_ID
  if (!boardId || !/^\d+$/.test(boardId)) {
    throw new Error('Falta configurar MONDAY_COTIZADOR_BOARD_ID en el servidor.')
  }

  const columnas: Record<string, unknown> = {}
  const col = (nombre: string) => process.env[`MONDAY_COTIZADOR_COL_${nombre}`]
  if (col('UF')) columnas[col('UF')!] = datos.ufNeto
  if (col('M2')) columnas[col('M2')!] = datos.m2
  if (col('ETAPA') && datos.etapa) columnas[col('ETAPA')!] = { label: datos.etapa }
  if (col('CLIENTE')) columnas[col('CLIENTE')!] = datos.cliente

  const nombre = datos.cliente ? `${datos.proyecto} — ${datos.cliente}` : datos.proyecto
  const data = await mondayFetch(
    `mutation ($boardId: ID!, $nombre: String!, $columnas: JSON!) {
      create_item(board_id: $boardId, item_name: $nombre, column_values: $columnas) { id }
    }`,
    { boardId, nombre, columnas: JSON.stringify(columnas) }
  )
  const id = data?.create_item?.id
  if (!id) throw new Error('Monday no devolvió el ID del item creado.')
  return String(id)
}
