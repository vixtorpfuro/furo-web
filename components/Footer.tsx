'use client'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleSubscribe() {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('ok')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer style={{ backgroundColor: '#141210', color: '#f5f3ee' }}>

      {/* ── NEWSLETTER ──────────────────────────────────── */}
      <div style={{ padding: '72px 56px 64px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 80px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(255, 255, 255)', marginBottom: 16 }}>
              Novedades
            </p>
            <p style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 300, lineHeight: 1.2, color: '#f5f3ee', marginBottom: 16 }}>
              Mantente al día con FURŌ
            </p>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.75, color: 'rgb(255, 255, 255)', maxWidth: 420 }}>
              Recibe catálogos, detalles constructivos, proyectos recientes y novedades sobre construcción en madera laminada. Sin ruido, solo lo que importa.
            </p>
          </div>
          <div>
            {status === 'ok' ? (
              <p style={{ fontSize: 14, fontWeight: 300, color: 'rgb(255, 255, 255)' }}>
                ¡Listo! Te avisamos cuando haya novedades.
              </p>
            ) : (
              <>
                <div style={{ position: 'relative', borderBottom: '1px solid rgb(255, 255, 255)', paddingBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontSize: 15,
                      fontWeight: 300,
                      color: '#ffffff',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={status === 'loading'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: status === 'loading' ? 'rgba(255,255,255,0.2)' : '#f5f3ee',
                      fontSize: 20,
                      lineHeight: 1,
                      flexShrink: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    →
                  </button>
                </div>
                {status === 'error' && (
                  <p style={{ fontSize: 11, color: 'rgba(255,100,100,0.7)', marginTop: 8, fontWeight: 300 }}>
                    Algo salió mal. Intenta nuevamente.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── LINKS ───────────────────────────────────────── */}
      <div style={{ padding: '64px 56px 48px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <img
            src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png"
            alt="FURŌ"
            style={{ height: 30, filter: 'brightness(0) invert(1)', opacity: 0.9, marginBottom: 12, display: 'block' }}
          />
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgb(255, 255, 255)' }}>es fluir en la construcción</p>
        </div>

        <div>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(255, 255, 255)', display: 'block', marginBottom: 18 }}>
            FURŌ
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Nosotros',  href: '/nosotros' },
              { label: 'Blog',      href: '/blog' },
              { label: 'Noki',      href: '/noki' },
            ].map(({ label, href }) => (
              <li key={label} style={{ marginBottom: 10 }}>
                <a href={href} style={{ fontSize: 14, fontWeight: 300, color: 'rgb(255, 255, 255)', textDecoration: 'none' }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(255, 255, 255)', display: 'block', marginBottom: 18 }}>
            Conecta
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
              { label: 'Instagram',            href: 'https://instagram.com/furo.company' },
              { label: 'LinkedIn',             href: 'https://www.linkedin.com/company/furōcompany/' },
            ].map(({ label, href }) => (
              <li key={label} style={{ marginBottom: 10 }}>
                <a href={href} style={{ fontSize: 14, fontWeight: 300, color: 'rgb(255, 255, 255)', textDecoration: 'none' }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(255, 255, 255)', display: 'block', marginBottom: 18 }}>
            Contacto
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Comienza tu proyecto',      href: '/contacto' },
              { label: 'contacto@furo.company',     href: 'mailto:contacto@furo.company' },
              { label: 'WhatsApp',                  href: 'https://wa.me/56977441963' },
            ].map(({ label, href }) => (
              <li key={label} style={{ marginBottom: 10 }}>
                <a href={href} style={{ fontSize: 14, fontWeight: 300, color: 'rgb(255, 255, 255)', textDecoration: 'none' }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── COPYRIGHT ───────────────────────────────────── */}
      <div style={{ padding: '22px 56px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgb(255, 255, 255)', margin: 0 }}>
          © {new Date().getFullYear()} FURŌ — Todos los derechos reservados
        </p>
      </div>

    </footer>
  )
}