// app/noki/page.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const WEBHOOK = 'https://hook.eu2.make.com/jcti1vtgp2roletlg03vf2jm9leiqkhq'

function useInView(threshold = 0.1) {
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

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)`, ...style }}>
      {children}
    </div>
  )
}

const WHY_ITEMS = [
  { img: 'P1010593.jpg', t: 'Montaje rápido, proceso transparente', d: 'Los paneles estructurales térmicosentes llegan prefabricados desde nuestra planta. La estructura se monta en 4 a 8 semanas. Presupuesto claro, plazo predecible.', sub: 'Ensamblaje preciso. Sin imprevistos.' },
  { img: 'P1010591.jpg', t: 'Materiales naturales para todo clima', d: 'Estructura CLT/GLT, envolvente 160mm con lana de oveja. Eficiente en la costa y en el frío del sur. Interior en madera laminada vista.', sub: 'Una casa que se siente diferente.' },
  { img: 'P1010657.jpg', t: 'Una casa que se adapta contigo', d: 'Elige terminaciones y materiales sin alterar la estructura. Precio a suma alzada desde el primer día. Tu Noki, con tu impronta.', sub: 'Personalizable dentro del sistema.' },
]

const FAQS: { cat: string, items: { q: string, r: string }[] }[] = [
  { cat: 'General', items: [
    { q: '¿Qué es Noki?', r: 'Noki es una casa prefabricada en madera laminada (CLT/GLT) diseñada por FURŌ para adaptarse a cualquier geografía chilena. Se produce en nuestra planta en Santiago y se monta en tu terreno en semanas.' },
    { q: '¿Puedo construir en cualquier lugar?', r: 'Sí. Playa, campo, sur, precordillera o patagonia. Solo necesitas un terreno con acceso básico.' },
    { q: '¿Cuánto tarda el proceso completo?', r: 'Entre 6 y 12 meses desde la reserva hasta las llaves, dependiendo de los permisos del terreno.' },
  ]},
  { cat: 'Precios', items: [
    { q: '¿Cuál es el precio?', r: 'El precio de lanzamiento parte desde 3.200 UF para las primeras 5 unidades. Únete a la lista de espera para asegurar tu tramo.' },
    { q: '¿Qué incluye el precio?', r: 'Estructura CLT/GLT, envolvente 160mm con lana de oveja, cubierta de zinc, ventanas y montaje.' },
    { q: '¿Qué no incluye?', r: 'Terreno, permisos municipales, instalaciones de servicios y terminaciones adicionales fuera del paquete base.' },
  ]},
]

export default function Noki() {
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', celular: '', perfil: '', donde: '' })
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const [openFaq, setOpenFaq] = useState<string|null>(null)
  const [modeloActivo, setModeloActivo] = useState<'A'|'B'>('A')
  const [whyActive, setWhyActive] = useState(0)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.nombre || !form.email) { setStatus('error'); return }
    setStatus('sending')
    try {
      const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tipo: 'waitlist_noki', fecha: new Date().toLocaleString('es-CL'), origen: 'noki', mailchimp: true }) })
      setStatus(res.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  const C = { dark: '#1a1714', mid: '#5e5850', muted: '#8a8278', green: '#2c4a3d', cream: '#f7f5f0', border: 'rgba(26,23,20,0.08)' }
  const inp: React.CSSProperties = { width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 300, color: C.dark, fontFamily: "'DM Sans', sans-serif", border: 'none', borderBottom: `1px solid ${C.border}`, background: 'transparent', outline: 'none' }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer', appearance: 'none' as any, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', paddingRight: 28 }

  const serif = "'Playfair Display', Georgia, serif"

  return (
    <main style={{ backgroundColor: C.cream, color: C.dark, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }
        input::placeholder, textarea::placeholder { color: #bbb8b2; }
        select option { color: #1a1714; background: #fff; }

        .noki-gal { display: flex; overflow-x: auto; scrollbar-width: none; gap: 3px; cursor: grab; }
        .noki-gal::-webkit-scrollbar { display: none; }
        .noki-gal img { height: 58vh; width: auto; flex-shrink: 0; display: block; object-fit: cover; }

        .form-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 460px; background: #fff; z-index: 200; transform: translateX(100%); transition: transform 0.45s cubic-bezier(0.16,1,0.3,1); overflow-y: auto; }
        .form-panel.open { transform: translateX(0); box-shadow: -8px 0 48px rgba(0,0,0,0.15); }
        .form-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.4); z-index: 199; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
        .form-overlay.open { opacity: 1; pointer-events: all; }

        .why-section { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }
        .why-items { border-right: 1px solid rgba(26,23,20,0.08); }
        .why-btn { width: 100%; text-align: left; padding: 36px 48px; background: none; border: none; border-bottom: 1px solid rgba(26,23,20,0.08); cursor: pointer; display: block; }
        .why-btn:last-child { border-bottom: none; }
        .why-img-wrap { position: relative; overflow: hidden; background: #e0ddd8; }
        .why-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s ease; }

        .bene-grid { display: grid; grid-template-columns: repeat(3,1fr); }
        .bene-item { padding: 40px 40px; border-right: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .bene-item:nth-child(3n) { border-right: none; }

        .faq-row { display: grid; grid-template-columns: 200px 1fr; }
        .faq-cat-label { padding: 28px 48px 28px 48px; font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,243,238,0.3); }
        .faq-items { border-left: 1px solid rgba(255,255,255,0.06); padding: 0 48px; }

        @media (max-width: 900px) {
          .form-panel { width: 100%; }
          .why-section { grid-template-columns: 1fr; }
          .why-img-wrap { min-height: 300px; position: relative; }
          .why-img-wrap img { position: absolute; }
          .bene-grid { grid-template-columns: 1fr; }
          .faq-row { grid-template-columns: 1fr; }
          .faq-items { border-left: none; padding: 0 32px; }
          .faq-cat-label { padding: 20px 32px; }
          .why-btn { padding: 28px 32px; }
          .noki-gal img { height: 42vh; }
        }
      `}</style>

      {/* FORM OVERLAY + PANEL */}
      <div className={`form-overlay${formOpen ? ' open' : ''}`} onClick={() => setFormOpen(false)} />
      <div className={`form-panel${formOpen ? ' open' : ''}`}>
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>Lista de espera</p>
            <button onClick={() => setFormOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: C.muted, lineHeight: 1, fontWeight: 300 }}>×</button>
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: 12 }}>Asegura tu precio de lanzamiento.</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: C.mid, lineHeight: 1.7, marginBottom: 6 }}>Las primeras <strong style={{ fontWeight: 500 }}>5 unidades</strong> desde <strong style={{ fontWeight: 500 }}>3.200 UF</strong>.</p>
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 40 }}>Sin compromiso de pago. Te contactamos en 48 horas.</p>
          {[
            { k: 'nombre', l: 'Nombre *', p: 'Tu nombre completo', t: 'text' },
            { k: 'email', l: 'Email *', p: 'correo@email.com', t: 'email' },
            { k: 'celular', l: 'Celular', p: '+56 9 XXXX XXXX', t: 'text' },
            { k: 'donde', l: '¿Dónde quieres construir?', p: 'Región o lugar', t: 'text' },
          ].map(({ k, l, p, t }) => (
            <div key={k} style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{l}</label>
              <input style={inp} type={t} placeholder={p} value={(form as any)[k]} onChange={e => set(k, e.target.value)} />
            </div>
          ))}
          <div style={{ marginBottom: 36 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Perfil</label>
            <select style={sel} value={form.perfil} onChange={e => set('perfil', e.target.value)}>
              <option value="">Selecciona</option>
              <option value="owner">Owner / Propietario</option>
              <option value="developer">Developer / Inmobiliaria</option>
              <option value="arquitecto">Arquitecto / Constructor</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          {status === 'ok' && <p style={{ fontSize: 13, color: C.green, borderTop: `2px solid ${C.green}`, paddingTop: 14, marginBottom: 16 }}>✓ Estás en la lista. Te contactamos pronto.</p>}
          {status === 'error' && <p style={{ fontSize: 13, color: '#c0392b', borderTop: '2px solid #e05252', paddingTop: 14, marginBottom: 16 }}>Por favor ingresa nombre y email.</p>}
          <button onClick={submit} disabled={status === 'sending' || status === 'ok'} style={{ width: '100%', background: status === 'ok' ? C.green : C.dark, color: '#fff', border: 'none', padding: '18px', fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
            {status === 'sending' ? 'Enviando...' : status === 'ok' ? '✓ En lista' : 'Unirme a la lista →'}
          </button>
        </div>
      </div>

      {/* NAV — transparente sobre hero */}
<nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Link href="/"><img src="/noki/logo_noki_negro.png" alt="Noki" style={{ height: 84 }} /></Link>
  <button onClick={() => setFormOpen(true)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', background: '#1a1714', padding: '12px 24px', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: 2 }}>
    Lista de espera
  </button>
</nav>
      {/* HERO — foto full screen, headline abajo izq */}
      <section style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
        <img src="/noki/noki1_hero.jpg" alt="Noki" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />
<div style={{ position: 'absolute', bottom: 48, left: 48 }}>
  <p style={{ fontSize: 'clamp(13px,1.2vw,40px)', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(255, 255, 255)', marginBottom: 1 }}>Casas Noki</p>
  <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(36px,5vw,62px)', fontWeight: 400, lineHeight: 1.05, color: '#fff', maxWidth: '14ch' }}>
    Una nueva forma de diseñar y construir.
  </h1>
</div>
      </section>

      {/* WHAT WE DO */}
      <section style={{ padding: '80px 48px 0', background: C.cream }}>
        <FadeUp>
          <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, marginBottom: 24, textAlign: 'center' }}>Lo que hacemos</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px,4.5vw,40px)', fontWeight: 300, lineHeight: 1.1, color: C.dark, maxWidth: 700, margin: '0 auto 20px', textAlign: 'center' }}>
            Combinamos paneles estructurales FURŌ con diseño modular y construcción industrializada para que puedas sacar el máximo potencial de tu espacio. <em>en cualquier entorno.</em>
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: C.mid, maxWidth: 420, margin: '0 auto 48px', lineHeight: 1.8, textAlign: 'center' }}>
            Prefabricadas en Santiago y montadas en tu terreno en semanas. Para la playa, el campo, el sur o la patagonia.
          </p>
        </FadeUp>
      </section>

      {/* MODELOS — imagen con radius + tabs + specs + plano */}
      <section style={{ padding: '0 20px 0', background: C.cream }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <img src={`/noki/${modeloActivo === 'A' ? 'P1010657' : 'P1010640'}.jpg`} alt="Noki modelo" style={{ width: '100%', height: '65vh', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }} />
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
            {(['A','B'] as const).map(m => (
              <button key={m} onClick={() => setModeloActivo(m)} style={{ padding: '9px 22px', background: modeloActivo === m ? 'rgba(26,23,20,0.88)' : 'rgba(247,245,240,0.75)', color: modeloActivo === m ? '#fff' : C.dark, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", borderRadius: 4, backdropFilter: 'blur(10px)', fontWeight: 400 }}>
                Tipo {m}
              </button>
            ))}
          </div>
        </div>

        {/* Texto + specs + plano */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 56px', padding: '36px 28px 56px', alignItems: 'start' }}>
          <div>
            <h3 style={{ fontFamily: serif, fontSize: 'clamp(24px,2.5vw,38px)', fontWeight: 400, color: C.dark, marginBottom: 10, lineHeight: 1.15 }}>
              {modeloActivo === 'A' ? 'Tu base, sin importar la montaña.' : 'Más compacta, igual de completa.'}
            </h3>
            <p style={{ fontSize: 14, fontWeight: 300, color: C.mid, lineHeight: 1.75, marginBottom: 28 }}>
              {modeloActivo === 'A' ? '3 dormitorios, 3 baños, 133 m² totales. Diseñada para ir a cualquier lugar.' : '3 dormitorios, 2 baños, 98 m² totales. Todo lo esencial, formato compacto.'}
            </p>
            {[
              { l: 'Área útil', v: modeloActivo === 'A' ? '112 m²' : '94 m²' },
              { l: 'Terraza', v: modeloActivo === 'A' ? '21 m²' : '4 m²' },
              { l: 'Área total', v: modeloActivo === 'A' ? '133 m²' : '98 m²' },
              { l: 'Dormitorios / Baños', v: modeloActivo === 'A' ? '3D / 3B' : '3D / 2B' },
              { l: 'Precio desde', v: modeloActivo === 'A' ? '3.500 UF' : '3.200 UF' },
            ].map(({ l, v }) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, fontWeight: 400 }}>{l}</span>
                <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: C.dark }}>{v}</span>
              </div>
            ))}
            <button onClick={() => setFormOpen(true)} style={{ marginTop: 28, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: C.green, padding: '13px 26px', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Reservar Tipo {modeloActivo} →
            </button>
          </div>

          {/* Plano */}
          <div style={{ background: '#eae7e0', borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <img src={`/noki/tipo${modeloActivo}.avif`} alt={`Planta Tipo ${modeloActivo}`} style={{ width: '100%', display: 'block', objectFit: 'contain', padding: 16 }} />
          </div>
        </div>

        {/* Separador CTA */}
        <div style={{ padding: '24px 28px 56px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
          <h3 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.5vw,36px)', fontWeight: 400, color: C.dark, marginBottom: 20 }}>
            Dos modelos. Precio de lanzamiento desde 3.200 UF.
          </h3>
          <button onClick={() => setFormOpen(true)} style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: C.dark, padding: '14px 32px', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Unirse a la lista →
          </button>
        </div>
      </section>

      {/* WHY NOKI — acordeón izq, imagen derecha */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.border}` }}>
        <div style={{ padding: '64px 48px 32px', textAlign: 'center' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, marginBottom: 20 }}>Por qué Noki</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(30px,4vw,54px)', fontWeight: 400, lineHeight: 1.1, color: C.dark, maxWidth: 640, margin: '0 auto' }}>
              Construida mejor y entregada más rápido, para una <em>escape</em> sin sorpresas.
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, color: C.mid, maxWidth: 480, margin: '16px auto 0', lineHeight: 1.75 }}>
              Prefabricadas con materiales naturales de alto desempeño, diseño minimalista y precio transparente.
            </p>
          </FadeUp>
        </div>

        <div className="why-section" style={{ marginTop: 40 }}>
          <div className="why-items">
            {WHY_ITEMS.map((item, i) => (
              <button key={i} className="why-btn" onClick={() => setWhyActive(i)}>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(20px,2vw,28px)', fontWeight: 400, color: whyActive === i ? C.dark : C.muted, lineHeight: 1.25, marginBottom: whyActive === i ? 14 : 0, transition: 'color 0.3s, margin 0.4s' }}>
                  {item.t}
                </h3>
                <div style={{ maxHeight: whyActive === i ? 180 : 0, overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
                  <p style={{ fontSize: 14, fontWeight: 300, color: C.mid, lineHeight: 1.8, marginBottom: 10 }}>{item.d}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>+ {item.sub}</p>
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
      </section>

      {/* FOTO INTERIOR FULL WIDTH */}
      <section>
        <div style={{ position: 'relative' }}>
          <img src="/noki/5-1.avif" alt="Interior Noki" style={{ width: '100%', display: 'block', height: '68vh', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, display: 'flex', alignItems: 'center', padding: '0 56px' }}>
            <h3 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,54px)', fontWeight: 400, color: '#fff', lineHeight: 1.1, maxWidth: '12ch' }}>
              Tu espacio, tu historia.
            </h3>
          </div>
        </div>
      </section>

      {/* BENEFICIOS fondo oscuro */}
      <section style={{ background: C.dark }}>
        <div style={{ padding: '64px 48px 40px', textAlign: 'center' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,243,238,0.3)', marginBottom: 20 }}>Beneficios</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,3.5vw,50px)', fontWeight: 400, lineHeight: 1.1, color: '#f5f3ee', maxWidth: 520, margin: '0 auto' }}>
              Menos preocupaciones. Más tiempo para <em>vivir.</em>
            </h2>
          </FadeUp>
        </div>
        <div className="bene-grid" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { n:'01', t:'Va a cualquier lugar', d:'Transportada en camión. Montada en cualquier geografía chilena.' },
            { n:'02', t:'Precio transparente', d:'Suma alzada. Sin adicionales. Sabes lo que pagas desde el día uno.' },
            { n:'03', t:'Aislación real', d:'160mm de lana de oveja. Eficiente en la costa y en el sur.' },
            { n:'04', t:'CLT y GLT', d:'Más resistente y liviana que el hormigón. Interior visto que se siente diferente.' },
            { n:'05', t:'Montaje en semanas', d:'Estructura prefabricada. 4 a 8 semanas en tu terreno.' },
            { n:'06', t:'Personalizable', d:'Terminaciones a tu gusto. Sin afectar estructura ni precio.' },
          ].map(({ n, t, d }) => (
            <div key={n} className="bene-item">
              <p style={{ fontSize: 11, color: 'rgba(245,243,238,0.18)', letterSpacing: '0.12em', marginBottom: 18 }}>{n}</p>
              <h3 style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: '#f5f3ee', marginBottom: 10, lineHeight: 1.3 }}>{t}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(245,243,238,0.45)', lineHeight: 1.8 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALERÍA FOTOS REALES */}
      <section>
        <div className="noki-gal">
          {['P1010657.jpg','P1010640.jpg','P1010586.jpg','P1010591.jpg','P1010593.jpg','P1010594.jpg','P1010632.jpg'].map((img,i) => (
            <img key={i} src={`/noki/${img}`} alt={`Noki ${i+1}`} />
          ))}
        </div>
        <div style={{ padding: '14px 48px', background: C.cream, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, fontWeight: 300, color: C.muted }}>Fotos reales — primeras 8 casas Noki en construcción.</p>
        </div>
      </section>

      {/* FAQ fondo oscuro — estilo Base con categorías */}
      <section style={{ background: C.dark, padding: '56px 0' }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,243,238,0.25)', padding: '0 48px', marginBottom: 40 }}>FAQ</p>
        {FAQS.map(grupo => (
          <div key={grupo.cat} className="faq-row" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="faq-cat-label">— {grupo.cat}</div>
            <div className="faq-items">
              {grupo.items.map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => setOpenFaq(openFaq === `${grupo.cat}-${i}` ? null : `${grupo.cat}-${i}`)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 24 }}>
                    <span style={{ fontSize: 15, fontWeight: 300, color: 'rgba(245,243,238,0.7)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{ fontSize: 20, color: 'rgba(245,243,238,0.3)', flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === `${grupo.cat}-${i}` ? 'rotate(45deg)' : 'none', display: 'block', lineHeight: 1.2 }}>+</span>
                  </button>
                  <div style={{ maxHeight: openFaq === `${grupo.cat}-${i}` ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
                    <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(245,243,238,0.4)', lineHeight: 1.85, paddingBottom: 22 }}>{item.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ABOUT — foto izq, texto der */}
      <section style={{ background: C.cream, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '64vh' }}>
          <div style={{ overflow: 'hidden', background: '#dedad4' }}>
            <img src="/noki/P1010640.jpg" alt="Noki exterior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '64px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FadeUp>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 32 }}>Sobre Noki</p>
              <p style={{ fontSize: 15, fontWeight: 300, color: C.mid, lineHeight: 1.9, marginBottom: 20 }}>
                En <strong style={{ fontWeight: 500, color: C.dark }}>FURŌ</strong> llevamos años perfeccionando la construcción con madera laminada en Chile. Aprendimos que la mayor barrera para una casa de calidad no era el costo — era la incertidumbre.
              </p>
              <p style={{ fontSize: 15, fontWeight: 300, color: C.mid, lineHeight: 1.9, marginBottom: 20 }}>
                Noki nació de una convicción simple: se puede construir mejor para vivir mejor. Un producto diseñado desde la raíz para ser prefabricado con precisión, transportado a cualquier lugar y montado en semanas.
              </p>
              <p style={{ fontSize: 15, fontWeight: 300, color: C.mid, lineHeight: 1.9, marginBottom: 36 }}>
                Porque creemos en la madera como material del futuro. En casas que se adaptan al paisaje, no al revés.
              </p>
              <p style={{ fontFamily: serif, fontSize: 17, fontWeight: 400, color: C.dark }}>Encuentra tu Noki.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '88px 48px', background: C.green, textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/noki/logo_noki_blanco.png" alt="Noki" style={{ height: 28, marginBottom: 28, display: 'block' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px,3.5vw,50px)', fontWeight: 400, lineHeight: 1.1, color: '#fff', marginBottom: 16, maxWidth: '18ch' }}>
            Las primeras 5 unidades tienen precio especial.
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>Sin compromiso de pago. Únete y asegura tu lugar.</p>
          <button onClick={() => setFormOpen(true)} style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.green, background: '#fff', padding: '15px 40px', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Unirme a la lista →
          </button>
        </FadeUp>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.dark, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <img src="/noki/logo_noki_blanco.png" alt="Noki" style={{ height: 16, opacity: 0.35, display: 'block', marginBottom: 6 }} />
          <p style={{ fontSize: 11, color: 'rgba(245,243,238,0.18)', fontWeight: 300 }}>© {new Date().getFullYear()} Noki by FURŌ</p>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <Link href="/" style={{ fontSize: 12, color: 'rgba(245,243,238,0.28)', fontWeight: 300 }}>FURŌ</Link>
          <a href="mailto:contacto@furo.company" style={{ fontSize: 12, color: 'rgba(245,243,238,0.28)', fontWeight: 300 }}>contacto@furo.company</a>
          <a href="https://wa.me/56977441963" style={{ fontSize: 12, color: 'rgba(245,243,238,0.28)', fontWeight: 300 }}>WhatsApp</a>
        </div>
      </footer>
    </main>
  )
}