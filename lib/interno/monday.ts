import 'server-only'

const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
const BOARD_ID = '9586473749'
export const COLUMNA_CARPETA_DRIVE = 'link_mm76h1jj'

async function mondayFetch(query: string, variables: Record<string, unknown>) {
  if (!MONDAY_API_TOKEN) throw new Error('Falta configurar MONDAY_API_TOKEN en el servidor.')
  const res = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: MONDAY_API_TOKEN,
      'Content-Type': 'application/json',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query, variables }),
  })
  const data = await res.json()
  if (data.errors) throw new Error(data.errors[0]?.message || 'Error consultando Monday.')
  return data.data
}

export type LeadResumen = {
  id: string
  nombre: string
  estado: string
  createdAt: string
  carpetaDrive: string | null
}

type ItemConColumnas = {
  id: string
  name: string
  created_at: string
  column_values: { id: string; text: string; value: string | null }[]
}

function extraeUrlDeLinkColumna(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as { url?: string }
    return parsed.url || null
  } catch {
    return null
  }
}

function esResponsable(item: ItemConColumnas, mondayPersonId: string): boolean {
  const raw = item.column_values.find(c => c.id === 'multiple_person_mm6d63rj')?.value
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { personsAndTeams?: { id: number }[] }
    return (parsed.personsAndTeams || []).some(p => String(p.id) === String(mondayPersonId))
  } catch {
    return false
  }
}

export async function getMisLeads(mondayPersonId: string): Promise<LeadResumen[]> {
  const query = `
    query ($boardId: ID!) {
      boards(ids: [$boardId]) {
        items_page(limit: 200) {
          items {
            id
            name
            created_at
            column_values(ids: ["lead_status", "multiple_person_mm6d63rj", "${COLUMNA_CARPETA_DRIVE}"]) { id text value }
          }
        }
      }
    }
  `
  const data = await mondayFetch(query, { boardId: BOARD_ID })
  const items: ItemConColumnas[] = data.boards?.[0]?.items_page?.items || []
  return items
    .filter(item => esResponsable(item, mondayPersonId))
    .map(item => {
      const estado = item.column_values.find(c => c.id === 'lead_status')?.text || ''
      const carpetaDrive = extraeUrlDeLinkColumna(item.column_values.find(c => c.id === COLUMNA_CARPETA_DRIVE)?.value)
      return {
        id: item.id,
        nombre: item.name,
        estado,
        createdAt: item.created_at,
        carpetaDrive,
      }
    })
}

export type LeadDetalle = LeadResumen & {
  columnValues: Record<string, string>
}

export async function getLead(itemId: string): Promise<LeadDetalle | null> {
  const query = `
    query ($itemId: ID!) {
      items(ids: [$itemId]) {
        id
        name
        created_at
        column_values { id text value }
      }
    }
  `
  const data = await mondayFetch(query, { itemId })
  const item = data.items?.[0]
  if (!item) return null

  const columnValues: Record<string, string> = {}
  const columnasCrudas = item.column_values as { id: string; text: string; value: string | null }[]
  for (const cv of columnasCrudas) {
    columnValues[cv.id] = cv.text
  }

  return {
    id: item.id,
    nombre: item.name,
    estado: columnValues['lead_status'] || '',
    createdAt: item.created_at,
    carpetaDrive: extraeUrlDeLinkColumna(columnasCrudas.find(c => c.id === COLUMNA_CARPETA_DRIVE)?.value),
    columnValues,
  }
}
