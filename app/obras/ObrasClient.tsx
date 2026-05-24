'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// Orden preferido — solo aparece si tiene obras. Categorías nuevas aparecen automáticamente al final.
const ORDEN_CATEGORIAS = ['Residencial', 'Comercial', 'Educacional', 'Industrial', 'Vivienda Economica', 'Hoteleria']

const OBRA_MODELOS_FURO = {
  _id: 'modelos-furo',
  titulo: 'Modelos FURŌ',
  slug: { current: 'modelos-furo' },
  categoria: 'Residencial',
  destacada: true,
  cliente: 'FURŌ',
  arquitecto: 'FURŌ',
  superficie: 'Desde 46 m²',
  ubicacion: 'Todo Chile',
  anio: '2024',
  resumen: 'Cinco sistemas residenciales industrializados en madera laminada: Modelo A, T, Ts, Txs y W. Desde refugios en zonas extremas hasta casas familiares para el sur de Chile.',
  imagen_url: '/catalogos/Portada-modelo-furo.jpg',
  ctaLabel: 'Ver Modelos',
  imagenVertical: true,
}

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

function ContenidoObra({ obra }: { obra: any }) {
  return (
    <>
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 16 }}>{obra.categoria}</span>
      <h2 style={{ fontSize: 'clamp(26px,4vw,48px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 24 }}>{obra.titulo}</h2>
      {obra.resumen && <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 32 }}>{obra.resumen}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 40px', marginBottom: 40 }}>
        {obra.cliente && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Cliente</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.cliente}</p></div>}
        {obra.arquitecto && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Arquitecto</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.arquitecto}</p></div>}
        {obra.superficie && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Superficie</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.superficie}</p></div>}
        {obra.ubicacion && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Ubicacion</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.ubicacion}</p></div>}
        {obra.anio && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Año</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.anio}</p></div>}
      </div>
      <Link href={`/obras/${obra.slug?.current || obra._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.3)', paddingBottom: 2, width: 'fit-content' }}>
        {obra.ctaLabel || 'Ver proyecto'} →
      </Link>
    </>
  )
}

function ObraDestacada({ obra, reverse }: { obra: any, reverse: boolean }) {
  const { ref, inView } = useInView()
  const esVertical = obra.imagenVertical === true

  return (
    <>
      <style>{`
        .obra-dest {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 540px;
        }
        /* Imagen normal: cubre todo el espacio */
        .obra-dest-img-normal {
          position: relative;
          overflow: hidden;
          min-height: 540px;
        }
        .obra-dest-img-normal img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* Imagen vertical: fondo neutro, imagen centrada y visible completa */
        .obra-dest-img-vertical {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          padding: 48px 40px;
          min-height: 540px;
        }
        .obra-dest-img-vertical img {
          display: block;
          max-width: 100%;
          max-height: 700px;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
        }
        /* Texto siempre centrado verticalmente con min-height */
        .obra-dest-text {
          background: #fff;
          padding: 80px 72px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 540px;
        }
        @media (max-width: 900px) {
          .obra-dest { grid-template-columns: 1fr !important; min-height: auto !important; }
          .obra-dest-img-normal { min-height: 60vw !important; order: 0 !important; }
          .obra-dest-img-vertical { min-height: auto !important; padding: 40px 24px !important; order: 0 !important; }
          .obra-dest-text { padding: 48px 24px !important; min-height: auto !important; order: 1 !important; }
        }
      `}</style>
      <div
        ref={ref}
        className="obra-dest"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(40px)',
          transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* IMAGEN */}
        <div
          className={esVertical ? 'obra-dest-img-vertical' : 'obra-dest-img-normal'}
          style={{ order: reverse ? 1 : 0 }}
        >
          {obra.imagen_url ? (
            <img src={obra.imagen_url} alt={obra.titulo} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#ddd8d0' }} />
          )}
        </div>

        {/* TEXTO */}
        <div className="obra-dest-text" style={{ order: reverse ? 0 : 1 }}>
          <ContenidoObra obra={obra} />
        </div>
      </div>
    </>
  )
}

function ObraCard({ obra }: { obra: any }) {
  const [hov, setHov] = useState(false)
  const { ref, inView } = useInView()
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
      <Link href={`/obras/${obra.slug?.current || obra._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
        {obra.imagen_url ? (
          <img src={obra.imagen_url} alt={obra.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#ddd8d0', position: 'absolute', inset: 0 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 55%)', opacity: hov ? 1 : 0, transition: 'opacity 0.4s' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 24px', transform: hov ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{obra.categoria}</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 2 }}>{obra.titulo}</p>
            {obra.ubicacion && <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>{obra.ubicacion}</p>}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function ObrasClient({ obras = [] }: { obras: any[] }) {
  const [filtro, setFiltro] = useState('Todos')

  // Modelos FURŌ va al FINAL
  const todasLasObras = [...obras, OBRA_MODELOS_FURO]

  const categoriasActivas = [
    'Todos',
    ...Array.from(new Set(todasLasObras.map((o: any) => o.categoria).filter(Boolean)))
      .sort((a: any, b: any) => {
        const ia = ORDEN_CATEGORIAS.indexOf(a)
        const ib = ORDEN_CATEGORIAS.indexOf(b)
        if (ia === -1 && ib === -1) return a.localeCompare(b)
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      })
  ]

  const destacadas = filtro === 'Todos' ? todasLasObras.filter((o: any) => o.destacada) : []
  const filtradas = filtro === 'Todos' ? todasLasObras : todasLasObras.filter((o: any) => o.categoria === filtro)

  return (
    <>
      <style>{`
        .obras-header { padding: 140px 56px 60px; }
        .obras-filtros-wrap { padding: 0 56px 64px; }
        .obras-filtros { display: flex; gap: 8px; flex-wrap: wrap; }
        .obras-grid-pad { padding: 100px 56px; }
        .obras-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
        @media (max-width: 900px) {
          .obras-header { padding: 100px 24px 40px !important; }
          .obras-filtros-wrap { padding: 0 24px 48px !important; }
          .obras-grid-pad { padding: 60px 24px !important; }
          .obras-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .obras-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="obras-header">
        <FadeUp>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 20 }}>Portafolio</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,56px)', fontWeight: 300, lineHeight: 1.05, color: '#141210', marginBottom: 20 }}>Descubre nuestro trabajo</h1>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', maxWidth: 560 }}>
            En FURO asumimos un compromiso con una construccion que se centra en mejorar la calidad de vida, entregando espacios unicos que fomenten el bienestar y la integracion social. Participamos en proyectos para desarrollos inmobiliarios, proyectos comerciales, colegios, escuelas y volumenes que necesiten espacialidad, habitabilidad y eficiencia estructural. Apoyamos la evolucion industrial de la vivienda economica y trabajamos para transformar el deficit habitacional en una oportunidad, con un estandar superior de vivienda economica. Nuestro sistema constructivo, basado en componentes modulares de facil armado, hace posible que todo proyecto e iniciativas de ayuda social como Capilla Pais sean mas eficientes y replicables, fomentando la colaboracion, el sentido de comunidad y la transformacion social a traves de la construccion.
          </p>
        </FadeUp>
      </div>

      <div className="obras-filtros-wrap">
        <FadeUp>
          <div className="obras-filtros">
            {categoriasActivas.map(cat => (
              <button key={cat} onClick={() => setFiltro(cat)} style={{
                padding: '8px 20px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                borderColor: filtro === cat ? '#3a2d5e' : 'rgba(20,18,16,0.2)',
                background: filtro === cat ? '#3a2d5e' : 'transparent',
                color: filtro === cat ? '#fff' : 'rgba(20,18,16,0.6)',
                borderRadius: 4, fontFamily: 'DM Sans, sans-serif',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>
      </div>

      {destacadas.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(20,18,16,0.08)' }}>
          {destacadas.map((obra, i) => (
            <div key={obra._id} style={{ borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
              <ObraDestacada obra={obra} reverse={i % 2 !== 0} />
            </div>
          ))}
        </div>
      )}

      <div className="obras-grid-pad" style={{ background: '#141210' }}>
        {todasLasObras.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: '60px 0' }}>Cargando proyectos...</p>
        ) : (
          <div className="obras-grid">
            {filtradas.map(obra => <ObraCard key={obra._id} obra={obra} />)}
          </div>
        )}
        {todasLasObras.length > 0 && filtradas.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: '60px 0' }}>No hay obras en esta categoria aun.</p>
        )}
      </div>
    </>
  )
}