// Aplica las migraciones SQL de db/migraciones que aún no se han aplicado.
//
//   node --env-file=.env.local scripts/migrar.mjs
import { readdir, readFile } from 'node:fs/promises'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL.')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} })
const dir = new URL('../db/migraciones/', import.meta.url)

try {
  await sql`create table if not exists schema_migraciones (nombre text primary key, aplicada timestamptz not null default now())`
  const aplicadas = new Set((await sql`select nombre from schema_migraciones`).map(r => r.nombre))
  const archivos = (await readdir(dir)).filter(f => f.endsWith('.sql')).sort()
  for (const nombre of archivos) {
    if (aplicadas.has(nombre)) continue
    const texto = await readFile(new URL(nombre, dir), 'utf8')
    await sql.begin(async tx => {
      await tx.unsafe(texto)
      await tx`insert into schema_migraciones (nombre) values (${nombre})`
    })
    console.log(`Aplicada: ${nombre}`)
  }
  console.log('Base al día.')
} finally {
  await sql.end()
}
