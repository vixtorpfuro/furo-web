import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { notFound } from 'next/navigation'
import Nav from '../../../components/Nav'
import Footer from '../../../components/Footer'
import Link from 'next/link'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)
const urlFor = (source: any) => {
  try { return builder.image(source).url() } catch { return null }
}

export const revalidate = 60

export default async function ObraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [obra, todasLasObras] = await Promise.all([
    client.fetch(`
      *[_type == "obra" && slug.current == $slug][0] {
        _id, titulo, slug, categoria, cliente, arquitecto,
        ubicacion, superficie, anio, resumen, descripcion,
        imagen_principal,
        galeria[] {
          ...,
          asset-> { _id, url, metadata { dimensions { width, height } } }
        }
      }
    `, { slug }),
    client.fetch(`*[_type == "obra"] | order(_createdAt asc) { titulo, slug }`)
  ])

  if (!obra) notFound()

  const idx = todasLasObras.findIndex((o: any) => o.slug?.current === slug)
  const anterior = idx > 0 ? todasLasObras[idx - 1] : null
  const siguiente = idx < todasLasObras.length - 1 ? todasLasObras[idx + 1] : null

  const imagenUrl = obra.imagen_principal ? urlFor(obra.imagen_principal) : null

  // Construir bloques de contenido: párrafos intercalados con imágenes
  const descripcionParrafos = obra.descripcion
    ? obra.descripcion.split('\n').filter((p: string) => p.trim())
    : []

  const galeria = (obra.galeria || []).map((img: any) => ({
    url: urlFor(img),
    width: img.asset?.metadata?.dimensions?.width || 1200,
    height: img.asset?.metadata?.dimensions?.height || 800,
    isVertical: (img.asset?.metadata?.dimensions?.height || 800) > (img.asset?.metadata?.dimensions?.width || 1200),
  })).filter((img: any) => img.url)

  // Intercalar: imagen, párrafo, imagen, párrafo...
  const bloques: { type: 'image' | 'text', content: any }[] = []
  const maxLen = Math.max(galeria.length, descripcionParrafos.length)
  for (let i = 0; i < maxLen; i++) {
    if (galeria[i]) bloques.push({ type: 'image', content: galeria[i] })
    if (descripcionParrafos[i]) bloques.push({ type: 'text', content: descripcionParrafos[i] })
  }

  return (
    <main style={{ backgroundColor: '#f5f3ee', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box;}a{text-decoration:none;}`}</style>
      <Nav  />

      {/* HERO */}
      <section style={{ position: 'relative', height: '90vh', minHeight: 520, overflow: 'hidden', background: '#1a1816' }}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={obra.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a1816,#2a2420)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.75) 0%, rgba(12,10,8,0.1) 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 56px 64px' }}>
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 14 }}>{obra.categoria}</span>
          <h1 style={{ fontSize: 'clamp(40px,6vw,76px)', fontWeight: 300, lineHeight: 1.05, color: '#fff', margin: 0 }}>{obra.titulo}</h1>
        </div>
      </section>

      {/* METADATA BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#fff', borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
        {[
          { label: 'Cliente', val: obra.cliente },
          { label: 'Arquitecto', val: obra.arquitecto },
          { label: 'Superficie', val: obra.superficie },
          { label: 'Ubicacion', val: obra.ubicacion },
        ].filter(m => m.val).map((m, i, arr) => (
          <div key={m.label} style={{ padding: '28px 32px', borderRight: i < arr.length - 1 ? '1px solid rgba(20,18,16,0.08)' : 'none' }}>
            <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8278', display: 'block', marginBottom: 6 }}>{m.label}</span>
            <span style={{ fontSize: 15, fontWeight: 400, color: '#141210' }}>{m.val}</span>
          </div>
        ))}
      </div>

      {/* CUERPO — estilo Kinland */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>

        {/* CONTENIDO IZQUIERDA */}
        <div style={{ padding: '72px 56px 100px 56px', borderRight: '1px solid rgba(20,18,16,0.08)' }}>

          {/* Resumen */}
          {obra.resumen && (
            <p style={{ fontSize: 'clamp(18px,2vw,24px)', fontWeight: 300, lineHeight: 1.65, color: '#141210', marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
              {obra.resumen}
            </p>
          )}

          {/* Bloques intercalados */}
          {bloques.map((bloque, i) => {
            if (bloque.type === 'image') {
              const img = bloque.content
              const aspectRatio = `${img.width}/${img.height}`
              return (
                <div key={i} style={{ marginBottom: 4, overflow: 'hidden', background: '#e8e5df' }}>
                  <img
                    src={img.url}
                    alt=""
                    style={{ width: '100%', display: 'block', aspectRatio, objectFit: 'cover' }}
                  />
                </div>
              )
            } else {
              return (
                <p key={i} style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', margin: '48px 0', maxWidth: 640 }}>
                  {bloque.content}
                </p>
              )
            }
          })}
        </div>

        {/* SIDEBAR DERECHA */}
        <div style={{ padding: '72px 40px', position: 'sticky', top: 0, background: '#f5f3ee' }}>

          {/* Detalles */}
          <Link href="/obras" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52448a', marginBottom: 48 }}>
            ← Volver a proyectos
          </Link>

          {[
            { label: 'Categoria', val: obra.categoria },
            { label: 'Cliente', val: obra.cliente },
            { label: 'Arquitecto', val: obra.arquitecto },
            { label: 'Ubicacion', val: obra.ubicacion },
            { label: 'Superficie', val: obra.superficie },
            { label: 'Ano', val: obra.anio },
          ].filter(d => d.val).map((d, i, arr) => (
            <div key={d.label} style={{ marginBottom: i < arr.length - 1 ? 24 : 0, paddingBottom: i < arr.length - 1 ? 24 : 0, borderBottom: i < arr.length - 1 ? '1px solid rgba(20,18,16,0.08)' : 'none' }}>
              <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8278', display: 'block', marginBottom: 6 }}>{d.label}</span>
              <span style={{ fontSize: 14, fontWeight: 300, color: '#141210', lineHeight: 1.6 }}>{d.val}</span>
            </div>
          ))}

          {/* Botón Seamos Partners */}
          <Link href="/contacto" style={{ display: 'block', background: '#141210', color: '#fff', textAlign: 'center', padding: '14px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 40 }}>
            Seamos Partners
          </Link>

          {/* Navegacion */}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {anterior && (
              <Link href={`/obras/${anterior.slug?.current}`}
                style={{ display: 'flex', flexDirection: 'column', padding: '14px 16px', border: '1px solid rgba(20,18,16,0.12)', background: '#fff', textDecoration: 'none' }}>
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>← Proyecto anterior</span>
                <span style={{ fontSize: 12, fontWeight: 400, color: '#141210', lineHeight: 1.3 }}>{anterior.titulo}</span>
              </Link>
            )}
            {siguiente && (
              <Link href={`/obras/${siguiente.slug?.current}`}
                style={{ display: 'flex', flexDirection: 'column', padding: '14px 16px', border: '1px solid rgba(20,18,16,0.12)', background: '#fff', textDecoration: 'none' }}>
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Siguiente proyecto →</span>
                <span style={{ fontSize: 12, fontWeight: 400, color: '#141210', lineHeight: 1.3 }}>{siguiente.titulo}</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}