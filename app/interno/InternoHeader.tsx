'use client'
import { useRouter } from 'next/navigation'

const C = { dark: '#141210', muted: '#8a8278', border: 'rgba(20,18,16,0.12)' }

export default function InternoHeader({ nombre }: { nombre: string }) {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/interno/logout', { method: 'POST' })
    router.push('/interno/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
      <img src="/home/Logo-Furo-Negro.png" alt="FURŌ" style={{ height: 28, display: 'block' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
        <span style={{ color: C.muted }}>{nombre}</span>
        <button onClick={logout} style={{ background: 'none', border: 'none', color: C.dark, textDecoration: 'underline', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', padding: 0 }}>
          Salir
        </button>
      </div>
    </div>
  )
}
