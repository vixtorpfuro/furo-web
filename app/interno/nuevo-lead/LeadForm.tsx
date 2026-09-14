'use client'
import { useState, useRef } from 'react'

const SOY_OPTS = ['Inmobiliaria', 'Oficina de Arquitectura', 'Constructora', 'Propietario (Quiero construir mi casa)']
const CUANDO_OPTS = ['Próximos 3 meses', '3 a 6 meses', '6 a 12 meses', '1 año o más']
const CONTACTAR_OPTS = ['Teléfono', 'WhatsApp', 'Email']
const CONOCIO_OPTS = ['Referido', 'Redes Sociales', 'Página Web', 'Buscadores', 'Ferias', 'CChC', 'Edifica', 'Campaña Arq. y Const.']
const TIPO_PROYECTO_OPTS = ['Casa particular', 'Casa cliente directo', 'Casa  noki', 'Ampliación', 'Conjunto de viviendas', 'Desarrollador Inmobiliario', 'Vivienda social', 'Edificio', 'Oficinas', 'Centro comercial', 'Hotelería', 'Restaurantes', 'Colegio/Universidad', 'Construcción del estado', 'Obra gruesa', 'Obra gruesa montada', 'Obra gruesa + Asesoria', 'Construcción obra completa', 'Otros']
const SERVICIO_FURO_OPTS = ['Casa con Arquitectura', 'Casa cliente directo', 'Casa  noki', 'Ampliación', 'Conjunto de viviendas', 'Desarrollador Inmobiliario', 'Vivienda social', 'Edificio', 'Oficinas', 'Centro comercial', 'Hotelería', 'Restaurantes', 'Colegio/Universidad', 'Construcción del estado', 'Obra gruesa', 'Obra gruesa montada', 'Obra gruesa + Asesoria', 'Construcción obra completa', 'Otros']
const SEGMENTO_OPTS = ['B2B', 'B2C', 'Municipios/ Público']
const MODALIDAD_OPTS = ['Presencial', 'Online']

const initialForm = {
  nombre: '', email: '', telefono: '', empresa: '', direccion: '', nombreProyecto: '',
  soy: '', cuando: '', comoContactar: '', comoConocio: '', tipoProyecto: '',
  servicioFuro: '', segmento: '', m2: '', comentarios: '',
  modalidad: '', fechaReunion: '', notasReunion: '', proximosPasos: '', linkReunion: '',
}

export default function LeadForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [carpeta, setCarpeta] = useState<{ url: string; nombre: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.nombre || (!form.email && !form.telefono)) {
      setStatus('error')
      setErrorMsg('Completa el nombre y al menos un dato de contacto.')
      return
    }
    if (!form.nombreProyecto) {
      setStatus('error')
      setErrorMsg('El nombre del proyecto es obligatorio (se usa para crear la carpeta en Drive).')
      return
    }
    setStatus('sending')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      Array.from(fileInputRef.current?.files || []).forEach(f => formData.append('archivos', f))

      const res = await fetch('/api/lead-interno', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Ocurrió un error. Intenta de nuevo.')
        return
      }
      setStatus('ok')
      setCarpeta(data.carpeta || null)
      setForm(initialForm)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setStatus('error')
      setErrorMsg('No se pudo conectar con el servidor. Intenta de nuevo.')
    }
  }

  const C = { dark: '#141210', purpleMid: '#52448a', muted: '#8a8278', border: 'rgba(20,18,16,0.12)' }
  const inp: React.CSSProperties = { width: '100%', padding: '13px 16px', fontSize: 14, fontWeight: 300, color: C.dark, fontFamily: 'DM Sans, sans-serif', border: `1px solid ${C.border}`, background: '#fff', outline: 'none', borderRadius: 6 }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer', appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }
  const label: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', color: C.muted, display: 'block', marginBottom: 6 }
  const field = (children: React.ReactNode) => <div style={{ marginBottom: 20 }}>{children}</div>

  return (
    <>
      <h1 style={{ fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Nuevo lead</h1>
      <p style={{ fontSize: 14, fontWeight: 300, color: C.muted, marginBottom: 32 }}>
        Al enviar, se crea el ítem en el tablero <strong>Leads</strong> del CRM y una carpeta de antecedentes en Drive.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Nombre completo del lead *</label>
          <input style={inp} placeholder="Nombre y apellido" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </>)}
        {field(<>
          <label style={label}>Nombre del proyecto *</label>
          <input style={inp} placeholder="Ej: Casa Lago Todos Los Santos" value={form.nombreProyecto} onChange={e => set('nombreProyecto', e.target.value)} />
        </>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Email {!form.telefono && '*'}</label>
          <input style={inp} type="email" placeholder="correo@empresa.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </>)}
        {field(<>
          <label style={label}>Teléfono {!form.email && '*'}</label>
          <input style={inp} placeholder="+56 9 XXXX XXXX" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
        </>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Empresa</label>
          <input style={inp} placeholder="Nombre de la empresa (si aplica)" value={form.empresa} onChange={e => set('empresa', e.target.value)} />
        </>)}
        {field(<>
          <label style={label}>Ubicación del proyecto</label>
          <input style={inp} placeholder="Dirección o comuna" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
        </>)}
      </div>

      <div style={{ height: 1, background: C.border, margin: '8px 0 28px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Soy</label>
          <select style={sel} value={form.soy} onChange={e => set('soy', e.target.value)}>
            <option value="">Selecciona</option>
            {SOY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
        {field(<>
          <label style={label}>¿Cuándo quiere comenzar?</label>
          <select style={sel} value={form.cuando} onChange={e => set('cuando', e.target.value)}>
            <option value="">Selecciona</option>
            {CUANDO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>¿Cómo quiere que lo contactemos?</label>
          <select style={sel} value={form.comoContactar} onChange={e => set('comoContactar', e.target.value)}>
            <option value="">Selecciona</option>
            {CONTACTAR_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
        {field(<>
          <label style={label}>¿Cómo supo de nosotros?</label>
          <select style={sel} value={form.comoConocio} onChange={e => set('comoConocio', e.target.value)}>
            <option value="">Selecciona</option>
            {CONOCIO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Tipo de proyecto</label>
          <select style={sel} value={form.tipoProyecto} onChange={e => set('tipoProyecto', e.target.value)}>
            <option value="">Selecciona</option>
            {TIPO_PROYECTO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
        {field(<>
          <label style={label}>Servicio FURŌ</label>
          <select style={sel} value={form.servicioFuro} onChange={e => set('servicioFuro', e.target.value)}>
            <option value="">Selecciona</option>
            {SERVICIO_FURO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Segmento</label>
          <select style={sel} value={form.segmento} onChange={e => set('segmento', e.target.value)}>
            <option value="">Selecciona</option>
            {SEGMENTO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
        {field(<>
          <label style={label}>M² aproximados</label>
          <input style={inp} type="number" placeholder="Ej: 180" value={form.m2} onChange={e => set('m2', e.target.value)} />
        </>)}
      </div>

      {field(<>
        <label style={label}>Comentarios</label>
        <textarea style={{ ...inp, minHeight: 90, resize: 'vertical' as const }} placeholder="Notas de contexto adicionales..." value={form.comentarios} onChange={e => set('comentarios', e.target.value)} />
      </>)}

      <div style={{ height: 1, background: C.border, margin: '8px 0 28px' }} />
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Reunión</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {field(<>
          <label style={label}>Modalidad</label>
          <select style={sel} value={form.modalidad} onChange={e => set('modalidad', e.target.value)}>
            <option value="">Selecciona</option>
            {MODALIDAD_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </>)}
        {field(<>
          <label style={label}>Fecha de la reunión</label>
          <input style={inp} type="date" value={form.fechaReunion} onChange={e => set('fechaReunion', e.target.value)} />
        </>)}
      </div>

      {form.modalidad === 'Online' && field(<>
        <label style={label}>Link de la reunión (Meet/Calendar)</label>
        <input style={inp} placeholder="https://meet.google.com/..." value={form.linkReunion} onChange={e => set('linkReunion', e.target.value)} />
      </>)}

      {field(<>
        <label style={label}>Resumen / notas de la reunión</label>
        <textarea style={{ ...inp, minHeight: 90, resize: 'vertical' as const }} placeholder="Qué se conversó..." value={form.notasReunion} onChange={e => set('notasReunion', e.target.value)} />
      </>)}

      {field(<>
        <label style={label}>Próximos pasos</label>
        <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' as const }} placeholder="Qué se acordó como siguiente paso y con quién queda..." value={form.proximosPasos} onChange={e => set('proximosPasos', e.target.value)} />
      </>)}

      {field(<>
        <label style={label}>Antecedentes (planos, fotos, cotizaciones...)</label>
        <input ref={fileInputRef} type="file" multiple style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: C.dark, width: '100%' }} />
        <p style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Se guardan en la carpeta del proyecto en Drive. Si la reunión fue online y grabaste con Gemini, sube la grabación desde el detalle del lead una vez creado.</p>
      </>)}

      {status === 'ok' && (
        <div style={{ padding: '16px 18px', background: '#eef4f0', borderLeft: '3px solid #2c4a3d', marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: '#2c4a3d', margin: 0 }}>✓ Lead creado en Monday.</p>
          {carpeta && (
            <p style={{ fontSize: 14, color: '#2c4a3d', margin: '6px 0 0' }}>
              Carpeta en Drive: <a href={carpeta.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2c4a3d' }}>{carpeta.nombre} ↗</a>
            </p>
          )}
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252', marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{errorMsg}</p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={status === 'sending'}
        style={{ background: C.dark, color: '#fff', border: 'none', padding: '16px 40px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', borderRadius: 6, width: '100%' }}
      >
        {status === 'sending' ? 'Enviando...' : 'Crear lead en Monday →'}
      </button>
    </>
  )
}
