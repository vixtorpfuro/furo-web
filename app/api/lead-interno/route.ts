import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { crearCarpetaProyecto, subirArchivoACarpeta } from '@/lib/interno/drive'
import { prependCarpetaDrive } from '@/lib/interno/monday'

const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
const BOARD_ID = '9586473749' // Leads — workspace "CRM nuevo"
const GROUP_ID = 'topics' // "Leads nuevos"

async function geocode(address: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=cl&q=${encodeURIComponent(address)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'furo-web-lead-form/1.0 (contacto@furo.company)' } })
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || !data[0]) return null
    return { lat: data[0].lat, lng: data[0].lon }
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) {
    return NextResponse.json({ error: 'No autenticado. Inicia sesión de nuevo.' }, { status: 401 })
  }
  if (!MONDAY_API_TOKEN) {
    return NextResponse.json({ error: 'Falta configurar MONDAY_API_TOKEN en el servidor.' }, { status: 500 })
  }

  const form = await req.formData()
  const get = (k: string) => (form.get(k) as string | null) || ''
  const nombre = get('nombre')
  const email = get('email')
  const telefono = get('telefono')
  const empresa = get('empresa')
  const direccion = get('direccion')
  const nombreProyecto = get('nombreProyecto')
  const soy = get('soy')
  const cuando = get('cuando')
  const comoContactar = get('comoContactar')
  const comoConocio = get('comoConocio')
  const tipoProyecto = get('tipoProyecto')
  const servicioFuro = get('servicioFuro')
  const segmento = get('segmento')
  const m2 = get('m2')
  const comentarios = get('comentarios')
  const modalidad = get('modalidad')
  const fechaReunion = get('fechaReunion')
  const notasReunion = get('notasReunion')
  const proximosPasos = get('proximosPasos')
  const linkReunion = get('linkReunion')
  const archivos = form.getAll('archivos').filter((a): a is File => a instanceof File && a.size > 0)

  if (!nombre || (!email && !telefono)) {
    return NextResponse.json({ error: 'Nombre y al menos un dato de contacto (email o teléfono) son obligatorios.' }, { status: 400 })
  }
  if (!nombreProyecto) {
    return NextResponse.json({ error: 'El nombre del proyecto es obligatorio (se usa para la carpeta de Drive).' }, { status: 400 })
  }

  // Carpeta en Drive: FURO COMPANY/COMERCIAL Y VENTAS/COTIZACIONES/2026/{n}. {proyecto} - {cliente}
  let carpeta: { id: string; name: string; webViewLink: string }
  try {
    carpeta = await crearCarpetaProyecto(nombreProyecto, nombre)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error creando la carpeta en Drive.' }, { status: 500 })
  }

  for (const archivo of archivos) {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    await subirArchivoACarpeta(carpeta.id, archivo.name, archivo.type || 'application/octet-stream', buffer)
  }

  const columnValues: Record<string, unknown> = {
    lead_status: { label: 'Lead nuevo' },
    date_mkswkng3: { date: new Date().toISOString().slice(0, 10), time: new Date().toISOString().slice(11, 19) },
    multiple_person_mm6d63rj: { personsAndTeams: [{ id: Number(sesion.mondayPersonId), kind: 'person' }] },
  }

  if (email) columnValues.lead_email = { email, text: email }
  if (telefono) columnValues.lead_phone = { phone: telefono.replace(/[^\d+]/g, ''), countryShortName: 'CL' }
  if (empresa) columnValues.text_mm6dfaa0 = empresa
  if (soy) columnValues.text_mktk4r1f = soy
  if (cuando) columnValues.text_mktkqpnz = cuando
  if (comoContactar) columnValues.color_mkv0rxyx = { label: comoContactar }
  if (comoConocio) columnValues.dropdown_mkswtre = { labels: [comoConocio] }
  if (tipoProyecto) columnValues.dropdown_mm6dj0qt = { labels: [tipoProyecto] }
  if (servicioFuro) columnValues.dropdown_mm6dkdz7 = { labels: [servicioFuro] }
  if (segmento) columnValues.color_mm6dxxhe = { label: segmento }
  if (m2) columnValues.numeric_mm6defes = String(m2)

  let comentariosFinal = comentarios || ''
  if (direccion) {
    const geo = await geocode(direccion)
    if (geo) {
      columnValues.location_mm6dmm5p = { lat: geo.lat, lng: geo.lng, address: direccion }
    } else {
      comentariosFinal = `Ubicación: ${direccion}${comentariosFinal ? '\n\n' + comentariosFinal : ''}`
    }
  }

  const reunion: string[] = []
  if (modalidad || fechaReunion) reunion.push(`Reunión: ${modalidad || '—'} ${fechaReunion ? `(${fechaReunion})` : ''}`.trim())
  if (linkReunion) reunion.push(`Link reunión: ${linkReunion}`)
  if (proximosPasos) reunion.push(`Próximos pasos: ${proximosPasos}`)
  if (notasReunion) reunion.push(`Notas de la reunión:\n${notasReunion}`)
  if (reunion.length) comentariosFinal = `${reunion.join('\n')}${comentariosFinal ? '\n\n' + comentariosFinal : ''}`

  comentariosFinal = prependCarpetaDrive(comentariosFinal, carpeta.webViewLink)
  columnValues.long_text_mm6d9214 = comentariosFinal

  const mutation = `
    mutation ($boardId: ID!, $groupId: String, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `

  const res = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: {
      Authorization: MONDAY_API_TOKEN,
      'Content-Type': 'application/json',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        boardId: BOARD_ID,
        groupId: GROUP_ID,
        itemName: nombre,
        columnValues: JSON.stringify(columnValues),
      },
    }),
  })

  const data = await res.json()
  if (data.errors) {
    return NextResponse.json({ error: data.errors[0]?.message || 'Error al crear el lead en Monday.' }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    itemId: data.data?.create_item?.id,
    carpeta: { url: carpeta.webViewLink, nombre: carpeta.name },
  })
}
