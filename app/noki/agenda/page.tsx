'use client'
import NokiChrome, { C, serif, ctaBtn, secBtn, FadeUp, useNokiForm } from '../shared'

const CALENDLY_URL = 'https://calendly.com/vpellegrini-furo/30min'

export default function AgendaNoki() {
  const openForm = useNokiForm()

  return (
    <NokiChrome>
      <section style={{ background: C.white, paddingTop: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh' }}>
          <div style={{ overflow: 'hidden', background: '#dedad4' }}>
            <img src="/noki/noki1_hero.jpg" alt="Casa Noki" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FadeUp>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dark, opacity: 0.4, marginBottom: 20 }}>Agenda tu reunión</p>
              <h1 style={{ fontFamily: serif, fontSize: 'clamp(30px,3.4vw,48px)', fontWeight: 400, color: C.dark, lineHeight: 1.15, marginBottom: 28 }}>
                Conversemos sobre tu próxima casa Noki.
              </h1>
              <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 16 }}>
                En 20 minutos te contamos cómo funciona el proceso, resolvemos tus dudas y vemos si Noki calza con tu terreno y tus tiempos.
              </p>
              <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 40 }}>
                Elige el horario que más te acomode, o déjanos tus datos y te contactamos nosotros.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={ctaBtn}>Agendar en Calendly →</a>
                <button onClick={openForm} style={secBtn}>Dejar mis datos</button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </NokiChrome>
  )
}
