'use client'
import Link from 'next/link'
import NokiChrome, { C, ctaBtn, secBtn, FadeUp, useNokiForm } from '../shared'

export type Spec = { l: string, v: string }

export function ModeloDetail({
  eyebrow, title, description, heroImg, detailImg, specs, planoPdf, gallery,
}: {
  eyebrow: string
  title: string
  description: string
  heroImg: string
  detailImg?: string
  specs: Spec[]
  planoPdf?: string
  gallery?: string[]
}) {
  const openForm = useNokiForm()
  const rightImg = detailImg || heroImg

  return (
    <NokiChrome>
      <section style={{ padding: '160px 32px 0' }}>
        <FadeUp>
          <Link href="/noki/modelos" style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 20, textAlign: 'center' }}>
            ← Todos los modelos
          </Link>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 20, textAlign: 'center', opacity: 0.4 }}>{eyebrow}</p>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 400, lineHeight: 1.08, color: C.dark, maxWidth: 760, margin: '0 auto 24px', textAlign: 'center' }}>
            {title}
          </h1>
          <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.8, textAlign: 'center' }}>
            {description}
          </p>
        </FadeUp>

        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 56 }}>
          <img src={heroImg} alt={title} style={{ width: '100%', height: '65vh', objectFit: 'cover', display: 'block' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 64px', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Tu Noki, en cualquier lugar.</p>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 500, color: C.dark, marginBottom: 12, lineHeight: 1.2 }}>
              {title}
            </h3>
            <p style={{ fontSize: 15, fontWeight: 300, color: C.mid, lineHeight: 1.75, marginBottom: 32 }}>
              Diseñada para ir a cualquier lugar de Chile. Estructura prefabricada en paneles estructurales térmicos FURŌ.
            </p>
            {specs.map(({ l, v }) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.muted, fontWeight: 500 }}>{l}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 400, color: C.dark }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={openForm} style={ctaBtn}>Estoy interesado</button>
              {planoPdf && (
                <a href={planoPdf} target="_blank" rel="noopener noreferrer" style={{ ...secBtn, background: 'transparent', border: `1px solid ${C.border}`, display: 'inline-flex', alignItems: 'center' }}>
                  Ver plano ↗
                </a>
              )}
            </div>
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f2f0eb', aspectRatio: '4 / 5' }}>
            <img src={rightImg} alt={title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', padding: 24 }} />
          </div>
        </div>

        {!planoPdf && (
          <p style={{ fontSize: 13, fontWeight: 300, color: C.muted, textAlign: 'center', padding: '32px 0 72px' }}>Planos disponibles próximamente.</p>
        )}
        {planoPdf && <div style={{ paddingBottom: 72 }} />}
      </section>

      {gallery && gallery.length > 0 && (
        <section style={{ padding: '0 32px 32px' }}>
          <div className="noki-gal">
            {gallery.map((img, i) => (
              <img key={img} src={img} alt={`${title} — foto ${i + 1}`} />
            ))}
          </div>
          <div style={{ padding: '14px 4px', background: C.white }}>
            <p style={{ fontSize: 12, fontWeight: 300, color: C.muted }}>Fotos reales — {title} en construcción.</p>
          </div>
        </section>
      )}
    </NokiChrome>
  )
}
