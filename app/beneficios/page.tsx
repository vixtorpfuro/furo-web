'use client'
import { useState, useRef, useEffect } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)', transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)`, ...style }}>
      {children}
    </div>
  )
}

function RevealText({ children, delay = 0, tag = 'div', style = {} }: { children: React.ReactNode, delay?: number, tag?: string, style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  const Tag = tag as any
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <Tag style={{ ...style, transform: inView ? 'translateY(0)' : 'translateY(110%)', opacity: inView ? 1 : 0, transition: `transform 0.85s ${delay}s cubic-bezier(0.16,1,0.3,1), opacity 0.85s ${delay}s` }}>
        {children}
      </Tag>
    </div>
  )
}

const IconConstruccion = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="13" width="22" height="11" rx="1"/><path d="M6 13V9a7 7 0 0114 0v4"/><line x1="13" y1="16" x2="13" y2="21"/>
  </svg>
)
const IconDiseno = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="9" height="9" rx="1"/><rect x="15" y="2" width="9" height="9" rx="1"/>
    <rect x="2" y="15" width="9" height="9" rx="1"/><rect x="15" y="15" width="9" height="9" rx="1"/>
  </svg>
)
const IconSostenibilidad = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 C13 2 4 7 4 15 a9 9 0 0018 0 C22 7 13 2 13 2z"/>
    <path d="M13 24 L13 13"/><path d="M13 17 L9 13"/><path d="M13 17 L17 13"/>
  </svg>
)

type AreaKey = 'construccion' | 'diseno' | 'sostenibilidad'

const areas: Record<AreaKey, { label: string, icon: React.ReactNode, img: string, items: { titulo: string, desc: string }[] }> = {
  construccion: {
    label: 'Construccion', icon: <IconConstruccion />, img: '/beneficios/construccion.jpg',
    items: [
      { titulo: 'Velocidad de construccion', desc: 'Estructuras listas para ensamblar y montar en obra, cual mecano o lego.' },
      { titulo: 'Certeza en costos y plazos', desc: 'Los proyectos son a suma alzada y la metodologia industrializada FURO entrega mayor certeza en fabricacion, logistica y montaje.' },
      { titulo: 'Optimizacion de materiales y logistica', desc: 'El uso consciente de los insumos de construccion y diseno busca la eficiencia en su traslado.' },
    ]
  },
  diseno: {
    label: 'Diseno', icon: <IconDiseno />, img: '/beneficios/diseno.jpg',
    items: [
      { titulo: 'Libertad Arquitectonica', desc: 'Nuestras soluciones permiten una libre expresion resolviendo geometrias complejas.' },
      { titulo: 'Amplitud espacial', desc: 'La capacidad estructural de la madera laminada permite grandes luces sin refuerzos, logrando espacialidades totalmente libres.' },
      { titulo: 'Compatibilidad', desc: 'Diseno funcional y transversal. Absoluta compatibilidad con otros materiales y distintos tipos de revestimientos.' },
    ]
  },
  sostenibilidad: {
    label: 'Sostenibilidad', icon: <IconSostenibilidad />, img: '/beneficios/sostenibilidad.jpg',
    items: [
      { titulo: 'Madera + lana de oveja', desc: 'Materiales renovables, locales y trazables.' },
      { titulo: 'Mitigacion de nuestra huella', desc: 'Captura de carbono y reduccion de impacto ambiental.' },
      { titulo: 'Optimizacion de materiales', desc: 'Reduccion de residuos en fabrica y en obra.' },
    ]
  },
}

function SeccionAreas() {
  const [activa, setActiva] = useState<AreaKey>('construccion')
  const [hover, setHover] = useState<AreaKey | null>(null)
  const displayed = hover || activa
  const area = areas[displayed]

  return (
    <>
      <style>{`
        .areas-desktop { display: grid; grid-template-columns: 260px 1fr 1fr; height: 560px; background: #1a1a1a; overflow: hidden; }
        .areas-mobile { display: none; background: #1a1a1a; }
        @media (max-width: 900px) {
          .areas-desktop { display: none !important; }
          .areas-mobile { display: block !important; }
        }
      `}</style>

      <section className="areas-desktop">
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {(Object.keys(areas) as AreaKey[]).map(key => (
            <button key={key} onClick={() => setActiva(key)} onMouseEnter={() => setHover(key)} onMouseLeave={() => setHover(null)}
              style={{ padding: '36px 32px', display: 'flex', alignItems: 'center', gap: 14, background: hover === key ? 'rgba(255,255,255,0.04)' : 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', borderLeft: (hover === key || (activa === key && !hover)) ? '2px solid #f5f3ee' : '2px solid transparent', transition: 'all 0.25s' }}>
              <span style={{ color: (hover === key || (activa === key && !hover)) ? '#f5f3ee' : 'rgba(255,255,255,0.3)', transition: 'color 0.25s' }}>{areas[key].icon}</span>
              <span style={{ fontSize: 15, fontWeight: 400, color: (hover === key || (activa === key && !hover)) ? '#f5f3ee' : 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.25s' }}>{areas[key].label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          {area.items.map((item, i) => (
            <div key={item.titulo} style={{ marginBottom: i < area.items.length - 1 ? 28 : 0, paddingBottom: i < area.items.length - 1 ? 28 : 0, borderBottom: i < area.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#f5f3ee', marginBottom: 8, lineHeight: 1.3 }}>{item.titulo}</h3>
              <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 400 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {(Object.keys(areas) as AreaKey[]).map(key => (
            <img key={key} src={areas[key].img} alt={areas[key].label} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: displayed === key ? 1 : 0, transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
        </div>
      </section>

      <section className="areas-mobile">
        {(Object.keys(areas) as AreaKey[]).map(key => {
          const isOpen = activa === key
          return (
            <div key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setActiva(key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ color: isOpen ? '#f5f3ee' : 'rgba(255,255,255,0.3)', transition: 'color 0.25s' }}>{areas[key].icon}</span>
                <span style={{ fontSize: 16, fontWeight: 400, color: isOpen ? '#f5f3ee' : 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', flex: 1 }}>{areas[key].label}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}>+</span>
              </button>
              <div style={{ maxHeight: isOpen ? 600 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={areas[key].img} alt={areas[key].label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '24px 24px 32px' }}>
                  {areas[key].items.map((item, i) => (
                    <div key={item.titulo} style={{ marginBottom: i < areas[key].items.length - 1 ? 20 : 0, paddingBottom: i < areas[key].items.length - 1 ? 20 : 0, borderBottom: i < areas[key].items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 500, color: '#f5f3ee', marginBottom: 6 }}>{item.titulo}</h3>
                      <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}

export default function Beneficios() {
  return (
    <main style={{ backgroundColor: '#f5f3ee', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}a{text-decoration:none;}
        .ben-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .ben-hero-text { padding: 140px 72px 80px 56px; display: flex; flex-direction: column; justify-content: center; background: #fff; }
        .ben-hero-img { position: relative; overflow: hidden; background: #1a1a1a; min-height: 400px; }
        .ben-mid-img { position: relative; height: 60vh; overflow: hidden; }
        .ben-text-img { display: grid; grid-template-columns: 1fr 1fr; min-height: 60vh; }
        .ben-text-img-left { position: relative; overflow: hidden; min-height: 300px; }
        .ben-text-img-right { padding: 80px 72px; display: flex; flex-direction: column; justify-content: center; background: #fff; }
        .ben-partners-pad { padding: 140px 56px; }
        @media (max-width: 900px) {
          .ben-hero { grid-template-columns: 1fr; min-height: auto; }
          .ben-hero-text { padding: 100px 24px 60px !important; order: 1; }
          .ben-hero-img { min-height: 50vw !important; order: 0; }
          .ben-mid-img { height: 40vw !important; }
          .ben-text-img { grid-template-columns: 1fr; }
          .ben-text-img-left { min-height: 50vw !important; }
          .ben-text-img-right { padding: 48px 24px !important; }
          .ben-partners-pad { padding: 80px 24px !important; }
        }
      `}</style>
      <Nav dark />

      <section className="ben-hero">
        <div className="ben-hero-text">
          <FadeUp>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 24 }}>Beneficios</span>
          </FadeUp>
          <RevealText tag="h1" delay={0.1} style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 300, lineHeight: 1.15, color: '#141210', marginBottom: 32 }}>
            Pensamos diferente: menos madera, mas limpio, mas liviano, asset light.
          </RevealText>
          <FadeUp delay={0.2}>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 40 }}>Entendemos los desafios del negocio, de cada proyecto y nos adaptamos a cada uno, combinando una fabricacion on-site y off-site lo que nos permite ser mas eficientes y priorizar la agilidad, el crecimiento y reducir la inversion directa en activos fijos.</p>
            <a href="/nosotros" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.3)', paddingBottom: 2 }}>Nosotros →</a>
          </FadeUp>
        </div>
        <div className="ben-hero-img">
          <img src="/beneficios/hero.jpg" alt="Beneficios" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        </div>
      </section>

      <SeccionAreas />

      <section className="ben-mid-img">
        <img src="/beneficios/construccion_diseno.jpg" alt="Construccion y Diseno" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
      </section>

      <section className="ben-text-img">
        <div className="ben-text-img-left">
          <img src="/beneficios/madera.jpg" alt="Madera" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        </div>
        <div className="ben-text-img-right">
          <FadeUp>
            <img src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png" alt="FURO" style={{ height: 32, filter: 'brightness(0)', opacity: 0.7, marginBottom: 40, display: 'block' }} />
            <h2 style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 300, lineHeight: 1.2, color: '#141210', marginBottom: 28 }}>Apostamos por transformar la forma en que vivimos y construimos.</h2>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 20 }}>Impulsamos una construccion sustentable, utilizando materiales ecologicos y nobles y procesos eficientes que minimizan el impacto ambiental, promueven el uso responsable de los recursos y favorecen la eficiencia energetica.</p>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 32 }}>Creemos en el trabajo colaborativo con nuestros clientes y en la mejora continua para seguir transformando la manera de construir.</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#52448a' }}>FURO es fluir en la construccion</p>
          </FadeUp>
        </div>
      </section>

      <section className="ben-partners-pad" style={{ background: '#f5f3ee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png" alt="FURO" style={{ height: 68, filter: 'brightness(0)', opacity: 0.85, marginBottom: 10, display: 'block' }} />
          <p style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 300, color: '#52448a', marginBottom: 52 }}>es fluir en la construccion</p>
          <h2 style={{ fontSize: 'clamp(26px,7vw,36px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 32 }}>Seamos Partners</h2>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', maxWidth: 640, marginBottom: 16 }}>Creemos en la mejora continua y somos partners de nuestros clientes para seguir abriendo caminos hacia una nueva manera de construir.</p>
          <p style={{ fontSize: 18, fontWeight: 300, color: '#52448a', marginBottom: 52 }}>+flexible, +eficiente, +sostenible y con libertad espacial.</p>
          <a href="/contacto" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: '#141210', padding: '16px 44px', display: 'inline-block' }}>Empecemos →</a>
        </FadeUp>
      </section>

      <Footer />
    </main>
  )
}