'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Atributos from './Atributos'
import NokiChrome, { C, ctaBtn, FadeUp, AbrirFormularioButton } from '../shared'
import { MODELOS, INCLUYE, modeloPorSlug } from './datos'

const sans = "'DM Sans', sans-serif"
const etiqueta: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }

const ESTILOS = `
  .mf-wrap { padding: 0 32px; }
  .mf-hero { width: 100%; height: min(78vh, 760px); min-height: 320px; object-fit: cover; display: block; }
  @media (max-width: 600px) { .mf-hero { height: auto; min-height: 0; aspect-ratio: 4 / 3; } }
  .mf-top { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 64px; align-items: start; padding: 56px 0 72px; }
  .mf-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: ${C.border}; border: 1px solid ${C.border}; border-radius: 12px; overflow: hidden; }
  .mf-gal { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .mf-gal button { all: unset; cursor: zoom-in; display: block; overflow: hidden; border-radius: 10px; background: #efece6; }
  .mf-gal img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s cubic-bezier(.16,1,.3,1); }
  .mf-gal button:hover img { transform: scale(1.025); }
  .mf-gal .ancha { grid-column: 1 / -1; aspect-ratio: 16 / 8; }
  .mf-gal .media { aspect-ratio: 4 / 3; }
  .mf-plano { display: grid; grid-template-columns: 1fr 320px; gap: 48px; align-items: start; }
  .mf-otros { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  @media (max-width: 900px) {
    .mf-wrap { padding: 0 16px; }
    .mf-top { grid-template-columns: 1fr; gap: 36px; padding: 36px 0 48px; }
    .mf-plano { grid-template-columns: 1fr; gap: 28px; }
    .mf-otros { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .mf-gal { grid-template-columns: 1fr; gap: 6px; }
    .mf-gal .ancha, .mf-gal .media { aspect-ratio: 4 / 3; }
  }
`

function Visor({ fotos, i, alt, cerrar, ir }: { fotos: string[]; i: number; alt: string; cerrar: () => void; ir: (d: number) => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); if (e.key === 'ArrowRight') ir(1); if (e.key === 'ArrowLeft') ir(-1) }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [cerrar, ir])
  const flecha: React.CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', width: 48, height: 48, borderRadius: 24, fontSize: 22, cursor: 'pointer' }
  return (
    <div role="dialog" aria-modal="true" aria-label={alt} onClick={cerrar} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(16,14,12,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <img src={fotos[i]} alt={`${alt} — imagen ${i + 1}`} onClick={e => e.stopPropagation()} style={{ maxWidth: '100%', maxHeight: '88vh', objectFit: 'contain', borderRadius: 8 }} />
      <button aria-label="Anterior" onClick={e => { e.stopPropagation(); ir(-1) }} style={{ ...flecha, left: 16 }}>‹</button>
      <button aria-label="Siguiente" onClick={e => { e.stopPropagation(); ir(1) }} style={{ ...flecha, right: 16 }}>›</button>
      <button aria-label="Cerrar" onClick={cerrar} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>×</button>
      <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{i + 1} / {fotos.length}</p>
    </div>
  )
}

// Los precios no se muestran en la web: viven solo en la publicidad (y en datos.ts como referencia interna).
export function ModeloDetail({ slug }: { slug: string }) {
  const m = modeloPorSlug(slug)!
  // La foto principal ya está arriba: la galería muestra el resto, y el visor recorre todas.
  const fotos = m.galeria.filter(f => f !== m.hero)
  const visor = [m.hero, ...fotos]
  const [abierta, setAbierta] = useState<number | null>(null)
  const total = visor.length
  const ir = useCallback((d: number) => setAbierta(i => (i == null ? i : (i + d + total) % total)), [total])
  const cerrar = useCallback(() => setAbierta(null), [])
  const otros = MODELOS.filter(o => o.slug !== m.slug)

  // Patrón de galería: dos medias y una ancha; una media que quedaría sola al final va ancha.
  const clase = (i: number) => {
    const pos = i % 3
    if (pos === 2) return 'ancha'
    if (pos === 0 && i === fotos.length - 1) return 'ancha'
    return 'media'
  }

  return (
    <NokiChrome>
      <style>{ESTILOS}</style>

      <section style={{ paddingTop: 112 }} className="mf-wrap">
        <button onClick={() => setAbierta(0)} aria-label={`Ampliar imagen principal de ${m.nombre}`} style={{ all: 'unset', cursor: 'zoom-in', display: 'block', width: '100%', borderRadius: 16, overflow: 'hidden', background: '#efece6' }}>
          <img className="mf-hero" src={m.hero} alt={m.nombre} />
        </button>

        <div className="mf-top">
          <FadeUp>
            <Link href="/noki/modelos" style={{ ...etiqueta, display: 'inline-block', marginBottom: 24 }}>← Todos los modelos</Link>
            <p style={{ ...etiqueta, marginBottom: 14 }}>{m.linea}</p>
            <h1 style={{ fontFamily: sans, fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, lineHeight: 1.04, color: C.dark, marginBottom: 22, letterSpacing: '-0.02em' }}>{m.nombre}</h1>
            <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, lineHeight: 1.75, maxWidth: 560 }}>{m.descripcion}</p>
            <p style={{ fontSize: 14, fontWeight: 300, color: C.muted, lineHeight: 1.7, maxWidth: 560, marginTop: 16 }}>
              Estructura prefabricada en paneles estructurales térmicos FURŌ, fabricada en planta y montada en tu terreno, en cualquier lugar de Chile.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{ background: '#f4f1eb', borderRadius: 16, padding: 'clamp(24px,3vw,36px)' }}>
              <div className="mf-specs" style={{ margin: '0 0 28px' }}>
                {m.specs.map(s => (
                  <div key={s.l} style={{ background: '#f4f1eb', padding: '16px 18px' }}>
                    <p style={{ ...etiqueta, fontSize: 10, marginBottom: 8 }}>{s.l}</p>
                    <p style={{ fontFamily: sans, fontSize: 20, color: C.dark }}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <AbrirFormularioButton modelo={m.nombre} style={{ ...ctaBtn, flex: '1 1 auto', textAlign: 'center' }}>Cotizar este modelo</AbrirFormularioButton>
                {m.planoPdf && (
                  <a href={m.planoPdf} target="_blank" rel="noopener noreferrer" style={{ ...ctaBtn, background: 'transparent', color: C.dark, border: `1px solid rgba(26,23,20,0.18)`, flex: '1 1 auto', textAlign: 'center' }}>
                    Ver plano ↗
                  </a>
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="mf-wrap" style={{ paddingBottom: 16 }}>
        <div className="mf-gal">
          {fotos.map((f, i) => (
            <button key={f} className={clase(i)} onClick={() => setAbierta(i + 1)} aria-label={`Ampliar imagen ${i + 2} de ${m.nombre}`}>
              <img src={f} alt={`${m.nombre} — imagen ${i + 2}`} loading="lazy" />
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, fontWeight: 300, color: C.muted, padding: '12px 2px 0' }}>
          {m.fotosReales ? `Fotos reales — ${m.nombre}.` : 'Imágenes referenciales. Terminaciones, tamaño y mobiliario pueden variar según selección.'}
        </p>
      </section>

      <div style={{ marginTop: 72 }}><Atributos /></div>

      {(m.planoImg || m.planoPdf) && (
        <section className="mf-wrap" style={{ padding: '88px 0 0' }}>
          <div className="mf-wrap">
            <div className="mf-plano">
              {m.planoImg ? (
                <a href={m.planoPdf} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 'clamp(12px,2vw,28px)' }}>
                  <img src={m.planoImg} alt={`Planta y elevaciones ${m.nombre}`} loading="lazy" style={{ width: '100%', display: 'block' }} />
                </a>
              ) : <div />}
              <div>
                <p style={{ ...etiqueta, marginBottom: 14 }}>Planta y programa</p>
                <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                  {m.programa.map(p => (
                    <li key={p} style={{ fontSize: 15, fontWeight: 300, color: C.dark, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>{p}</li>
                  ))}
                </ul>
                <p style={{ ...etiqueta, marginBottom: 14 }}>Superficies</p>
                {m.superficies.map(s => (
                  <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}`, fontSize: 15 }}>
                    <span style={{ fontWeight: 300, color: C.mid }}>{s.l}</span>
                    <span style={{ color: C.dark }}>{s.v}</span>
                  </div>
                ))}
                {m.planoPdf && (
                  <a href={m.planoPdf} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 24, fontSize: 14, fontWeight: 500, color: C.dark, borderBottom: `1px solid ${C.dark}`, paddingBottom: 2 }}>
                    Descargar plano en PDF ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mf-wrap" style={{ padding: '88px 0 0' }}>
        <div className="mf-wrap">
          <p style={{ ...etiqueta, marginBottom: 20 }}>Terminaciones incluidas</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 40px' }}>
            {INCLUYE.map(x => (
              <div key={x.l} style={{ padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 4 }}>{x.l}</p>
                <p style={{ fontSize: 14, fontWeight: 300, color: C.mid, lineHeight: 1.55 }}>{x.v}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, fontWeight: 300, color: C.muted, lineHeight: 1.7, marginTop: 28, maxWidth: 820 }}>Imágenes referenciales. Terminaciones, tamaño y mobiliario pueden variar según selección.</p>
        </div>
      </section>

      <section className="mf-wrap" style={{ padding: '96px 0 72px' }}>
        <div className="mf-wrap">
          <p style={{ ...etiqueta, marginBottom: 20 }}>Otros modelos</p>
          <div className="mf-otros">
            {otros.map(o => (
              <Link key={o.slug} href={`/noki/modelos/${o.slug}`} style={{ display: 'block' }}>
                <div style={{ aspectRatio: '4 / 3', borderRadius: 10, overflow: 'hidden', background: '#efece6', marginBottom: 10 }}>
                  <img src={o.hero} alt={o.nombre} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <p style={{ fontSize: 15, color: C.dark }}>{o.nombre}</p>
                <p style={{ fontSize: 12.5, fontWeight: 300, color: C.muted, marginTop: 2 }}>
                  {o.resumen}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {abierta != null && <Visor fotos={visor} i={abierta} alt={m.nombre} cerrar={cerrar} ir={ir} />}
    </NokiChrome>
  )
}
