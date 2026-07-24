// app/noki/page.tsx
'use client'
import { useState, useEffect } from 'react'
import NokiChrome from './shared'

const HERO_IMAGES = [
  '/noki/noki1_hero.jpg',
  '/noki/noki1_hero2.jpg',
  '/noki/noki1_hero3.jpg',
  '/noki/noki1_hero4.jpg',
  '/noki/Modelos/baja/nokiI.jpg',
  '/noki/Modelos/baja/nokiII_65.jpg',
  '/noki/Modelos/baja/nokiII_110.jpg',
  '/noki/Modelos/baja/nokiII_140.jpg',
  '/noki/Modelos/baja/nokiII_160.jpg',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Noki() {
  const [images, setImages] = useState(HERO_IMAGES)
  const [heroImg, setHeroImg] = useState(0)

  // Baraja en el cliente (después del montaje) para no romper la hidratación de SSR.
  useEffect(() => {
    setImages(shuffle(HERO_IMAGES))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [images.length])

  return (
    <NokiChrome showFooter={false}>
      {/* HERO */}
      <section style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
        {images.map((img, i) => (
          <img key={img} src={img} alt="Noki" className="hero-img" style={{ opacity: heroImg === i ? 1 : 0 }} />
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
            {images.map((_, i) => (
              <button key={i} onClick={() => setHeroImg(i)} style={{ width: i === heroImg ? 24 : 6, height: 6, borderRadius: 3, background: i === heroImg ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </section>
    </NokiChrome>
  )
}
