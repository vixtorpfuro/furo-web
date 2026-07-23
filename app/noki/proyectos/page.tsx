'use client'
import NokiChrome, { C, serif, FadeUp } from '../shared'

const PUNTA_LOBOS_HERO = 'https://cdn.sanity.io/images/i6et1cld/production/9d671f1bf093ec65384e56e2419108a60aa0b43d-1920x1446.webp'
const PUNTA_LOBOS_GALERIA = [
  'https://cdn.sanity.io/images/i6et1cld/production/89fa8a599dc7098c787773670bed8bd75878bada-1920x1080.webp',
  'https://cdn.sanity.io/images/i6et1cld/production/d55b0cbec75f94661f173cbe04b0ad7053b5a00f-1920x1080.webp',
  'https://cdn.sanity.io/images/i6et1cld/production/0d7cb89ff803b57712253f126cbbe65a59a376c2-1080x1919.webp',
  'https://cdn.sanity.io/images/i6et1cld/production/ccb1291bc2d0a587d9bf5041cc9c90fd81203075-1920x1080.webp',
  'https://cdn.sanity.io/images/i6et1cld/production/2310942a456521781a3a39c6e148a194827e44b4-1080x1657.webp',
  'https://cdn.sanity.io/images/i6et1cld/production/e832ca352e4437132db99f445bf5422e59fe8d46-1920x1446.webp',
]

export default function Proyectos() {
  return (
    <NokiChrome>
      <section style={{ padding: '160px 48px 48px', textAlign: 'center' }}>
        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 24, opacity: 0.4 }}>Proyectos</p>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 400, lineHeight: 1.08, color: C.dark, maxWidth: 760, margin: '0 auto' }}>
            Casas Noki, en <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>construcción real.</em>
          </h1>
        </FadeUp>
      </section>

      {/* PUNTA LOBOS — PROYECTO REALIZADO */}
      <section style={{ padding: '0 32px 32px' }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
          <img src={PUNTA_LOBOS_HERO} alt="Punta Lobos" style={{ width: '100%', height: '70vh', objectFit: 'cover', display: 'block' }} />
        </div>

        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Proyecto realizado</p>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(26px,3vw,42px)', fontWeight: 400, color: C.dark, marginBottom: 20, lineHeight: 1.15 }}>
            Punta Lobos: Noki I en terreno real.
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: C.mid, lineHeight: 1.85, maxWidth: 720, marginBottom: 32 }}>
            En Punta Lobos construimos 8 viviendas con el mismo sistema de Paneles Estructurales Térmicos FURŌ que hoy es Noki I: estructura prefabricada en madera laminada, montada con precisión en terreno, con una arquitectura contemporánea y coherente en todo el conjunto. 791 m² construidos que demuestran que Noki I no es una promesa — es un proyecto real, ya habitado.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 40, marginBottom: 32 }}>
            {[
              { l: 'Ubicación', v: 'Punta Lobos, Chile' },
              { l: 'Superficie', v: '791 m² · 8 viviendas' },
              { l: 'Año', v: '2025' },
            ].map(({ l, v }) => (
              <div key={l}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>{l}</p>
                <p style={{ fontSize: 14, fontWeight: 400, color: C.dark }}>{v}</p>
              </div>
            ))}
          </div>
          <a href="https://furo.company/obras/punta-lobos" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.dark, borderBottom: `1px solid ${C.dark}`, paddingBottom: 2 }}>
            Ver proyecto completo en furo.company ↗
          </a>
        </FadeUp>

        <div className="noki-gal" style={{ marginTop: 40 }}>
          {PUNTA_LOBOS_GALERIA.map((img, i) => (
            <img key={img} src={img} alt={`Punta Lobos — foto ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* FOTO INTERIOR */}
      <section style={{ padding: '0 32px 32px' }}>
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
          <img src="/noki/5-1.avif" alt="Interior Noki" style={{ width: '100%', display: 'block', height: '68vh', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, display: 'flex', alignItems: 'center', padding: '0 56px' }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(28px,4vw,56px)', fontWeight: 400, color: '#fff', lineHeight: 1.08, maxWidth: '12ch' }}>
              Tu espacio, tu <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>historia.</em>
            </h3>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section style={{ padding: '32px 32px 0' }}>
        <div className="noki-gal">
          {['P1010657.jpg','P1010640.jpg','P1010586.jpg','P1010591.jpg','P1010593.jpg','P1010594.jpg','P1010632.jpg'].map((img,i) => (
            <img key={i} src={`/noki/${img}`} alt={`Noki ${i+1}`} />
          ))}
        </div>
        <div style={{ padding: '14px 4px', background: C.white }}>
          <p style={{ fontSize: 12, fontWeight: 300, color: C.muted }}>Fotos reales — primeras casas Noki en construcción.</p>
        </div>
      </section>
    </NokiChrome>
  )
}
