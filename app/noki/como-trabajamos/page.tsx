'use client'
import { useState } from 'react'
import NokiChrome, { C, serif, ctaBtn, FadeUp, useNokiForm } from '../shared'

const WHY_ITEMS = [
  { img: 'P1010593.jpg', t: 'Montaje rápido, proceso transparente', d: 'Los paneles estructurales térmicos FURŌ llegan prefabricados desde nuestra planta. La estructura se monta en 4 a 8 meses. Presupuesto claro, plazo predecible.', sub: 'Ensamblaje preciso. Sin imprevistos.' },
  { img: 'P1010591.jpg', t: 'Materiales naturales para todo clima', d: 'Paneles Estructurales Térmicos FURŌ, envolvente 160mm con lana de oveja. Eficiente en la costa y en el frío del sur. Interior en madera laminada vista.', sub: 'Una casa que se siente diferente.' },
  { img: 'P1010657.jpg', t: 'Una casa que se adapta contigo', d: 'Elige terminaciones y materiales sin alterar la estructura. Precio a suma alzada desde el primer día. Tu Noki, con tu impronta.', sub: 'Personalizable dentro del sistema.' },
]

export default function ComoTrabajamos() {
  const [whyActive, setWhyActive] = useState(0)
  const openForm = useNokiForm()

  return (
    <NokiChrome>
      <section style={{ padding: '160px 48px 64px', background: C.white }}>
        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 32, textAlign: 'center', opacity: 0.4 }}>Cómo trabajamos</p>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(36px,5vw,68px)', fontWeight: 400, lineHeight: 1.08, color: C.dark, maxWidth: 820, margin: '0 auto 24px', textAlign: 'center' }}>
            Casas prefabricadas para vivir mejor, en <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'calc(1em + 4px)' }}>cualquier lugar.</em>
          </h1>
          <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.8, textAlign: 'center' }}>
            Prefabricadas en Santiago y montadas en tu terreno en meses. Para la playa, el campo, el sur o la patagonia.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={openForm} style={ctaBtn}>Únete a la lista de espera</button>
          </div>
        </FadeUp>
      </section>

      {/* WHY NOKI */}
      <section style={{ background: C.dark }}>
        <div style={{ padding: '80px 48px 48px', textAlign: 'center' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>Por qué Noki</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 400, lineHeight: 1.08, color: '#fff', maxWidth: 700, margin: '0 auto 20px' }}>
              Construida mejor. Entregada más <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>rápido.</em>
            </h2>
            <p style={{ fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
              Materiales naturales de alto desempeño, diseño minimalista y precio transparente desde el primer día.
            </p>
          </FadeUp>
        </div>

        <div className="why-section" style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="why-items">
            {WHY_ITEMS.map((item, i) => (
              <button key={i} className="why-btn" onClick={() => setWhyActive(i)}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(20px,2vw,30px)', fontWeight: 400, color: whyActive === i ? '#fff' : 'rgba(255,255,255,0.3)', lineHeight: 1.25, marginBottom: whyActive === i ? 14 : 0, transition: 'color 0.3s, margin 0.4s' }}>
                  {item.t}
                </h3>
                <div style={{ maxHeight: whyActive === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
                  <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 10 }}>{item.d}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>+ {item.sub}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="why-img-wrap">
            {WHY_ITEMS.map((item, i) => (
              <img key={i} src={`/noki/${item.img}`} alt={item.t} style={{ opacity: whyActive === i ? 1 : 0 }} />
            ))}
          </div>
        </div>

        {/* BENEFICIOS */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="bene-grid">
            {[
              { n:'01', t:'Va a cualquier lugar', d:'Transportada en camión. Montada en cualquier geografía chilena.' },
              { n:'02', t:'Precio transparente', d:'Suma alzada. Sin adicionales. Sabes lo que pagas desde el día uno.' },
              { n:'03', t:'Aislación real', d:'160mm de lana de oveja. Eficiente en la costa y en el sur.' },
              { n:'04', t:'Paneles Estructurales Térmicos FURŌ', d:'Más resistente y liviano. Interior visto que se siente diferente.' },
              { n:'05', t:'Montaje en meses', d:'Estructura prefabricada. 4 a 8 meses en tu terreno.' },
              { n:'06', t:'Personalizable', d:'Terminaciones a tu gusto. Sin afectar estructura ni precio.' },
            ].map(({ n, t, d }) => (
              <div key={n} className="bene-item">
                <p style={{ fontSize: 11, color: 'rgba(245,243,238,0.18)', letterSpacing: '0.12em', marginBottom: 18 }}>{n}</p>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 400, color: '#f5f3ee', marginBottom: 10, lineHeight: 1.3 }}>{t}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(245,243,238,0.45)', lineHeight: 1.8 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </NokiChrome>
  )
}
