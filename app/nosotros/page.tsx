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

const PERSONAS = [
  { nombre: 'Ignacio Durruty',   cargo: 'Gerente General y Fundador' },
  { nombre: 'María González',    cargo: 'Arquitecta Senior' },
  { nombre: 'Felipe Soto',       cargo: 'Ingeniero Estructural' },
  { nombre: 'Catalina Muñoz',    cargo: 'Diseñadora de Proyectos' },
  { nombre: 'Andrés Pérez',      cargo: 'Jefe de Obra' },
  { nombre: 'Valentina Lagos',   cargo: 'Arquitecta' },
  { nombre: 'Diego Morales',     cargo: 'Ingeniero de Fabricación' },
  { nombre: 'Sofía Herrera',     cargo: 'Coordinadora de Proyectos' },
  { nombre: 'Martín Fuentes',    cargo: 'Constructor' },
  { nombre: 'Isadora Vidal',     cargo: 'Diseñadora' },
  { nombre: 'Tomás Rojas',       cargo: 'Ingeniero BIM' },
  { nombre: 'Antonia Castro',    cargo: 'Arquitecta de Interiores' },
  { nombre: 'Sebastián Pinto',   cargo: 'Jefe de Logística' },
  { nombre: 'Francisca Ríos',    cargo: 'Diseñadora Estructural' },
  { nombre: 'Matías Vargas',     cargo: 'Ingeniero Civil' },
  { nombre: 'Javiera Molina',    cargo: 'Arquitecta' },
  { nombre: 'Cristóbal Núñez',   cargo: 'Constructor Senior' },
  { nombre: 'Daniela Flores',    cargo: 'Coordinadora BIM' },
  { nombre: 'Nicolás Espinoza',  cargo: 'Ingeniero de Proyectos' },
  { nombre: 'Camila Torres',     cargo: 'Arquitecta Senior' },
  { nombre: 'Roberto Silva',     cargo: 'Jefe de Fabricación' },
  { nombre: 'Pilar Contreras',   cargo: 'Diseñadora' },
  { nombre: 'Alejandro Sánchez', cargo: 'Ingeniero Estructural' },
  { nombre: 'Gabriela Reyes',    cargo: 'Arquitecta' },
  { nombre: 'Pablo Gutiérrez',   cargo: 'Constructor' },
  { nombre: 'Constanza Álvarez', cargo: 'Coordinadora de Obra' },
  { nombre: 'Ignacio Méndez',    cargo: 'Diseñador BIM' },
  { nombre: 'Renata Jiménez',    cargo: 'Arquitecta de Proyectos' },
  { nombre: 'Esteban Romero',    cargo: 'Ingeniero de Montaje' },
  { nombre: 'Lucía Navarro',     cargo: 'Diseñadora Senior' },
]

type CellType =
  | { t: 'empty-big' }
  | { t: 'empty-sm' }
  | { t: 'txt-equipo' }
  | { t: 'txt-quote' }
  | { t: 'big'; foto: 1|2|3; p: number }
  | { t: 'sm';  foto: 1|2|3; p: number }

function buildGrid(): CellType[] {
  let p = 0
  const f = (): 1|2|3 => ([1,2,3][p % 3] as 1|2|3)

  const big  = (): CellType => { const c: CellType = { t:'big', foto:f(), p }; p++; return c }
  const sm   = (): CellType => { const c: CellType = { t:'sm',  foto:f(), p }; p++; return c }
  const eB   = (): CellType => ({ t:'empty-big' })
  const eSm  = (): CellType => ({ t:'empty-sm' })
  const eq   = (): CellType => ({ t:'txt-equipo' })
  const qu   = (): CellType => ({ t:'txt-quote' })

  return [
    // BLOQUE A — filas 1-2: [empty-big][sm][sm][big] + cont [sm][sm]
    eB(), sm(), sm(), big(),
    sm(), sm(),

    // BLOQUE B — filas 3-4: [big][sm][sm][big] + cont [sm][sm]
    big(), sm(), sm(), big(),
    sm(), sm(),

    // BLOQUE C — filas 5-6: [txt-equipo][sm][sm][big] + cont [sm][sm]
    eq(), sm(), sm(), big(),
    sm(), sm(),

    // BLOQUE D — filas 7-8: [sm][big][sm][sm][big] + cont [eSm]
    sm(), big(), sm(), sm(), big(),
    eSm(),

    // BLOQUE E — filas 9-10: [big][sm][sm][txt-quote] + cont [sm][eSm]
    big(), sm(), sm(), qu(),
    sm(), eSm(),

    // BLOQUE F — filas 11-12: [sm][sm][big][sm][big] + cont [eSm]
    sm(), sm(), big(), sm(), big(),
    eSm(),
  ]
}

const GRID = buildGrid()

export default function Nosotros() {
  return (
    <main style={{ backgroundColor: '#fff', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; }

        .nos-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 18vw;
          gap: 6px;
          background: #fff;
          padding: 6px;
        }

        .nos-sm {
          grid-column: span 1;
          grid-row: span 1;
          position: relative;
          overflow: hidden;
          background: #e8e4de;
        }
        .nos-big {
          grid-column: span 2;
          grid-row: span 2;
          position: relative;
          overflow: hidden;
          background: #e8e4de;
        }
        .nos-sm img, .nos-big img {
          width: 100%; height: 100%;
          object-fit: cover;
          position: absolute; inset: 0;
          display: block;
          filter: grayscale(15%);
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease;
        }
        .nos-sm:hover img, .nos-big:hover img {
          transform: scale(1.05);
          filter: grayscale(0%);
        }

        /* overlay hover con nombre */
        .nos-hover {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(20,18,16,0.78) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          display: flex; align-items: flex-end;
          padding: 14px 14px;
        }
        .nos-sm:hover .nos-hover,
        .nos-big:hover .nos-hover { opacity: 1; }
        .nos-hover-name {
          font-size: 12px; font-weight: 500; color: #f5f3ee; line-height: 1.3;
          transform: translateY(6px);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .nos-hover-cargo {
          font-size: 10px; font-weight: 300; color: rgba(245,243,238,0.6); margin-top: 2px;
          transform: translateY(6px);
          transition: transform 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .nos-sm:hover .nos-hover-name,
        .nos-sm:hover .nos-hover-cargo,
        .nos-big:hover .nos-hover-name,
        .nos-big:hover .nos-hover-cargo { transform: translateY(0); }

        .nos-empty-sm  { grid-column: span 1; grid-row: span 1; background: transparent; }
        .nos-empty-big { grid-column: span 2; grid-row: span 2; background: transparent; }

        .nos-txt {
          grid-column: span 2;
          grid-row: span 2;
          background: transparent;
          display: flex;
          align-items: center;
          padding: 28px 32px;
        }
        .nos-txt.quote { align-items: flex-start; padding-top: 32px; }

        @media (max-width: 768px) {
          .nos-grid { grid-auto-rows: 26vw; gap: 3px; padding: 3px; }
          .nos-txt { padding: 16px 18px; }
        }
      `}</style>

      <Nav dark />

{/* ── INTRO ─────────────────────────────────────────── */}
<section style={{ background: '#fff', padding: '160px 56px 80px' }}>
  <FadeUp>
    <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.15, color: '#141210', textAlign: 'right', marginBottom: 40 }}>
      FURŌ significa "fluir" en japonés
    </p>
  </FadeUp>
  <FadeUp delay={0.1}>
    <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', textAlign: 'right', marginBottom: 20 }}>
      Apostamos 100% por el trabajo colaborativo y la mejora continua. Aprendimos que un equipo diverso y transversal trabaja mejor, más feliz, se enriquece y desarrolla la capacidad de escuchar y entender las necesidades de nuestros clientes.
    </p>
  </FadeUp>
  <FadeUp delay={0.15}>
    <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', textAlign: 'right', marginBottom: 40 }}>
      Nos apasiona enfrentar desafíos reales. Confiados en nuestros conocimientos técnicos y en los de nuestros clientes, asumimos el compromiso de ejecutar y resolver proyectos de construcción en madera laminada para todo uso, tamaño y en cualquier lugar.
    </p>
  </FadeUp>
  <FadeUp delay={0.2}>
    <p style={{ fontSize: 18, fontWeight: 300, color: '#52448a', textAlign: 'right' }}>
      Trabajamos para mejorar la construcción en Chile
    </p>
  </FadeUp>
</section>
      {/* ── GRID ──────────────────────────────────────────── */}
      <div className="nos-grid">
        {GRID.map((cell, i) => {
          if (cell.t === 'empty-sm')  return <div key={i} className="nos-empty-sm" />
          if (cell.t === 'empty-big') return <div key={i} className="nos-empty-big" />

          if (cell.t === 'txt-equipo') return (
            <div key={i} className="nos-txt">
              <p style={{ fontSize: 'clamp(13px,1.15vw,17px)', fontWeight: 300, lineHeight: 1.8, color: '#5e5850' }}>
                Somos un equipo multidisciplinario de más de 30 profesionales que reúne a ingenieros, arquitectos, diseñadores, constructores, todos bajo el techo FURŌ. Nuestra experiencia y pasión, y el respaldo de la tecnología, son nuestro motor para seguir trabajando con el foco de mejorar la manera de construir.
              </p>
            </div>
          )

          if (cell.t === 'txt-quote') return (
            <div key={i} className="nos-txt quote">
              <div>
                <p style={{ fontSize: 'clamp(12px,1.05vw,15px)', fontWeight: 300, lineHeight: 1.8, color: '#141210' }}>
                  "Mediante lógicas de industrialización de procesos, optimización de estructuras y versatilidad en el diseño, desarrollamos proyectos colaborativos en todo Chile. Asumimos el desafío de abrir nuevos caminos hacia la construcción del futuro y, junto a nuestros clientes, seguimos escribiendo esta historia: una nueva forma de construir, más eficiente, más sostenible y de mejor calidad para todos."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <span style={{ width: 28, height: 1, background: '#8a8278', flexShrink: 0, display: 'block' }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#141210' }}>Ignacio Durruty</p>
                    <p style={{ fontSize: 11, fontWeight: 300, color: '#8a8278', marginTop: 2 }}>Gerente General y Fundador</p>
                  </div>
                </div>
              </div>
            </div>
          )

          // Foto
          const persona = PERSONAS[cell.p % PERSONAS.length]
          const cls = cell.t === 'big' ? 'nos-big' : 'nos-sm'
          return (
            <div key={i} className={cls}>
              <img src={`/nosotros/foto${cell.foto}.jpg`} alt={persona.nombre} />
              <div className="nos-hover">
                <div>
                  <p className="nos-hover-name">{persona.nombre}</p>
                  <p className="nos-hover-cargo">{persona.cargo}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── SEAMOS PARTNERS ───────────────────────────────── */}
      <section style={{ background: '#fff', padding: '140px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png" alt="FURŌ" style={{ height: 68, filter: 'brightness(0)', opacity: 0.85, marginBottom: 10, display: 'block' }} />
          <p style={{ fontSize: 24, fontWeight: 300, color: '#52448a', marginBottom: 52 }}>es fluir en la construcción</p>
          <h2 style={{ fontSize: 'clamp(28px,7vw,36px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 32 }}>Seamos Partners</h2>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', maxWidth: 640, marginBottom: 16 }}>Creemos en la mejora continua y somos partners de nuestros clientes para seguir abriendo caminos hacia una nueva manera de construir.</p>
          <p style={{ fontSize: 18, fontWeight: 300, color: '#52448a', marginBottom: 52 }}>+flexible, +eficiente, +sostenible y con libertad espacial.</p>
          <a href="/contacto" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: '#141210', padding: '16px 44px', display: 'inline-block' }}>Empecemos →</a>
        </FadeUp>
      </section>

      <Footer />
    </main>
  )
}