'use client'
import { useState, useEffect } from 'react'

export default function Nav({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { label: 'Como funciona', href: '/como-funciona' },
    { label: 'Beneficios', href: '/beneficios' },
    { label: 'Obras', href: '/obras' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-pill { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-logo { opacity: 1 !important; transform: none !important; pointer-events: auto !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 100 }}>
        <a href="/" className="nav-logo" style={{ opacity: scrolled ? 0 : 1, transform: scrolled ? 'translateY(-8px)' : 'translateY(0)', transition: 'opacity 0.4s, transform 0.4s', pointerEvents: scrolled ? 'none' : 'auto' }}>
          <img
            src={dark ? '/home/Logo-Furo-Negro.png' : 'https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png'}
            alt="FURO"
            style={{ height: 40, display: 'block', filter: dark ? 'none' : 'brightness(0) invert(1)' }}
          />
        </a>

        <div className="nav-pill" onMouseLeave={() => setHovered('')} style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 6px', height: 54, boxShadow: '0 2px 16px rgba(0,0,0,0.1)' }}>
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

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.97)', border: 'none', borderRadius: 10, width: 48, height: 48, cursor: 'pointer', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', flexShrink: 0 }}
          aria-label="Menú">
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#141210', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#141210', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#141210', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </nav>

      <div className="nav-mobile-menu" style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(20,18,16,0.97)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'all' : 'none', transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        {links.map((item, i) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
            style={{ fontSize: 28, fontWeight: 300, color: '#f5f3ee', textDecoration: 'none', padding: '12px 24px', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.4s ${i * 0.06}s, transform 0.4s ${i * 0.06}s cubic-bezier(0.16,1,0.3,1)` }}>
            {item.label}
          </a>
        ))}
        <a href="/contacto" onClick={() => setMenuOpen(false)}
          style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: '#2c4a3d', padding: '14px 36px', marginTop: 16, textDecoration: 'none', borderRadius: 8, opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.4s ${links.length * 0.06}s, transform 0.4s ${links.length * 0.06}s cubic-bezier(0.16,1,0.3,1)` }}>
          Contacto
        </a>
      </div>
    </>
  )
}