'use client'
import Link from 'next/link'
import NokiChrome, { C, serif, FadeUp } from '../shared'

const MODELOS = [
  { slug: 'noki-i', nombre: 'Noki I', desc: '3 dormitorios · 3 baños · 162 m²', img: '/noki/Modelos/baja/nokiI.jpg' },
  { slug: 'noki-ii-65', nombre: 'Noki II — 65 m²', desc: '1 dormitorio · 1 baño · 1 estar', img: '/noki/Modelos/baja/nokiII_65.jpg' },
  { slug: 'noki-ii-110', nombre: 'Noki II — 110 m²', desc: '2 dormitorios · 2 baños (1 en suite)', img: '/noki/Modelos/baja/nokiII_110.jpg' },
  { slug: 'noki-ii-140', nombre: 'Noki II — 140 m²', desc: '3 dormitorios · 2 baños', img: '/noki/Modelos/baja/nokiII_140.jpg' },
  { slug: 'noki-ii-160', nombre: 'Noki II — 160 m²', desc: '2 dormitorios en suite · 2 baños · Quincho 42 m²', img: '/noki/Modelos/baja/nokiII_160.jpg' },
]

function ModeloTile({ m }: { m: typeof MODELOS[number] }) {
  return (
    <Link href={`/noki/modelos/${m.slug}`} style={{ position: 'relative', display: 'block', aspectRatio: '4 / 3', overflow: 'hidden' }}>
      <img src={m.img} alt={m.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)' }} />
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 400, color: '#fff', marginBottom: 8, lineHeight: 1.15 }}>{m.nombre}</h2>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.75)' }}>{m.desc}</p>
      </div>
    </Link>
  )
}

export default function Modelos() {
  return (
    <NokiChrome>
      <style>{`
        .modelos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 0 4px 4px; }
        @media (max-width: 900px) { .modelos-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .modelos-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section style={{ padding: '160px 48px 56px' }}>
        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 20, textAlign: 'center', opacity: 0.4 }}>Modelos</p>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 400, lineHeight: 1.08, color: C.dark, maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            Un modelo para <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>cada terreno.</em>
          </h1>
        </FadeUp>
      </section>

      <div className="modelos-grid">
        <ModeloTile m={MODELOS[0]} />

        <div style={{ aspectRatio: '4 / 3', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, textAlign: 'center', maxWidth: 320 }}>
            Noki está construyendo la próxima generación de viviendas prefabricadas — usando materiales naturales y de alto desempeño para crear casas que se adaptan a cualquier paisaje de Chile.
          </p>
        </div>

        {MODELOS.slice(1).map(m => <ModeloTile key={m.slug} m={m} />)}
      </div>
    </NokiChrome>
  )
}
