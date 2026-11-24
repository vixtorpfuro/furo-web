'use client'
import Link from 'next/link'
import NokiChrome, { C, serif, ctaBtn, secBtn, FadeUp, AbrirFormularioButton, abrirCalendly } from '../shared'

// Landing de la campaña: lo mismo que promete el anuncio de Meta.
// Los valores "desde" son los mismos del anuncio; se editan aquí.
// 2.402 UF = Noki II 70 (total más bajo). 27,7 UF/m² = Noki II 160 (incluye quincho de 36 m²).
const DESDE_UF = '2.402'
const DESDE_M2 = '27,7'

const CARACTERISTICAS = [
  { ic: 1, t: 'Ubicación flexible', d: 'Fabricada en planta y montada en tu terreno, del desierto a la Patagonia.' },
  { ic: 2, t: 'Velocidad', d: 'La estructura se fabrica en planta mientras se preparan las fundaciones, y se monta en semanas.' },
  { ic: 3, t: 'Eficiencia energética', d: 'Paneles estructurales térmicos FURŌ con aislación continua: más confort y menos gasto en calefacción.' },
  { ic: 4, t: 'Estructura de madera laminada', d: 'Componentes prefabricados en madera, cortados con precisión de fábrica.' },
  { ic: 5, t: 'Diseño minimalista', d: 'Volúmenes simples a dos aguas, espacios abiertos y mucha luz natural.' },
  { ic: 6, t: 'Materiales premium', d: 'Pino termotratado con Cutek y porcelanato en zonas húmedas.' },
]

const GALERIA = [
  { src: '/noki/Modelos/galeria/noki-ii-75/hero.jpg', alt: 'Noki II 75 junto a una laguna', pie: 'Noki II 75 · 75 m²' },
  { src: '/noki/Modelos/galeria/noki-ii-147/quincho.jpg', alt: 'Noki II 147 con quincho', pie: 'Noki II 147 · quincho de 36 m²' },
  { src: '/noki/Modelos/galeria/noki-ii-75/living.jpg', alt: 'Living del Noki II 75', pie: 'Interior Noki II 75' },
  { src: '/noki/Modelos/galeria/noki-ii-70/hero.jpg', alt: 'Noki II 70 en carbón oscuro', pie: 'Noki II 70 · 70 m²' },
]

const ESTILOS = `
  .lp-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; min-height: 78vh; }
  .lp-feat { display: grid; grid-template-columns: repeat(3, 1fr); gap: 56px 48px; }
  .lp-gal { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  @media (max-width: 900px) {
    .lp-hero { grid-template-columns: 1fr; min-height: 0; }
    .lp-hero-img { height: 52vw; min-height: 240px; }
    .lp-hero-txt { padding: 40px 24px 56px !important; }
    .lp-feat { grid-template-columns: 1fr; gap: 40px; }
    .lp-sec { padding-left: 24px !important; padding-right: 24px !important; }
  }
  @media (max-width: 600px) { .lp-gal { grid-template-columns: 1fr; } }
`

export default function AgendaNoki() {
  return (
    <NokiChrome>
      <style>{ESTILOS}</style>

      {/* HERO */}
      <section style={{ background: C.white, paddingTop: 96 }}>
        <div className="lp-hero">
          <div className="lp-hero-img" style={{ overflow: 'hidden', background: '#dedad4' }}>
            <img src="/noki/Modelos/galeria/noki-ii-70/hero.jpg" alt="Casa Noki en el bosque" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div className="lp-hero-txt" style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FadeUp>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dark, opacity: 0.4, marginBottom: 20 }}>Noki by FURŌ</p>
              <h1 style={{ fontFamily: serif, fontSize: 'clamp(34px,4vw,56px)', fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: 24 }}>
                Tu casa, en tu terreno.
              </h1>
              <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, lineHeight: 1.8, marginBottom: 28 }}>
                Casas prefabricadas en madera, fabricadas en planta y montadas en tu terreno, en cualquier lugar de Chile.
              </p>
              <p style={{ fontSize: 'clamp(24px,2.4vw,32px)', fontWeight: 500, color: C.dark, marginBottom: 6 }}>Desde {DESDE_UF} UF + IVA</p>
              <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, marginBottom: 10 }}>Desde {DESDE_M2} UF/m² + IVA, según modelo</p>
              <p style={{ fontSize: 12, fontWeight: 300, color: C.muted, lineHeight: 1.6, marginBottom: 36 }}>
                Valores referenciales, netos más IVA. No incluye fundaciones ni logística.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <button type="button" onClick={abrirCalendly} style={ctaBtn}>Agendar reunión de 30 min →</button>
                <AbrirFormularioButton style={secBtn}>Dejar mis datos</AbrirFormularioButton>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="lp-sec" style={{ background: '#f5f3ee', padding: '96px 64px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, opacity: 0.4, marginBottom: 56, textAlign: 'center' }}>Por qué Noki</p>
          </FadeUp>
          <div className="lp-feat">
            {CARACTERISTICAS.map(c => (
              <FadeUp key={c.t}>
                <div style={{ textAlign: 'center' }}>
                  <img src={`/noki/iconos/icono-${c.ic}.png`} alt="" style={{ height: 44, width: 'auto', display: 'block', margin: '0 auto 22px' }} />
                  <h3 style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dark, marginBottom: 14 }}>{c.t}</h3>
                  <p style={{ fontSize: 16, fontWeight: 300, color: C.mid, lineHeight: 1.75, maxWidth: 340, margin: '0 auto' }}>{c.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="lp-sec" style={{ background: C.white, padding: '8px 8px 0' }}>
        <div className="lp-gal">
          {GALERIA.map(g => (
            <figure key={g.src} style={{ position: 'relative', margin: 0, overflow: 'hidden', background: '#efece6', aspectRatio: '3 / 2' }}>
              <img src={g.src} alt={g.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <figcaption style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 20px 16px', fontSize: 12, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: 'linear-gradient(to top, rgba(18,14,10,0.6), rgba(18,14,10,0))' }}>{g.pie}</figcaption>
            </figure>
          ))}
        </div>
        <p style={{ fontSize: 11.5, fontWeight: 300, color: C.muted, textAlign: 'center', padding: '20px 16px 0' }}>
          Imágenes referenciales. Terminaciones, tamaño y mobiliario pueden variar según selección.
        </p>
      </section>

      {/* LLAMADO FINAL */}
      <section className="lp-sec" style={{ background: C.white, padding: '96px 64px 112px', textAlign: 'center' }}>
        <FadeUp>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,3.4vw,44px)', fontWeight: 400, color: C.dark, lineHeight: 1.15, maxWidth: 640, margin: '0 auto 20px' }}>
            Conversemos sobre tu terreno.
          </h2>
          <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, lineHeight: 1.8, maxWidth: 560, margin: '0 auto 40px' }}>
            En 30 minutos te contamos cómo funciona el proceso, resolvemos tus dudas y vemos si Noki calza con tu terreno y tus tiempos.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <button type="button" onClick={abrirCalendly} style={ctaBtn}>Agendar reunión de 30 min →</button>
            <AbrirFormularioButton style={secBtn}>Dejar mis datos</AbrirFormularioButton>
            <Link href="/noki/modelos" style={{ ...secBtn, background: 'transparent', border: `1px solid ${C.border}` }}>Ver más modelos Noki</Link>
          </div>
        </FadeUp>
      </section>
    </NokiChrome>
  )
}
