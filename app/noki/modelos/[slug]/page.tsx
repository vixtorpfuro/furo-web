import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ModeloDetail } from '../ModeloTemplate'
import { MODELOS, formatoM2, modeloPorSlug } from '../datos'

export const dynamicParams = false

export function generateStaticParams() {
  return MODELOS.map(m => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const m = modeloPorSlug(slug)
  if (!m) return {}
  const precio = m.ufM2 != null ? ` Desde ${formatoM2(m.ufM2)} UF/m² + IVA.` : ''
  return {
    title: `${m.nombre} — ${m.resumen} | Noki`,
    description: `${m.descripcion}${precio}`,
    openGraph: { title: `${m.nombre} | Noki`, description: m.resumen, images: [m.hero] },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!modeloPorSlug(slug)) notFound()
  return <ModeloDetail slug={slug} />
}
