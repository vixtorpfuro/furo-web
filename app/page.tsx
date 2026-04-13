'use client'
import { useState, useEffect, useRef } from 'react'

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