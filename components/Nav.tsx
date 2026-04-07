'use client'
import { useState, useEffect } from 'react'

export default function Nav({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Como funciona', href: '/como-funciona' },
    { label: 'Beneficios', href: '/beneficios' },
    { label: 'Obras', href: '/obras' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <nav style={{ position: 'fixed', top: 36, left: 54, right: 24, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
      <a href="/" style={{ opacity: scrolled ? 0 : 1, transform: scrolled ? 'translateY(-8px)' : 'translateY(0)', transition: 'opacity 0.4s, transform 0.4s', pointerEvents: scrolled ? 'none' : 'auto' }}>
        <img
          src={dark ? '/home/Logo-Furo-Negro.png' : 'https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png'}
          alt="FURO"
          style={{ height: 46, display: 'block', filter: dark ? 'none' : 'brightness(0) invert(1)' }}
        />
      </a>
      <div onMouseLeave={() => setHovered('')} style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 6px', height: 54, boxShadow: '0 2px 16px rgba(0,0,0,0.1)' }}>
        {links.map(item => (
          <a key={item.href} href={item.href} onMouseEnter={() => setHovered(item.href)} style={{ color: hovered && hovered !== item.href ? '#bbb' : '#141210', fontSize: 13, fontWeight: 600, padding: '0 14px', whiteSpace: 'nowrap', textDecoration: 'none', transition: 'color 0.2s' }}>
            {item.label}
          </a>
        ))}
        <a href="/contacto"
          onMouseEnter={e => (e.currentTarget.style.background = '#000')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2c4a3d')}
          style={{ background: '#2c4a3d', color: '#fff', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none', marginLeft: 4, transition: 'background 0.2s' }}>
          Contacto
        </a>
      </div>
    </nav>
  )
}