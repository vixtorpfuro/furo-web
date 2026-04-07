'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const CATEGORIAS = ['Todos', 'Residencial', 'Comercial', 'Educacional', 'Industrial', 'Vivienda Economica', 'Hoteleria']

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

function ObraDestacada({ obra, reverse }: { obra: any, reverse: boolean }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{
      display: 'grid', gridTemplateColumns: reverse ? '1fr 1fr' : '1fr 1fr',
      minHeight: '80vh',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)',
      transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {reverse ? (
        <>
          <div style={{ background: '#fff', padding: '80px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ContenidoObra obra={obra} />
          </div>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <ImagenObra obra={obra} />
          </div>
        </>
      ) : (
        <>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <ImagenObra obra={obra} />
          </div>
          <div style={{ background: '#fff', padding: '80px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ContenidoObra obra={obra} />
          </div>
        </>
      )}
    </div>
  )
}

function ImagenObra({ obra }: { obra: any }) {
  return obra.imagen_url ? (
    <img src={obra.imagen_url} alt={obra.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
  ) : (
    <div style={{ width: '100%', height: '100%', background: '#ddd8d0', position: 'absolute', inset: 0 }} />
  )
}

function ContenidoObra({ obra }: { obra: any }) {
  return (
    <>
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 16 }}>{obra.categoria}</span>
      <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 24 }}>{obra.titulo}</h2>
      {obra.resumen && <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 32 }}>{obra.resumen}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 40px', marginBottom: 40 }}>
        {obra.cliente && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Cliente</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.cliente}</p></div>}
        {obra.arquitecto && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Arquitecto</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.arquitecto}</p></div>}
        {obra.superficie && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Superficie</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.superficie}</p></div>}
        {obra.ubicacion && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Ubicacion</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.ubicacion}</p></div>}
        {obra.anio && <div><p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 4 }}>Año</p><p style={{ fontSize: 14, color: '#141210' }}>{obra.anio}</p></div>}
      </div>
      <Link href={`/obras/${obra.slug?.current || obra._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.3)', paddingBottom: 2, width: 'fit-content' }}>
        Ver proyecto →
      </Link>
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
  const destacadas = obras.filter(o => o.destacada)
  const filtradas = filtro === 'Todos' ? obras : obras.filter(o => o.categoria === filtro)

  return (
    <>
      <div style={{ paddingTop: 140, padding: '140px 56px 80px' }}>
        <FadeUp>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 20 }}>Portafolio</span>
          <h1 style={{ fontSize: 'clamp(42px,6vw,40px)', fontWeight: 300, lineHeight: 1.05, color: '#141210', marginBottom: 20 }}>Descubre nuestro trabajo</h1>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', maxWidth: 560 }}>Proyectos de construccion industrializada en madera laminada a lo largo de Chile.</p>
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

      <div style={{ padding: '100px 56px', background: '#141210' }}>
        <FadeUp>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 56, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {CATEGORIAS.map(cat => (
              <button key={cat} onClick={() => setFiltro(cat)} style={{
                padding: '8px 20px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                borderColor: filtro === cat ? '#fff' : 'rgba(255,255,255,0.2)',
                background: filtro === cat ? '#fff' : 'transparent',
                color: filtro === cat ? '#141210' : 'rgba(255,255,255,0.6)',
                borderRadius: 4, fontFamily: 'DM Sans, sans-serif',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>
        {obras.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: '60px 0' }}>Cargando proyectos...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
            {filtradas.map(obra => <ObraCard key={obra._id} obra={obra} />)}
          </div>
        )}
        {obras.length > 0 && filtradas.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: '60px 0' }}>No hay obras en esta categoria aun.</p>
        )}
      </div>
    </>
  )
}