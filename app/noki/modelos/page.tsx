'use client'
import Link from 'next/link'
import NokiChrome, { C, serif, FadeUp } from '../shared'
import { MODELOS, LETRA_CHICA, formatoUF, type Modelo } from './datos'

function ModeloTile({ m }: { m: Modelo }) {
  return (
    <Link href={`/noki/modelos/${m.slug}`} className="modelo-tile">
      <img src={m.hero} alt={m.nombre} loading="lazy" />
      <div className="modelo-sombra" />
      {m.desdeUF != null && (
        <div className="modelo-precio">
          <span>Desde</span>
          <strong>{formatoUF(m.desdeUF)} UF</strong>
        </div>
      )}
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22 }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 400, color: '#fff', marginBottom: 6, lineHeight: 1.15 }}>{m.nombre}</h2>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}>{m.resumen}</p>
      </div>
    </Link>
  )
}

export default function Modelos() {
  return (
    <NokiChrome>
      <style>{`
        .modelos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 0 6px 6px; }
        .modelo-tile { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; }
        .modelo-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s cubic-bezier(.16,1,.3,1); }
        .modelo-tile:hover img { transform: scale(1.03); }
        .modelo-sombra { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.12) 45%, transparent 70%); }
        .modelo-precio { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.94); color: #1a1714; border-radius: 10px; padding: 8px 12px; text-align: right; line-height: 1.15; }
        .modelo-precio span { display: block; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #8a8278; }
        .modelo-precio strong { font-size: 17px; font-weight: 500; }
        @media (max-width: 900px) { .modelos-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .modelos-grid { grid-template-columns: 1fr; padding: 0 0 6px; } .modelos-intro { padding: 120px 16px 40px !important; } }
      `}</style>

      <section className="modelos-intro" style={{ padding: '160px 48px 56px' }}>
        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 20, textAlign: 'center', opacity: 0.4 }}>Modelos</p>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 400, lineHeight: 1.08, color: C.dark, maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            Un modelo para <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>cada terreno.</em>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 300, color: C.mid, maxWidth: 560, margin: '20px auto 0', textAlign: 'center', lineHeight: 1.7 }}>
            Nueve modelos, de 70 a 162 m². Fabricados en planta con paneles estructurales térmicos FURŌ y montados en tu terreno.
          </p>
        </FadeUp>
      </section>

      <div className="modelos-grid">
        <div style={{ aspectRatio: '4 / 3', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, textAlign: 'center', maxWidth: 320 }}>
            Noki está construyendo la próxima generación de viviendas prefabricadas — usando materiales naturales y de alto desempeño para crear casas que se adaptan a cualquier paisaje de Chile.
          </p>
        </div>
        {MODELOS.map(m => <ModeloTile key={m.slug} m={m} />)}
      </div>

      <p style={{ fontSize: 11.5, fontWeight: 300, color: C.muted, lineHeight: 1.7, maxWidth: 860, margin: '0 auto', padding: '24px 20px 72px', textAlign: 'center' }}>
        {LETRA_CHICA}
      </p>
    </NokiChrome>
  )
}
