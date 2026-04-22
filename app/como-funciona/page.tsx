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

const pasos = [
  { num: '01', titulo: 'Integración temprana, una mejor toma de decisiones', texto: 'Nos involucramos desde el anteproyecto, entregando ingenieria, modelacion y analisis de costos, lo que permite una toma de decisiones mas certera desde el origen de cada proyecto.' },
  { num: '02', titulo: 'Modelación y cálculo para optimizar la ejecución desde el origen', texto: 'Utilizamos tecnologia BIM modelando los proyectos en Revit, con detalles para la fabricacion de cada pieza y calculo estructural preciso, de esta manera optimizamos la ejecucion desde la etapa de diseno.' },
  { num: '03', titulo: 'Fabricación precisa de paneles estructurales', texto: 'Contamos con una planta central de mas de 2.500 m², donde fabricamos con precision los componentes estructurales para cada proyecto. Estos elementos versatiles permiten soluciones en muros, pisos ventilados, entrepisos y cubiertas, alcanzando longitudes de hasta 12 metros sin uniones intermedias. Nuestra solución de componentes estructurales incorporan la aislación, los emplacados y todos los herrajes y fijaciones necesarios para su montaje.' },
  { num: '04', titulo: 'Eficientes y flexibles en la logística', texto: 'Desarrollamos una logistica eficiente y flexible. Las piezas estan optimizadas para su transporte despiezado, incluso en zonas remotas, gracias a su ligereza y modularidad.' },
  { num: '05', titulo: 'Montaje ágil y acompañamiento en todo el proceso', texto: 'Nuestra metodología de montaje es un proceso agil y organico, lo que nos permite reducir los tiempos en obra en un 40%, incluso en ubicaciones aisladas.Permite precisión, disminuyendo imprevistos y el uso de mano de obra no especializada, lo que garantiza su escalabilidad y asequibilidad.' },
]

const componentes = [
  { label: 'Envolvente termica', img: '/como-funciona/Envolvente.jpg' },
  { label: 'Componentes TECHO', img: '/como-funciona/techo.jpg' },
  { label: 'Componentes MUROS', img: '/como-funciona/muro.jpg' },
  { label: 'Componentes PISO', img: '/como-funciona/piso.jpg' },
  { label: 'Vigas y pilares', img: '/como-funciona/pilares.jpg' },
  { label: 'Herrajes y Fijaciones', img: '/como-funciona/herrajes.jpg' },
]

function Acordeon() {
  const [abierto, setAbierto] = useState<number | null>(null)
  return (
    <div>
      {pasos.map((p, i) => (
        <div key={p.num} style={{ borderTop: '1px solid rgba(20,18,16,0.1)' }}>
          <button onClick={() => setAbierto(abierto === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '28px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', color: '#52448a', minWidth: 28, paddingTop: 3 }}>{p.num}</span>
              <span style={{ fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, lineHeight: 1.3, color: '#141210', fontFamily: 'DM Sans, sans-serif' }}>{p.titulo}</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 300, color: '#52448a', flexShrink: 0, transition: 'transform 0.3s', transform: abierto === i ? 'rotate(45deg)' : 'none' }}>+</span>
          </button>
          <div style={{ maxHeight: abierto === i ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', paddingLeft: 44, paddingBottom: 28 }}>{p.texto}</p>
          </div>
        </div>
      ))}
      <div style={{ borderTop: '1px solid rgba(20,18,16,0.1)' }} />
    </div>
  )
}

export default function ComoFunciona() {
  return (
    <main style={{ backgroundColor: '#f5f3ee', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}a{text-decoration:none;}
        .cf-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .cf-hero-img { position: relative; overflow: hidden; background: #ccc8bf; min-height: 420px; }
        .cf-hero-text { padding: 140px 72px 80px 64px; display: flex; flex-direction: column; justify-content: center; background: #fff; }
        .cf-acordeon-grid { display: grid; grid-template-columns: 1fr 1fr; background: #f5f3ee; }
        .cf-acordeon-left { padding: 100px 64px 100px 56px; }
        .cf-acordeon-right { padding: 100px 72px 100px 64px; display: flex; flex-direction: column; justify-content: center; border-left: 1px solid rgba(20,18,16,0.08); }
        .cf-componentes { display: grid; grid-template-columns: repeat(6,1fr); }
        .cf-bosque-pad { padding: 80px 56px; }
        .cf-comparador-pad { padding: 80px 56px; }
        .cf-tagline { padding: 0 56px; }
        .cf-partners-pad { padding: 140px 56px; }
        @media (max-width: 900px) {
          .cf-hero { grid-template-columns: 1fr; min-height: auto; }
          .cf-hero-img { min-height: 50vw !important; }
          .cf-hero-text { padding: 100px 24px 60px !important; }
          .cf-acordeon-grid { grid-template-columns: 1fr; }
          .cf-acordeon-left { padding: 60px 24px !important; }
          .cf-acordeon-right { padding: 0 24px 60px !important; border-left: none !important; border-top: 1px solid rgba(20,18,16,0.08); }
          .cf-bosque-pad { padding: 60px 24px !important; }
          .cf-comparador-pad { padding: 60px 24px !important; }
          .cf-componentes { grid-template-columns: repeat(3,1fr) !important; }
          .cf-tagline { padding: 0 24px !important; }
          .cf-partners-pad { padding: 80px 24px !important; }
        }
        @media (max-width: 480px) {
          .cf-componentes { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
      <Nav />

      <section className="cf-hero">
        <div className="cf-hero-img">
          <img src="/como-funciona/hero.jpg" alt="Cómo funciona" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        </div>
        <div className="cf-hero-text">
          <FadeUp>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 24 }}>Cómo funciona</span>
          </FadeUp>
          <RevealText tag="h1" delay={0.1} style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 32 }}>
            Un enfoque inteligente a la manera de construir, smart timber.
          </RevealText>
          <FadeUp delay={0.2}>
            <a href="/contacto" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.3)', paddingBottom: 2 }}>Seamos Partners →</a>
          </FadeUp>
        </div>
      </section>

      <section className="cf-acordeon-grid">
        <div className="cf-acordeon-left">
          <FadeUp><Acordeon /></FadeUp>
        </div>
        <div className="cf-acordeon-right">
          <FadeUp delay={0.1}>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 24 }}>Analizamos y modelamos los proyectos de manera precisa, fabricamos y construimos estructuras para desarrollos inmobiliarios, proyectos comerciales, colegios y volúmenes que necesitan espacialidad, habitabilidad y eficiencia estructural.</p>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850' }}>En un montaje ágil — una construcción tipo lego o mecano — se ensamblan los componentes, constituyendo una obra gruesa con menores imprevistos, tiempos de construcción y costos, y una mayor libertad en los espacios.
</p>
          </FadeUp>
        </div>
      </section>

      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '40vh', background: '#141210' }}>
        <img src="/como-funciona/bosque.jpg" alt="Metodologia" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div className="cf-bosque-pad" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '40vh' }}>
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 300, lineHeight: 1.2, color: '#fff', maxWidth: 480, marginBottom: 32 }}>Nuestra metodología se adapta a los desafíos de cada proyecto
</h2>
            <a href="/contacto" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 2, display: 'inline-block' }}>Beneficios →</a>
          </FadeUp>
        </div>
      </section>

      <section className="cf-comparador-pad" style={{ background: '#e8e5df' }}>
        <FadeUp>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <img src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png" alt="FURO" style={{ height: 28, filter: 'brightness(0)', opacity: 0.8 }} />
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 300, color: '#8a8278' }}>Construcción tradicional</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#52448a' }}>FURO</span>
            </div>
            <div style={{ position: 'relative', height: 4, background: 'rgba(20,18,16,0.1)', borderRadius: 2, marginBottom: 20 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '60%', background: 'rgba(20,18,16,0.15)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '40%', background: '#52448a', borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: '60%', top: '50%', transform: 'translate(-50%,-50%)', width: 14, height: 14, background: '#52448a', borderRadius: '50%' }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 300, color: '#5e5850' }}>disminuimos en un <strong style={{ color: '#52448a', fontWeight: 600 }}>40%</strong> el tiempo de montaje de la obra gruesa</p>
          </div>
        </FadeUp>
      </section>

      <section>
        <div className="cf-componentes">
          {componentes.map((comp) => (
            <div key={comp.label} style={{ position: 'relative', aspectRatio: '1/2', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={comp.img} alt={comp.label} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 10px' }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: '#fff', lineHeight: 1.3 }}>{comp.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#fff', paddingTop: 60, textAlign: 'center' }}>
        <FadeUp>
          <h2 className="cf-tagline" style={{ fontSize: 'clamp(22px,4vw,44px)', fontWeight: 300, lineHeight: 1.15, color: '#3a2d5e', maxWidth: 820, margin: '0 auto 58px' }}>
            La madera ofrece ligereza, eficiencia termica y adaptabilidad
          </h2>
        </FadeUp>
        <img src="/como-funciona/madera.jpg" alt="Madera" style={{ width: '100%', display: 'block', maxHeight: 560, objectFit: 'cover' }} />
      </section>

      <section className="cf-partners-pad" style={{ background: '#f5f3ee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
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