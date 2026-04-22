'use client'
import { useRef, useEffect, useState } from 'react'
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

export default function Nosotros() {
  return (
    <main style={{ backgroundColor: '#fff', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; }

        .nos-hero-pad { padding: 160px 56px 80px; }
        .nos-section-pad { padding: 100px 56px; }
        .nos-section-pad-sm { padding: 80px 56px; }

        .nos-img-full { width: 100%; display: block; object-fit: cover; }
        .nos-img-full-tall { width: 100%; height: 70vh; object-fit: cover; display: block; background: #e8e4de; }

        .nos-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .nos-two-col img { width: 100%; height: 50vw; max-height: 600px; object-fit: cover; display: block; background: #e8e4de; }

        .nos-text-img { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .nos-text-img-reverse { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

        .nos-equipo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px 40px; }

        .nos-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(20,18,16,0.08); }
        .nos-stat-item { padding: 48px 40px; border-right: 1px solid rgba(20,18,16,0.08); }
        .nos-stat-item:last-child { border-right: none; }

        @media (max-width: 900px) {
          .nos-hero-pad { padding: 100px 24px 60px !important; }
          .nos-section-pad { padding: 64px 24px !important; }
          .nos-section-pad-sm { padding: 48px 24px !important; }
          .nos-two-col { grid-template-columns: 1fr !important; }
          .nos-two-col img { height: 60vw !important; max-height: none !important; }
          .nos-text-img { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nos-text-img-reverse { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nos-equipo-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; }
          .nos-stat-row { grid-template-columns: 1fr !important; }
          .nos-stat-item { border-right: none !important; border-bottom: 1px solid rgba(20,18,16,0.08); padding: 32px 0 !important; }
          .nos-img-full-tall { height: 50vw !important; }
        }

        @media (max-width: 480px) {
          .nos-equipo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav dark />

      {/* HERO */}
      <section className="nos-hero-pad">
        <FadeUp>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', marginBottom: 24 }}>Nosotros</p>
          <h1 style={{ fontSize: 'clamp(42px,6vw,84px)', fontWeight: 300, lineHeight: 1.05, color: '#141210', marginBottom: 48, maxWidth: 800 }}>
            Fluir en la construcción.
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 80px' }}>
            <div />
            <div>
              <p style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 20 }}>
                FURŌ significa "fluir" en japonés. Apostamos 100% por el trabajo colaborativo y la mejora continua.
              </p>
              <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#8a8278' }}>
                Aprendimos que un equipo diverso y transversal trabaja mejor, más feliz, se enriquece y desarrolla la capacidad de escuchar y entender las necesidades de nuestros clientes.
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* IMAGEN FULL */}
      <div style={{ background: '#e8e4de' }}>
        <div className="nos-img-full-tall" style={{ backgroundImage: 'url(/nosotros/nosotros1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </div>

      {/* STATS */}
      <section className="nos-section-pad">
        <div className="nos-stat-row">
          {[
            { num: '+80', label: 'Proyectos modelados y solucionados' },
            { num: '+30', label: 'Profesionales en el equipo' },
            { num: '+2500 m²', label: 'Planta central de fabricación' },
          ].map(s => (
            <div key={s.num} className="nos-stat-item">
              <p style={{ fontSize: 'clamp(40px,5vw,72px)', fontWeight: 300, lineHeight: 1, color: '#141210', marginBottom: 12 }}>{s.num}</p>
              <p style={{ fontSize: 14, fontWeight: 300, color: '#8a8278', lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEXTO + IMAGEN */}
      <section className="nos-section-pad-sm" style={{ background: '#f5f3ee' }}>
        <div className="nos-text-img">
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', marginBottom: 24 }}>Quiénes somos</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 300, lineHeight: 1.15, color: '#141210', marginBottom: 28 }}>
              Un equipo multidisciplinario comprometido con la construcción del futuro.
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', marginBottom: 20 }}>
              Somos un equipo multidisciplinario de más de 30 profesionales que reúne a ingenieros, arquitectos, diseñadores, constructores, todos bajo el techo FURŌ.
            </p>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850' }}>
              Nuestra experiencia y pasión, y el respaldo de la tecnología, son nuestro motor para seguir trabajando con el foco de mejorar la manera de construir.

            </p>
          </div>
          <div style={{ background: '#e8e4de', aspectRatio: '4/5', backgroundImage: 'url(/nosotros/nosotros2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      </section>

      {/* DOS IMÁGENES */}
      <div className="nos-two-col">
        <div style={{ background: '#ddd8d0', backgroundImage: 'url(/nosotros/nosotros3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="nos-two-col-img" />
        <div style={{ background: '#e8e4de', backgroundImage: 'url(/nosotros/nosotros4.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="nos-two-col-img" />
      </div>

      {/* QUOTE */}
      <section className="nos-section-pad" style={{ background: '#141210' }}>
        <FadeUp>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 300, lineHeight: 1.6, color: '#f5f3ee', marginBottom: 40 }}>
              "Mediante lógicas de industrialización de procesos, optimización de estructuras y versatilidad en el diseño, desarrollamos proyectos colaborativos en todo Chile. Asumimos el desafío de abrir nuevos caminos hacia la construcción del futuro."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <span style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.3)', display: 'block' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#f5f3ee' }}>Ignacio Durruty</p>
                <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Gerente General y Fundador</p>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* IMAGEN FULL 2 */}
      <div style={{ background: '#e8e4de' }}>
        <div className="nos-img-full-tall" style={{ backgroundImage: 'url(/nosotros/nosotros3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </div>

      {/* TEXTO + IMAGEN REVERSE */}
      <section className="nos-section-pad-sm" style={{ background: '#fff' }}>
        <div className="nos-text-img-reverse">
          <div style={{ background: '#e8e4de', aspectRatio: '4/5', backgroundImage: 'url(/nosotros/nosotros4.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', marginBottom: 24 }}>Nuestro propósito</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 300, lineHeight: 1.15, color: '#141210', marginBottom: 28 }}>
              Trabajamos para mejorar la construcción en Chile.
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', marginBottom: 20 }}>
              Mediante lógicas de industrialización de procesos, optimización de estructuras y versatilidad en el diseño, desarrollamos proyectos colaborativos en todo Chile.
            </p>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850' }}>
              Junto a nuestros clientes, seguimos escribiendo esta historia: una nueva forma de construir, más eficiente, más sostenible y de mejor calidad para todos.
            </p>
          </div>
        </div>
      </section>

      {/* SEAMOS PARTNERS */}
      <section className="nos-section-pad" style={{ background: '#f5f3ee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png" alt="FURŌ" style={{ height: 68, filter: 'brightness(0)', opacity: 0.85, marginBottom: 10, display: 'block' }} />
          <p style={{ fontSize: 24, fontWeight: 300, color: '#52448a', marginBottom: 52 }}>es fluir en la construcción</p>
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