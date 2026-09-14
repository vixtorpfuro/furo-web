'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const C = { dark: '#141210', off: '#f5f3ee', purpleMid: '#52448a', muted: '#8a8278', border: 'rgba(20,18,16,0.12)' }
const inp: React.CSSProperties = { width: '100%', padding: '13px 16px', fontSize: 14, fontWeight: 300, color: C.dark, fontFamily: 'DM Sans, sans-serif', border: `1px solid ${C.border}`, background: '#fff', outline: 'none', borderRadius: 6 }
const label: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', color: C.muted, display: 'block', marginBottom: 6 }

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setStatus('error')
      setErrorMsg('Completa tu email y contraseña.')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/interno/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'No se pudo iniciar sesión.')
        return
      }
      router.push(searchParams.get('next') || '/interno')
      router.refresh()
    } catch {
      setStatus('error')
      setErrorMsg('No se pudo conectar con el servidor. Intenta de nuevo.')
    }
  }

  return (
    <main style={{ backgroundColor: C.off, color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '48px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');
        *{box-sizing:border-box;}
        input:focus{border-color:${C.purpleMid} !important;}
        input::placeholder{color:#c8c4bc;}
      `}</style>

      <form onSubmit={submit} style={{ maxWidth: 380, width: '100%' }}>
        <img src="/home/Logo-Furo-Negro.png" alt="FURŌ" style={{ height: 32, marginBottom: 24, display: 'block' }} />
        <h1 style={{ fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Ingresar</h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: C.muted, marginBottom: 32 }}>
          USO INTERNO — COMERCIAL FURŌ.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={label}>Email</label>
          <input style={inp} type="email" autoComplete="username" placeholder="tu@furo.company" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={label}>Contraseña</label>
          <input style={inp} type="password" autoComplete="current-password" placeholder="Tu contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        {status === 'error' && (
          <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          style={{ background: C.dark, color: '#fff', border: 'none', padding: '16px 40px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', borderRadius: 6, width: '100%' }}
        >
          {status === 'sending' ? 'Ingresando...' : 'Ingresar →'}
        </button>
      </form>
    </main>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  )
}
