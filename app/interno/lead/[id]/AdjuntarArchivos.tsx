'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const C = { dark: '#141210', muted: '#8a8278', border: 'rgba(20,18,16,0.12)' }

export default function AdjuntarArchivos({ leadId }: { leadId: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const subir = async () => {
    const files = inputRef.current?.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    Array.from(files).forEach(f => formData.append('archivos', f))

    setStatus('sending')
    try {
      const res = await fetch(`/api/interno/lead/${leadId}/archivos`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'No se pudieron subir los archivos.')
        return
      }
      setStatus('idle')
      if (inputRef.current) inputRef.current.value = ''
      router.refresh()
    } catch {
      setStatus('error')
      setErrorMsg('No se pudo conectar con el servidor.')
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={subir}
        disabled={status === 'sending'}
        style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: C.dark }}
      />
      {status === 'sending' && <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Subiendo...</p>}
      {status === 'error' && (
        <div style={{ padding: '12px 16px', background: '#fdf0f0', borderLeft: '3px solid #e05252', marginTop: 12 }}>
          <p style={{ fontSize: 13, color: '#c0392b', margin: 0 }}>{errorMsg}</p>
        </div>
      )}
    </div>
  )
}
