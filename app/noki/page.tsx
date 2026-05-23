// app/noki/page.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const WEBHOOK = 'https://hook.eu2.make.com/jcti1vtgp2roletlg03vf2jm9leiqkhq'

const HERO_IMAGES = ['noki1_hero.jpg', 'noki1_hero2.jpg', 'noki1_hero3.jpg', 'noki1_hero4.jpg']

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
  { img: 'P1010593.jpg', t: 'Montaje rápido, proceso transparente', d: 'Los paneles estructurales térmicos FURŌ llegan prefabricados desde nuestra planta. La estructura se monta en 4 a 8 meses. Presupuesto claro, plazo predecible.', sub: 'Ensamblaje preciso. Sin imprevistos.' },
  { img: 'P1010591.jpg', t: 'Materiales naturales para todo clima', d: 'Paneles Estructurales Térmicos FURŌ, envolvente 160mm con lana de oveja. Eficiente en la costa y en el frío del sur. Interior en madera laminada vista.', sub: 'Una casa que se siente diferente.' },
  { img: 'P1010657.jpg', t: 'Una casa que se adapta contigo', d: 'Elige terminaciones y materiales sin alterar la estructura. Precio a suma alzada desde el primer día. Tu Noki, con tu impronta.', sub: 'Personalizable dentro del sistema.' },
]

const BENEFIT_CARDS = [
  { cat: 'Rapidez', title: 'Montaje en meses, no años', desc: 'La estructura llega prefabricada desde nuestra planta en Santiago. Lista para montar en cualquier geografía.' },
  { cat: 'Transparencia', title: 'Precio a suma alzada', desc: 'Sabes exactamente lo que pagas desde el primer día. Sin adicionales ni sorpresas al final de la obra.' },
  { cat: 'Adaptabilidad', title: 'Para cualquier geografía', desc: 'Playa, campo, sur o patagonia. Diseñada para adaptarse a cualquier clima y terreno de Chile.' },
  { cat: 'Naturaleza', title: 'Materiales de alto desempeño', desc: 'Madera laminada, lana de oveja, zinc. Lo mejor de cada material combinado en un sistema que dura.' },
]

const FAQ_CATS = [
  {
    cat: 'FURŌ',
    items: [
      { q: '¿Qué es FURŌ?', r: 'FURŌ es una empresa chilena de construcción industrializada. Fabricamos estructuras en madera laminada desde nuestra planta en Santiago y las montamos en el terreno del cliente, en cualquier geografía del país.' },
      { q: '¿Qué son los Paneles Estructurales Térmicos FURŌ?', r: 'Son el corazón de cada Noki. Paneles prefabricados de madera laminada con aislación integrada de lana de oveja (160mm). Más resistentes y livianos que el hormigón, con interior visto que se siente diferente.' },
      { q: '¿Dónde se fabrican las casas Noki?', r: 'En nuestra planta en Santiago. Cada panel se produce en condiciones controladas, garantizando precisión y calidad constante en cada proyecto.' },
      { q: '¿Las casas tienen garantía?', r: 'Sí. Los Paneles Estructurales Térmicos FURŌ tienen garantía estructural. Con cada proyecto entregamos un manual de uso y mantenimiento.' },
    ]
  },
  {
    cat: 'MATERIALES & DESEMPEÑO',
    items: [
      { q: '¿Qué materiales utilizan?', r: 'Madera laminada encolada (glulam), lana de oveja como aislante, zinc en cubierta y terminaciones en madera tratada al exterior. Todos seleccionados por durabilidad, desempeño térmico y origen responsable.' },
      { q: '¿Cómo funciona el aislamiento térmico?', r: 'La envolvente incluye 160mm de lana de oveja. Mantiene el calor en invierno y el frío fuera en verano, sin necesidad de climatización permanente.' },
      { q: '¿Funciona en climas extremos?', r: 'Sí. Diseñada para la diversidad climática de Chile: costa, precordillera, sur lluvioso y patagonia. La lana de oveja regula la humedad y la temperatura de forma natural.' },
      { q: '¿Qué tan resistente es la estructura?', r: 'Los paneles de madera laminada tienen mayor resistencia por peso que el hormigón. La estructura está calculada para cumplir con la normativa sísmica chilena.' },
    ]
  },
  {
    cat: 'PROCESO',
    items: [
      { q: '¿Cómo es el proceso de compra?', r: 'Primero agendas una reunión de 20 minutos con nuestro equipo. Luego definimos el emplazamiento y terminaciones. Firmamos contrato a suma alzada y comenzamos la fabricación. El montaje en terreno dura entre 4 y 8 meses.' },
      { q: '¿Cuánto tiempo tarda todo el proceso?', r: 'Entre 6 y 12 meses desde la firma del contrato hasta las llaves, dependiendo de los tiempos de permisos del terreno.' },
      { q: '¿Necesito contratar un arquitecto por separado?', r: 'No. El proyecto de arquitectura básico está incluido. Si necesitas proyecto de permisos adaptado a tu municipio, lo coordinamos con nuestro equipo técnico.' },
      { q: '¿Puedo personalizar el diseño?', r: 'Sí, dentro del sistema Noki. Puedes elegir terminaciones interiores y exteriores, colores y acabados sin alterar la estructura ni el precio base.' },
    ]
  },
  {
    cat: 'TERRENO & PERMISOS',
    items: [
      { q: '¿Necesito terreno propio?', r: 'Sí. Noki se construye en tu terreno. Si estás buscando, podemos orientarte en el proceso.' },
      { q: '¿Qué tipo de terreno necesito?', r: 'Necesitas acceso vehicular básico para el camión de transporte. No requiere pendiente específica, pero sí una evaluación previa de suelo.' },
      { q: '¿Cuáles son los permisos necesarios?', r: 'Permiso de edificación municipal y, según la zona, permiso del SAG o MBN. Gestionamos el proceso técnico contigo, aunque los plazos dependen de cada municipio.' },
      { q: '¿Puedo construir en zona rural?', r: 'Sí, en la mayoría de los casos. Evaluamos la factibilidad del terreno caso a caso en la primera reunión.' },
    ]
  },
  {
    cat: 'PRECIOS & FINANCIAMIENTO',
    items: [
      { q: '¿Cuál es el precio?', r: 'El precio de lanzamiento parte desde 6.000 UF para las primeras unidades. Es un precio a suma alzada: lo que firmas es lo que pagas, sin adicionales.' },
      { q: '¿Qué incluye el precio?', r: 'Proyecto de arquitectura, fabricación de paneles, transporte y montaje en terreno, instalaciones básicas y terminaciones del paquete base.' },
      { q: '¿Qué no incluye el precio?', r: 'Terreno, permisos municipales, instalaciones de servicios (agua, luz, alcantarillado) y terminaciones adicionales fuera del paquete base.' },
      { q: '¿Hay opciones de financiamiento?', r: 'Actualmente trabajamos con pago en etapas: reserva, fabricación y entrega. Estamos desarrollando convenios con instituciones financieras para las próximas unidades.' },
    ]
  },
]

export default function Noki() {
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', celular: '', perfil: '', donde: '', terreno: '', plazo: '', como_contactar: '' })
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const [openCat, setOpenCat] = useState<string|null>(null)
  const [openFaq, setOpenFaq] = useState<string|null>(null)
  const [heroImg, setHeroImg] = useState(0)
  const [whyActive, setWhyActive] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = async () => {
    if (!form.nombre || !form.apellido || !form.email) { setStatus('error'); return }
    setStatus('sending')
    try {
      const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tipo: 'waitlist_noki', fecha: new Date().toLocaleString('es-CL'), origen: 'noki', mailchimp: true }) })
      setStatus(res.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  const C = { dark: '#1a1714', mid: '#5e5850', muted: '#8a8278', red: '#e05c4b', white: '#ffffff', border: 'rgba(26,23,20,0.08)' }
  const inp: React.CSSProperties = { width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 300, color: C.dark, fontFamily: "'DM Sans', sans-serif", border: 'none', borderBottom: `1px solid ${C.border}`, background: 'transparent', outline: 'none' }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer', appearance: 'none' as any, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', paddingRight: 28 }
  const serif = "'Cormorant Garamond', Georgia, serif"

  // Primary CTA: coral (Únete a la lista de espera)
  const ctaBtn: React.CSSProperties = {
    display: 'inline-block', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
    color: '#fff', background: C.red, padding: '13px 28px', border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: 10,
  }
  // Secondary: light (Estoy interesado)
  const secBtn: React.CSSProperties = {
    display: 'inline-block', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
    color: C.dark, background: '#eeebe4', padding: '13px 28px', border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: 10,
  }

  return (
    <main style={{ backgroundColor: C.white, color: C.dark, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
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
        }
      `}</style>

      {/* FORM OVERLAY + PANEL */}
      <div className={`form-overlay${formOpen ? ' open' : ''}`} onClick={() => setFormOpen(false)} />
      <div className={`form-panel${formOpen ? ' open' : ''}`}>
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>Estoy interesado</p>
            <button onClick={() => setFormOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: C.muted, lineHeight: 1, fontWeight: 300 }}>×</button>
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: 20 }}>Asegura tu precio de lanzamiento.</h2>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 4 }}>Valor desde</p>
            <p style={{ fontFamily: serif, fontSize: 38, fontWeight: 400, color: C.dark, lineHeight: 1 }}>6.000 UF</p>
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

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '18px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ opacity: scrolled ? 0 : 1, transition: 'opacity 0.35s ease', pointerEvents: scrolled ? 'none' : 'auto' }}>
          <img src="/noki/logo_noki_negro.png" alt="Noki" style={{ height: 76 }} />
        </Link>
        <button onClick={() => setFormOpen(true)} style={secBtn}>
          Estoy interesado
        </button>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
        {HERO_IMAGES.map((img, i) => (
          <img key={img} src={`/noki/${img}`} alt="Noki" className="hero-img" style={{ opacity: heroImg === i ? 1 : 0 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 52, left: 52, right: 52, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Casas Noki</p>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(38px,5.5vw,72px)', fontWeight: 400, lineHeight: 1.05, color: '#fff', maxWidth: '16ch' }}>
              Una nueva forma de diseñar y construir.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 6, paddingBottom: 4 }}>
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroImg(i)} style={{ width: i === heroImg ? 24 : 6, height: 6, borderRadius: 3, background: i === heroImg ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section style={{ padding: '96px 48px 80px', background: C.white }}>
        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 32, textAlign: 'center', opacity: 0.4 }}>Lo que hacemos</p>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(36px,5vw,68px)', fontWeight: 400, lineHeight: 1.08, color: C.dark, maxWidth: 820, margin: '0 auto 24px', textAlign: 'center' }}>
            Casas prefabricadas para vivir mejor, en <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>cualquier lugar.</em>
          </h2>
          <p style={{ fontSize: 17, fontWeight: 300, color: C.mid, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.8, textAlign: 'center' }}>
            Prefabricadas en Santiago y montadas en tu terreno en meses. Para la playa, el campo, el sur o la patagonia.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setFormOpen(true)} style={ctaBtn}>Únete a la lista de espera</button>
          </div>
        </FadeUp>
      </section>

      {/* MODELO */}
      <section style={{ padding: '0 32px 72px', background: C.white }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 56 }}>
          <img src="/noki/P1010657.jpg" alt="Noki" style={{ width: '100%', height: '65vh', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* ISO + Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 64px', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f2f0eb' }}>
            <img src="/noki/noki_iso.webp" alt="Noki isométrico" style={{ width: '100%', display: 'block', objectFit: 'contain', padding: 32 }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Tu Noki, en cualquier lugar.</p>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(26px,3vw,42px)', fontWeight: 400, color: C.dark, marginBottom: 12, lineHeight: 1.1 }}>
              3 dormitorios. 3 baños. 162 m².
            </h3>
            <p style={{ fontSize: 15, fontWeight: 300, color: C.mid, lineHeight: 1.75, marginBottom: 32 }}>
              Diseñada para ir a cualquier lugar de Chile. Estructura prefabricada en paneles estructurales térmicos FURŌ.
            </p>
            {[
              { l: 'Área útil (térmico)', v: '140 m²' },
              { l: 'Terraza techada', v: '22 m²' },
              { l: 'Área total', v: '162 m²' },
              { l: 'Dormitorios / Baños', v: '3D / 3B' },
            ].map(({ l, v }) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, fontWeight: 400 }}>{l}</span>
                <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: C.dark }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 28 }}>
              <button onClick={() => setFormOpen(true)} style={secBtn}>Estoy interesado</button>
            </div>
          </div>
        </div>

        {/* Plantas lado a lado */}
        <div className="plantas-grid">
          <div style={{ background: '#f2f0eb', borderRadius: 12, overflow: 'hidden' }}>
            <img src="/noki/planta1.jpg" alt="Planta primer piso" style={{ width: '100%', display: 'block', objectFit: 'contain', padding: 24 }} />
            <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, padding: '8px 24px 20px', fontWeight: 500 }}>Primer piso</p>
          </div>
          <div style={{ background: '#f2f0eb', borderRadius: 12, overflow: 'hidden' }}>
            <img src="/noki/planta2.jpg" alt="Planta segundo piso" style={{ width: '100%', display: 'block', objectFit: 'contain', padding: 24 }} />
            <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, padding: '8px 24px 20px', fontWeight: 500 }}>Segundo piso</p>
          </div>
        </div>
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

        {/* BENEFIT CARDS */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="benefit-cards">
            {BENEFIT_CARDS.map((card, i) => (
              <div key={i} className="benefit-card" style={{ background: 'transparent', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontFamily: serif, fontSize: 26, fontWeight: 300, fontStyle: 'italic', color: '#fff', marginBottom: 20 }}>{card.cat}</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>{card.title}</p>
                <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO DE LANZAMIENTO */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '80px 48px', textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.dark, marginBottom: 24, opacity: 0.4 }}>Precio de lanzamiento</p>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(40px,6vw,80px)', fontWeight: 400, color: C.dark, lineHeight: 1, marginBottom: 12 }}>
            6.000 <span style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>UF</span>
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: C.mid, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.75 }}>
            Precio a suma alzada para las primeras unidades. Solicita tu propuesta y asegura tu tramo.
          </p>
          <button onClick={() => setFormOpen(true)} style={ctaBtn}>Únete a la lista de espera</button>
        </FadeUp>
      </section>

      {/* FOTO INTERIOR */}
      <section style={{ padding: '0 32px' }}>
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

      {/* BENEFICIOS */}
      <section style={{ background: C.dark, marginTop: 32 }}>
        <div style={{ padding: '72px 48px 48px', textAlign: 'center' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,243,238,0.3)', marginBottom: 24 }}>Beneficios</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(30px,4vw,56px)', fontWeight: 400, lineHeight: 1.08, color: '#f5f3ee', maxWidth: 560, margin: '0 auto' }}>
              Menos preocupaciones. Más tiempo para <em style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300 }}>vivir.</em>
            </h2>
          </FadeUp>
        </div>
        <div className="bene-grid" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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

      {/* FAQ */}
      <section style={{ background: C.dark, marginTop: 32 }}>
        <div style={{ padding: '56px 48px 24px' }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Preguntas Frecuentes</p>
        </div>
        {FAQ_CATS.map(grupo => {
          const isOpen = openCat === grupo.cat
          return (
            <div key={grupo.cat} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setOpenCat(isOpen ? null : grupo.cat)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 20, padding: '26px 48px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 18, color: isOpen ? '#fff' : 'rgba(255,255,255,0.5)', lineHeight: 1, flexShrink: 0 }}>
                  {isOpen ? '—' : '+'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: isOpen ? '#fff' : 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                  {grupo.cat}
                </span>
              </button>
              <div style={{ maxHeight: isOpen ? 2000 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ padding: '0 48px 12px' }}>
                  {grupo.items.map((item, i) => {
                    const key = `${grupo.cat}-${i}`
                    const qOpen = openFaq === key
                    return (
                      <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                          onClick={() => setOpenFaq(qOpen ? null : key)}
                          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 24 }}
                        >
                          <span style={{ fontSize: 17, fontWeight: 300, color: qOpen ? '#fff' : 'rgba(255,255,255,0.65)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                            {item.q}
                          </span>
                          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)', flexShrink: 0, lineHeight: 1.2, transition: 'transform 0.3s', display: 'block', transform: qOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                        </button>
                        <div style={{ maxHeight: qOpen ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                          <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, paddingBottom: 24 }}>{item.r}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', height: 1 }} />
      </section>

      {/* ABOUT */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '64vh' }}>
          <div style={{ overflow: 'hidden', background: '#dedad4' }}>
            <img src="/noki/P1010640.jpg" alt="Noki exterior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FadeUp>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dark, opacity: 0.4, marginBottom: 20 }}>Sobre Noki</p>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(26px,3vw,44px)', fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: 32 }}>
                Construimos diferente porque creemos en una arquitectura mejor.
              </h2>
              <p style={{ fontSize: 18, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 20 }}>
                En <strong style={{ fontWeight: 500, color: C.dark }}>FURŌ</strong> llevamos años perfeccionando la construcción con madera laminada en Chile. Aprendimos que la mayor barrera para una casa de calidad no era el costo — era la incertidumbre.
              </p>
              <p style={{ fontSize: 18, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 20 }}>
                Noki nació de una convicción simple: se puede construir mejor para vivir mejor. Prefabricado con precisión, transportado a cualquier lugar, montado en meses.
              </p>
              <p style={{ fontSize: 18, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 40 }}>
                Porque creemos en la madera como material del futuro. En casas que se adaptan al paisaje, no al revés.
              </p>
              <button onClick={() => setFormOpen(true)} style={ctaBtn}>Únete a la lista de espera</button>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 48px', background: C.dark, textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/noki/logo_noki_blanco.png" alt="Noki" style={{ height: 26, marginBottom: 32, display: 'block' }} />
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(28px,4vw,56px)', fontWeight: 400, lineHeight: 1.08, color: '#fff', marginBottom: 16, maxWidth: '20ch' }}>
            Construye tu casa en cualquier terreno de Chile.
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>Únete y asegura tu precio de lanzamiento.</p>
          <button onClick={() => setFormOpen(true)} style={ctaBtn}>
            Únete a la lista de espera
          </button>
        </FadeUp>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '64px 48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 24 }}>Noki by FURŌ</p>
            <p style={{ fontSize: 22, fontWeight: 300, color: C.dark, lineHeight: 1.6, maxWidth: 360 }}>
              Noki está construyendo la próxima generación de viviendas prefabricadas — usando materiales naturales y de alto desempeño para crear casas que se adaptan a cualquier paisaje de Chile.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 24 }}>Contacto</p>
            <a href="mailto:contacto@furo.company" style={{ fontSize: 15, color: C.mid, fontWeight: 300, display: 'block', marginBottom: 12 }}>contacto@furo.company</a>
            <a href="https://wa.me/56977441963" style={{ fontSize: 15, color: C.mid, fontWeight: 300, display: 'block' }}>WhatsApp</a>
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
    </main>
  )
}
