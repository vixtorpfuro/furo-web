'use client'
import { createContext, useContext, useRef, useState, useEffect } from 'react'
import Link from 'next/link'

export const WEBHOOK = 'https://hook.eu2.make.com/jcti1vtgp2roletlg03vf2jm9leiqkhq'

export const C = { dark: '#1a1714', mid: '#5e5850', muted: '#8a8278', red: '#e05c4b', white: '#ffffff', border: 'rgba(26,23,20,0.08)' }
export const serif = "'Cormorant Garamond', Georgia, serif"

export const ctaBtn: React.CSSProperties = {
  display: 'inline-block', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
  color: '#fff', background: C.red, padding: '13px 28px', border: 'none',
  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: 10,
}
export const secBtn: React.CSSProperties = {
  display: 'inline-block', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
  color: C.dark, background: '#eeebe4', padding: '13px 28px', border: 'none',
  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: 10,
}
export const inp: React.CSSProperties = { width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 300, color: C.dark, fontFamily: "'DM Sans', sans-serif", border: 'none', borderBottom: `1px solid ${C.border}`, background: 'transparent', outline: 'none' }
export const sel: React.CSSProperties = { ...inp, cursor: 'pointer', appearance: 'none' as any, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', paddingRight: 28 }

export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

export function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)`, ...style }}>
      {children}
    </div>
  )
}

const NokiFormContext = createContext<() => void>(() => {})
export function useNokiForm() {
  return useContext(NokiFormContext)
}

const MENU = [
  { label: 'Modelos', href: '/noki/modelos' },
  { label: 'Como Trabajamos', href: '/noki/como-trabajamos' },
  { label: 'Proyectos', href: '/noki/proyectos' },
  { label: 'Sobre Noki', href: '/noki/sobre-noki' },
]

export function GlobalNokiStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      a { text-decoration: none; color: inherit; }
      input::placeholder, textarea::placeholder { color: #bbb8b2; }
      select option { color: #1a1714; background: #fff; }

      .noki-gal { display: flex; overflow-x: auto; scrollbar-width: none; gap: 3px; cursor: grab; }
      .noki-gal::-webkit-scrollbar { display: none; }
      .noki-gal img { height: 55vh; width: auto; flex-shrink: 0; display: block; object-fit: cover; border-radius: 8px; }

      .form-panel { position: fixed; top: 0; right: 0; bottom: 0; width: min(460px, 100vw); max-width: 100vw; background: #fff; z-index: 200; transform: translateX(100%); transition: transform 0.45s cubic-bezier(0.16,1,0.3,1); overflow-y: auto; overflow-x: hidden; }
      .form-panel.open { transform: translateX(0); box-shadow: -8px 0 48px rgba(0,0,0,0.15); }
      .form-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.4); z-index: 199; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
      .form-overlay.open { opacity: 1; pointer-events: all; }

      .why-section { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }
      .why-items { border-right: 1px solid rgba(26,23,20,0.08); }
      .why-btn { width: 100%; text-align: left; padding: 36px 48px; background: none; border: none; border-bottom: 1px solid rgba(26,23,20,0.08); cursor: pointer; display: block; }
      .why-btn:last-child { border-bottom: none; }
      .why-img-wrap { position: relative; overflow: hidden; background: #e0ddd8; }
      .why-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s ease; }

      .benefit-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
      .benefit-card { background: #fff; border-right: 1px solid rgba(255,255,255,0.08); padding: 48px 40px; }

      .bene-grid { display: grid; grid-template-columns: repeat(3,1fr); }
      .bene-item { padding: 40px 40px; border-right: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); }
      .bene-item:nth-child(3n) { border-right: none; }

      .faq-cat-row { display: grid; grid-template-columns: 280px 1fr; border-top: 1px solid rgba(255,255,255,0.08); }
      .faq-cat-btn { display: flex; align-items: flex-start; gap: 20px; padding: 28px 48px; background: none; border: none; cursor: pointer; text-align: left; width: 100%; border-right: 1px solid rgba(255,255,255,0.08); }
      .faq-questions { padding: 0 48px; }
      .faq-q-row { border-bottom: 1px solid rgba(255,255,255,0.06); }
      .faq-q-btn { width: 100%; display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 0; background: none; border: none; cursor: pointer; text-align: left; gap: 24px; }

      .plantas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }

      .nombre-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }

      .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.8s ease; }

      .noki-nav-pill { display: flex; }
      .noki-nav-hamburger { display: none; }
      .noki-nav-mobile { display: flex; }
      @media (min-width: 901px) {
        .noki-nav-mobile { display: none !important; }
      }

      @media (max-width: 900px) {
        .form-panel { width: 100%; }
        .why-section { grid-template-columns: 1fr; }
        .why-img-wrap { min-height: 300px; position: relative; }
        .why-img-wrap img { position: absolute; }
        .bene-grid { grid-template-columns: 1fr; }
        .faq-cat-row { grid-template-columns: 1fr; }
        .faq-cat-btn { padding: 22px 24px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .faq-questions { padding: 0 24px; }
        .why-btn { padding: 28px 32px; }
        .noki-gal img { height: 42vh; }
        .nombre-row { grid-template-columns: 1fr; }
        .benefit-cards { grid-template-columns: 1fr 1fr; }
        .benefit-card { padding: 36px 24px; }
        .plantas-grid { grid-template-columns: 1fr; }
        .noki-nav-pill { display: none !important; }
        .noki-nav-hamburger { display: flex !important; }
      }
    `}</style>
  )
}

function InterestedForm({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', celular: '', perfil: '', donde: '', terreno: '', plazo: '', como_contactar: '' })
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.nombre || !form.apellido || !form.email) { setStatus('error'); return }
    setStatus('sending')
    try {
      const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tipo: 'waitlist_noki', fecha: new Date().toLocaleString('es-CL'), origen: 'noki', mailchimp: true }) })
      setStatus(res.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <>
      <div className={`form-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`form-panel${open ? ' open' : ''}`}>
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>Estoy interesado</p>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: C.muted, lineHeight: 1, fontWeight: 300 }}>×</button>
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: 20 }}>Asegura tu precio de lanzamiento.</h2>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>Valor desde</p>
            <p style={{ fontFamily: serif, fontSize: 38, fontWeight: 400, color: C.dark, lineHeight: 1 }}>desde 6.000 UF</p>
          </div>
          <p style={{ fontSize: 13, fontWeight: 300, color: C.mid, lineHeight: 1.75, marginBottom: 40, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
            Te enviaremos un link para una reunión de 20 minutos. Para calcular el precio final necesitamos conocer la ubicación y características de tu terreno.
          </p>

          <div className="nombre-row" style={{ marginBottom: 28 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Nombre *</label>
              <input style={inp} type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Apellido *</label>
              <input style={inp} type="text" placeholder="Tu apellido" value={form.apellido} onChange={e => set('apellido', e.target.value)} />
            </div>
          </div>

          {[
            { k: 'email', l: 'Email *', p: 'correo@email.com', t: 'email' },
            { k: 'celular', l: 'Celular', p: '+56 9 XXXX XXXX', t: 'text' },
            { k: 'donde', l: '¿Dónde quieres construir?', p: 'Región o lugar', t: 'text' },
          ].map(({ k, l, p, t }) => (
            <div key={k} style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{l}</label>
              <input style={inp} type={t} placeholder={p} value={(form as any)[k]} onChange={e => set(k, e.target.value)} />
            </div>
          ))}

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Perfil</label>
            <select style={sel} value={form.perfil} onChange={e => set('perfil', e.target.value)}>
              <option value="">Selecciona</option>
              <option value="owner">Owner / Propietario</option>
              <option value="developer">Developer / Inmobiliaria</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>¿Tienes terreno?</label>
            <select style={sel} value={form.terreno} onChange={e => set('terreno', e.target.value)}>
              <option value="">Selecciona</option>
              <option value="Sí">Sí</option>
              <option value="Estoy buscando">Estoy buscando</option>
              <option value="No pero me interesa">No pero me interesa</option>
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>¿En cuánto tiempo piensas construir?</label>
            <select style={sel} value={form.plazo} onChange={e => set('plazo', e.target.value)}>
              <option value="">Selecciona</option>
              <option value="Próximos 3 meses">Próximos 3 meses</option>
              <option value="6 a 12 meses">6 a 12 meses</option>
              <option value="1 año o más">1 año o más</option>
            </select>
          </div>

          <div style={{ marginBottom: 36 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>¿Cómo quieres que te contactemos?</label>
            <select style={sel} value={form.como_contactar} onChange={e => set('como_contactar', e.target.value)}>
              <option value="">Selecciona</option>
              <option value="Mail">Mail</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Teléfono">Teléfono</option>
            </select>
          </div>

          {status === 'ok' && <p style={{ fontSize: 13, color: '#2c4a3d', borderTop: '2px solid #2c4a3d', paddingTop: 14, marginBottom: 16 }}>✓ Mensaje enviado. Te contactamos pronto.</p>}
          {status === 'error' && <p style={{ fontSize: 13, color: C.red, borderTop: `2px solid ${C.red}`, paddingTop: 14, marginBottom: 16 }}>Por favor ingresa nombre, apellido y email.</p>}
          <button onClick={submit} disabled={status === 'sending' || status === 'ok'} style={{ ...ctaBtn, width: '100%', padding: '16px', fontSize: 14, background: status === 'ok' ? '#2c4a3d' : C.red }}>
            {status === 'sending' ? 'Enviando...' : status === 'ok' ? '✓ Mensaje enviado' : 'Únete a la lista de espera →'}
          </button>
        </div>
      </div>
    </>
  )
}

function NokiNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState('')
  const openForm = useNokiForm()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '18px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/noki">
          <img src="/noki/logo_noki_negro.png" alt="Noki" style={{ height: scrolled ? 40 : 60, transition: 'height 0.3s ease', display: 'block' }} />
        </Link>

        <div className="noki-nav-pill" onMouseLeave={() => setHovered('')} style={{ alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.97)', borderRadius: 10, padding: '0 6px', height: 54, boxShadow: '0 2px 16px rgba(0,0,0,0.1)' }}>
          {MENU.map(item => (
            <Link key={item.href} href={item.href} onMouseEnter={() => setHovered(item.href)}
              style={{ color: hovered && hovered !== item.href ? '#bbb' : C.dark, fontSize: 13, fontWeight: 500, padding: '0 14px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
              {item.label}
            </Link>
          ))}
          <button onClick={openForm} style={{ ...secBtn, padding: '10px 18px', fontSize: 13, marginLeft: 4, borderRadius: 8 }}>Estoy interesado</button>
        </div>

        <button className="noki-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.97)', border: 'none', borderRadius: 10, width: 48, height: 48, cursor: 'pointer', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', flexShrink: 0 }}
          aria-label="Menú">
          <span style={{ display: 'block', width: 20, height: 1.5, background: C.dark, transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: C.dark, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: C.dark, transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </nav>

      <div className="noki-nav-mobile" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(26,23,20,0.97)', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'all' : 'none', transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1)', overflowX: 'hidden' }}>
        {MENU.map((item, i) => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
            style={{ fontSize: 26, fontWeight: 300, color: '#f5f3ee', padding: '12px 24px', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.4s ${i * 0.06}s, transform 0.4s ${i * 0.06}s cubic-bezier(0.16,1,0.3,1)` }}>
            {item.label}
          </Link>
        ))}
        <button onClick={() => { setMenuOpen(false); openForm() }}
          style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.dark, background: '#eeebe4', border: 'none', padding: '14px 36px', marginTop: 16, borderRadius: 8, cursor: 'pointer', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.4s ${MENU.length * 0.06}s, transform 0.4s ${MENU.length * 0.06}s cubic-bezier(0.16,1,0.3,1)` }}>
          Estoy interesado
        </button>
      </div>
    </>
  )
}

export function NokiFooter() {
  return (
    <footer style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '64px 48px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 24 }}>Noki by FURŌ</p>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 24 }}>Contacto</p>
          <a href="mailto:contacto@furo.company" style={{ fontSize: 15, color: C.mid, fontWeight: 300, display: 'block', marginBottom: 12 }}>contacto@furo.company</a>
          <a href="https://wa.me/56981813436" style={{ fontSize: 15, color: C.mid, fontWeight: 300, display: 'block' }}>WhatsApp</a>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 24 }}>Síguenos</p>
          <a href="https://instagram.com/furo.company" style={{ fontSize: 15, color: C.mid, fontWeight: 300, display: 'block', marginBottom: 12 }}>Instagram</a>
          <Link href="/" style={{ fontSize: 15, color: C.mid, fontWeight: 300, display: 'block' }}>furo.company</Link>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/noki/logo_noki_negro.png" alt="Noki" style={{ height: 14, opacity: 0.2, display: 'block' }} />
        <p style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}>© {new Date().getFullYear()} Noki by FURŌ</p>
      </div>
    </footer>
  )
}

export default function NokiChrome({ children, showFooter = true }: { children: React.ReactNode, showFooter?: boolean }) {
  const [formOpen, setFormOpen] = useState(false)
  const openForm = () => setFormOpen(true)

  return (
    <NokiFormContext.Provider value={openForm}>
      <main style={{ backgroundColor: C.white, color: C.dark, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
        <GlobalNokiStyles />
        <InterestedForm open={formOpen} onClose={() => setFormOpen(false)} />
        <NokiNav />
        {children}
        {showFooter && <NokiFooter />}
      </main>
    </NokiFormContext.Provider>
  )
}
