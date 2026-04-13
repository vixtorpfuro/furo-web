'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const testimonios = [
  { quote: '"FURO fue un acierto, la precision y control de los elementos de construccion hizo que la obra realmente fluyera"', autor: 'Fernando Garcia Huidobro', rol: 'Gerente Constructora Inarco', proyecto: 'Casa Santa Cruz', desc: 'Vivienda economica / + de 5.000 m2 de techumbre' },
  { quote: '"Trabajar con FURO nos permitio reducir los tiempos de obra significativamente. La precision del sistema es notable"', autor: 'Maria Jose Fernandez', rol: 'Arquitecta, Estudio MJF', proyecto: 'Proyecto Comercial', desc: 'Edificio comercial / 1.200 m2' },
  { quote: '"La calidad de los paneles y la coordinacion del equipo superaron nuestras expectativas en cada etapa"', autor: 'Carlos Mendoza', rol: 'Director, Constructora CM', proyecto: 'Residencial Norte', desc: 'Conjunto residencial / 3.500 m2' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
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

function RevealImage({ src, alt, style = {}, delay = 0 }: { src: string, alt: string, style?: React.CSSProperties, delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <img src={src} alt={alt} style={{ ...style, width: '100%', height: '100%', objectFit: 'cover', transform: inView ? 'scale(1)' : 'scale(1.08)', transition: `transform 1.2s ${delay}s cubic-bezier(0.16,1,0.3,1)`, clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }} />
    </div>
  )
}

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)', transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)`, ...style }}>
      {children}
    </div>
  )
}

function CountUp({ target, suffix = '', delay = 0 }: { target: number, suffix?: string, delay?: number }) {
  const { ref, inView } = useInView()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const dur = 1800, steps = 60, step = target / steps
    let cur = 0
    const t = setTimeout(() => {
      const int = setInterval(() => {
        cur += step
        if (cur >= target) { setVal(target); clearInterval(int) }
        else setVal(Math.floor(cur))
      }, dur / steps)
    }, delay * 1000)
    return () => clearTimeout(t)
  }, [inView])
  return <span ref={ref}>{val}{suffix}</span>
}

function ObraCard({ img, name, tipo }: { img: string, name: string, tipo: string }) {
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <a href="/obras" ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', cursor: 'pointer', display: 'block', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
      <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'scale(1.06)' : 'scale(1)', position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 55%)', opacity: hov ? 1 : 0, transition: 'opacity 0.4s' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 24px', transform: hov ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{name}</p>
          <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>{tipo}</p>
        </div>
      </div>
    </a>
  )
}

function BenefitCard({ num, img, title, desc }: { num: string, img: string, title: string, desc: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="/beneficios" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', cursor: 'pointer', display: 'block' }}>
      <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'scale(1.06)' : 'scale(1)', position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.15)', transition: 'background 0.4s' }} />
      <div style={{ position: 'absolute', inset: 0, padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.4s, transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 14 }}>{num}</span>
        <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)', marginBottom: 18 }} />
        <h3 style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.3, color: '#fff', marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>{desc}</p>
      </div>
    </a>
  )
}

export default function Home() {
  const [slide, setSlide] = useState(0)
  const t = testimonios[slide]
  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % testimonios.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main style={{ backgroundColor: '#141210', color: '#f5f3ee', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; } a { text-decoration: none; }
        @keyframes heroFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        .he { animation: heroFade 1s both cubic-bezier(0.16,1,0.3,1); }
        .d1{animation-delay:0.3s}.d2{animation-delay:0.5s}.d3{animation-delay:0.7s}
        .home-cf-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 90vh; }
        .home-stats-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .home-stat-cell { padding: 80px 64px; }
        .home-ben-header { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; padding-bottom: 72px; border-bottom: 1px solid rgba(20,18,16,0.08); margin-bottom: 72px; }
        .home-ben-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
        .home-test-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .home-obras-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; margin-bottom: 40px; }
        .home-section-pad { padding: 100px 56px; }
        .home-ben-pad { padding: 120px 56px; }
        .home-partners-pad { padding: 140px 56px; }
        .home-hero-content { padding: 0 56px 72px; }
        @media (max-width: 900px) {
          .home-cf-grid { grid-template-columns: 1fr; min-height: auto; }
          .home-cf-img { min-height: 320px !important; }
          .home-stat-cell { padding: 48px 24px; }
          .home-ben-header { grid-template-columns: 1fr; gap: 32px; }
          .home-ben-cards { grid-template-columns: 1fr; }
          .home-ben-cards > * { aspect-ratio: 4/3 !important; }
          .home-test-grid { grid-template-columns: 1fr; }
          .home-test-img { min-height: 300px !important; }
          .home-obras-grid { grid-template-columns: repeat(2,1fr); }
          .home-section-pad { padding: 72px 24px; }
          .home-ben-pad { padding: 72px 24px; }
          .home-partners-pad { padding: 80px 24px; }
          .home-hero-content { padding: 0 24px 56px; }
          .home-cf-text { padding: 64px 24px !important; }
          .home-test-text { padding: 56px 24px !important; }
          .stat-1 { order: 1; }
          .stat-img-1 { order: 2; }
          .stat-img-2 { order: 3; }
          .stat-2 { order: 4; }
          .stat-3 { order: 5; }
          .stat-img-3 { order: 6; }
          .home-stats-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .home-obras-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
      <Nav />

      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} src="https://furo.company/FURO_GIFTS_1.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,12,10,0.75) 0%, rgba(14,12,10,0.1) 60%)' }} />
        <div className="home-hero-content" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <span className="he d1" style={{ fontSize: 'clamp(14px,3vw,24px)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block' }}>Build Smarter</span>
          <h1 className="he d2" style={{ fontSize: 'clamp(30px,5vw,68px)', fontWeight: 300, lineHeight: 1.1, color: '#fff', marginBottom: 44 }}>Soluciones constructivas<br />eficientes en madera laminada</h1>
          <div className="he d3" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="/contacto" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', background: '#fff', padding: '14px 30px' }}>Seamos Partners</a>
            <a href="/como-funciona" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 1 }}>Como Funciona</a>
          </div>
        </div>
      </section>

      <section className="home-cf-grid">
        <div className="home-cf-text" style={{ background: '#f5f3ee', padding: '100px 72px 100px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <RevealText delay={0} style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a' }}>Como funciona</RevealText>
          <RevealText delay={0.1} tag="h2" style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 300, lineHeight: 1.05, color: '#141210' }}>Nos involucramos desde el origen de cada proyecto</RevealText>
          <FadeUp delay={0.2}><p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850' }}>FURO es fluir en la construccion. Mediante soluciones prefabricadas en madera laminada, integramos la estructura con la envolvente termica para optimizar el uso de la madera.</p></FadeUp>
          <FadeUp delay={0.3}><p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850' }}>Logramos abarcar obras de diferentes tamanos, usos y emplazados en cualquier lugar, con montaje agil y liviano.</p></FadeUp>
          <FadeUp delay={0.4}><a href="/como-funciona" style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#52448a' }}>Como funciona →</a></FadeUp>
        </div>
        <div className="home-cf-img" style={{ background: '#141210', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: 400 }}>
          <FadeUp delay={0.2}><img src="/home/dibujo.webp" alt="Componente" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} /></FadeUp>
        </div>
      </section>

      <section className="home-stats-grid">
        <div className="home-stat-cell stat-1" style={{ background: '#e8e5df', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(52px,7vw,96px)', fontWeight: 300, lineHeight: 1, color: '#141210', display: 'block', marginBottom: 12 }}>+<CountUp target={80} /></span>
          <span style={{ fontSize: 'clamp(14px,2vw,20px)', fontWeight: 300, color: '#8a8278' }}>proyectos modelados y solucionados</span>
        </div>
        <div className="stat-img-1" style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
          <RevealImage src="/home/obra_furo.jpg" alt="Obra" />
        </div>
        <div className="stat-img-2" style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
          <RevealImage src="/home/planta_furo.jpg" alt="Planta" delay={0.1} />
        </div>
        <div className="home-stat-cell stat-2" style={{ background: '#3a2d5e', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(52px,7vw,96px)', fontWeight: 300, lineHeight: 1, color: '#fff', display: 'block', marginBottom: 12 }}>+<CountUp target={2500} suffix=" m2" delay={0.1} /></span>
          <span style={{ fontSize: 'clamp(14px,2vw,20px)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>planta central</span>
        </div>
        <div className="home-stat-cell stat-3" style={{ background: '#c5cdd8', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(52px,7vw,96px)', fontWeight: 300, lineHeight: 1, color: '#141210', display: 'block', marginBottom: 12 }}>+<CountUp target={200} delay={0.2} /></span>
          <span style={{ fontSize: 'clamp(14px,2vw,20px)', fontWeight: 300, color: '#8a8278' }}>soluciones en obras</span>
        </div>
        <div className="stat-img-3" style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
          <RevealImage src="/home/solucion_furo.jpg" alt="Soluciones" delay={0.2} />
        </div>
      </section>

      <section className="home-ben-pad" style={{ background: '#fff' }} id="beneficios">
        <div className="home-ben-header">
          <div>
            <RevealText delay={0} style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 24 }}>Beneficios</RevealText>
            <RevealText delay={0.1} tag="h2" style={{ fontSize: 'clamp(30px,5vw,64px)', fontWeight: 300, lineHeight: 1.05, color: '#141210' }}>Combinamos los beneficios de la industrializacion y de la madera laminada</RevealText>
          </div>
          <FadeUp delay={0.2}>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 24 }}>Fabricamos de manera responsable y sustentable. Creemos en la mejora continua y somos partners de nuestros clientes.</p>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 32 }}>+flexible, +eficiente, +sostenible y con libertad espacial.</p>
            <a href="/contacto" style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#52448a' }}>Seamos partners →</a>
          </FadeUp>
        </div>
        <div className="home-ben-cards">
          <BenefitCard num="01" img="/home/sustentable_home_furo.jpg" title="Fabricamos de manera responsable y sustentable" desc="Optimizamos material y proceso de montaje, disminuyendo tiempos de la construccion tradicional." />
          <BenefitCard num="02" img="/home/libertad_home_furo.jpg" title="Flexible, eficiente y con libertad espacial" desc="Grandes luces y espacios amplios, adaptandose a distintas configuraciones y usos." />
          <BenefitCard num="03" img="/home/terminaciones_home_furo.jpg" title="Sostenible con innovacion disruptiva" desc="Fusionamos procesos con estetica contemporanea y alta eficiencia energetica." />
        </div>
      </section>

      <section className="home-test-grid">
        <div className="home-test-img" style={{ position: 'relative', minHeight: 400, overflow: 'hidden' }}>
          <RevealImage src="/home/inarco.jpg" alt="Testimonio" />
        </div>
        <div className="home-test-text" style={{ background: '#f5f3ee', padding: '80px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <FadeUp>
            <blockquote style={{ fontSize: 'clamp(16px,2vw,26px)', fontWeight: 300, lineHeight: 1.55, color: '#141210', marginBottom: 40, minHeight: 120, transition: 'opacity 0.4s' }}>{t.quote}</blockquote>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#141210', marginBottom: 4 }}>{t.autor}</p>
            <p style={{ fontSize: 13, fontWeight: 300, color: '#8a8278', marginBottom: 32 }}>{t.rol}</p>
            <div style={{ width: 40, height: 1, background: 'rgba(20,18,16,0.1)', marginBottom: 28 }} />
            <p style={{ fontSize: 14, fontWeight: 500, color: '#141210', marginBottom: 4 }}>{t.proyecto}</p>
            <p style={{ fontSize: 13, fontWeight: 300, color: '#8a8278', marginBottom: 32 }}>{t.desc}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {testimonios.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? '#141210' : 'rgba(20,18,16,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="home-section-pad" style={{ background: '#141210' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 40, marginBottom: 56 }}>
          <RevealText delay={0} style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 16 }}>Obras</RevealText>
          <RevealText delay={0.1} tag="h2" style={{ fontSize: 'clamp(18px,5vw,24px)', fontWeight: 300, lineHeight: 1.05, color: '#fff' }}>Seleccion de proyectos</RevealText>
        </div>
        <div className="home-obras-grid">
          <ObraCard img="/home/altos.jpg" name="Altos de Santa Cruz" tipo="Vivienda / +5.000 m2" />
          <ObraCard img="/home/humbolt.jpg" name="Colegio Humbolt" tipo="Comercial / +1000 m²" />
          <ObraCard img="/home/lago_Bertand.jpg" name="Casas Lago Bertand" tipo="Residencial/ +500 m²" />
          <ObraCard img="/home/autoconstruccion.jpg" name="Construccion de Emergencia" tipo="Vivienda / +5.000 m2" />
        </div>
        <FadeUp>
          <div style={{ textAlign: 'center' }}>
            <a href="/obras" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 32px', display: 'inline-block' }}>Ver todos los proyectos →</a>
          </div>
        </FadeUp>
      </section>

      <section className="home-partners-pad" style={{ background: '#f5f3ee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png" alt="FURO" style={{ height: 68, filter: 'brightness(0)', opacity: 0.85, marginBottom: 10, display: 'block' }} />
          <p style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 300, color: '#52448a', marginBottom: 52 }}>es fluir en la construccion</p>
          <h2 style={{ fontSize: 'clamp(26px,7vw,36px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 32 }}>Seamos Partners</h2>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', maxWidth: 640, marginBottom: 16 }}>Creemos en la mejora continua y somos partners de nuestros clientes, oficinas de arquitectura, constructoras y desarrolladores inmobiliarios.</p>
          <p style={{ fontSize: 18, fontWeight: 300, color: '#52448a', marginBottom: 52 }}>+flexible, +eficiente, +sostenible y con libertad espacial.</p>
          <a href="/contacto" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: '#141210', padding: '16px 44px', display: 'inline-block' }}>Empecemos →</a>
        </FadeUp>
      </section>

      <Footer />
    </main>
  )
}