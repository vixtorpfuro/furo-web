import 'server-only'
import postgres from 'postgres'

// Un cliente por proceso. En desarrollo el hot reload re-evalúa el módulo, por eso se guarda en globalThis.
const g = globalThis as unknown as { __furoSql?: postgres.Sql }

export function db(): postgres.Sql {
  if (!g.__furoSql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('Falta configurar DATABASE_URL en el servidor.')
    g.__furoSql = postgres(url, { max: 5, idle_timeout: 20, onnotice: () => {} })
  }
  return g.__furoSql
}
