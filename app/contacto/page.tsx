'use client'
import { useState, useRef, useEffect } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const WEBHOOK = 'https://hook.us1.make.com/ai9dxmn268e8ibce64gdt7e86bq9fq37'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: `opacity 0.8s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.8s ${delay}s cubic-bezier(0.16,1,0.3,1)` }}>
      {children}
    </div>
  )
}

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', celular: '', soy: '', cuando: '', como_contactar: '', como_conocio: '', mailchimp: false, privacidad: false })
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))
  const submit = async () => {
    if (!form.nombre || !form.apellido || !form.email || !form.celular || !form.soy || !form.cuando || !form.como_contactar || !form.privacidad) { setStatus('error'); return }
    setStatus('sending')
    try {
      const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, fecha: new Date().toLocaleString('es-CL'), fuente: 'furo-web/contacto' }) })
      setStatus(res.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '15px 18px', fontSize: 14, fontWeight: 300, color: '#141210', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(20,18,16,0.12)', background: '#fff', outline: 'none', borderRadius: 0, appearance: 'none' as any }
  const sel: React.CSSProperties = { ...inp, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 18px center', paddingRight: 44, cursor: 'pointer' }
  const label: React.CSSProperties = { fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8278', display: 'block', marginBottom: 8 }

  return (
    <main style={{ backgroundColor: '#f5f3ee', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}a{text-decoration:none;}
        input:focus,select:focus{border-color:#52448a !important;}
        input::placeholder{color:#c8c4bc;}
        .contact-header-pad { padding: 120px 56px 72px; }
        .contact-grid { display: grid; grid-template-columns: 1fr 400px; border-top: 1px solid rgba(20,18,16,0.08); }
        .contact-form-pad { padding: 64px 56px; border-right: 1px solid rgba(20,18,16,0.08); }
        .contact-aside-pad { padding: 64px 48px; background: #fff; }
        .contact-fields-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .contact-ig-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 2px; }
        .contact-ig-pad { padding: 72px 56px 80px; border-top: 1px solid rgba(20,18,16,0.08); }
        @media (max-width: 900px) {
          .contact-header-pad { padding: 100px 24px 48px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-form-pad { padding: 48px 24px !important; border-right: none !important; border-bottom: 1px solid rgba(20,18,16,0.08); }
          .contact-aside-pad { padding: 48px 24px !important; }
          .contact-fields-2col { grid-template-columns: 1fr !important; }
          .contact-ig-grid { grid-template-columns: repeat(3,1fr) !important; }
          .contact-ig-pad { padding: 48px 24px 64px !important; }
        }
        @media (max-width: 480px) {
          .contact-ig-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
      <Nav dark/>

      <div className="contact-header-pad">
        <FadeUp>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 20 }}>Contacto</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,56px)', fontWeight: 300, lineHeight: 1.05, color: '#141210', marginBottom: 40 }}>Hablemos de tu proyecto</h1>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', maxWidth: 640, marginBottom: 16 }}>¿Listo para comenzar con tu proyecto o simplemente quieres mas informacion? Completa el formulario — despues recibiras un correo con:</p>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
            {['Detalles sobre nuestros sistemas constructivos.', 'Una descripcion clara del proceso FURO.', 'Un enlace para agendar una llamada con nuestro equipo (cuando estes listo).'].map(t => (
              <li key={t} style={{ fontSize: 15, fontWeight: 300, color: '#5e5850', lineHeight: 1.7, paddingLeft: 22, position: 'relative', marginBottom: 4 }}>
                <span style={{ position: 'absolute', left: 0, color: '#52448a', fontSize: 12 }}>→</span>{t}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 15, fontWeight: 400, color: '#141210' }}>¡Estamos muy entusiasmados de acompanarte en este camino y no podemos esperar para comenzar!</p>
        </FadeUp>
      </div>

      <div className="contact-grid">
        <div className="contact-form-pad">
          <FadeUp>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 36 }}>Datos de contacto</span>
            <div className="contact-fields-2col">
              <div><label style={label}>Nombre <span style={{ color: '#52448a' }}>*</span></label><input style={inp} placeholder="Tu nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} /></div>
              <div><label style={label}>Apellido <span style={{ color: '#52448a' }}>*</span></label><input style={inp} placeholder="Tu apellido" value={form.apellido} onChange={e => set('apellido', e.target.value)} /></div>
            </div>
            <div className="contact-fields-2col">
              <div><label style={label}>Email <span style={{ color: '#52448a' }}>*</span></label><input style={inp} type="email" placeholder="correo@empresa.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label style={label}>Celular <span style={{ color: '#52448a' }}>*</span></label><input style={inp} placeholder="+56 9 XXXX XXXX" value={form.celular} onChange={e => set('celular', e.target.value)} /></div>
            </div>
            <div style={{ width: '100%', height: 1, background: 'rgba(20,18,16,0.06)', marginBottom: 28 }} />
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 28 }}>Cuentanos un poco mas</span>
            {[
              { key: 'soy', label: 'Soy', req: true, opts: ['Selecciona tu perfil', 'Inmobiliaria', 'Oficina de Arquitectura', 'Constructora', 'Propietario (Quiero construir mi casa)'] },
              { key: 'cuando', label: '¿Cuando quieres comenzar?', req: true, opts: ['Selecciona un plazo', 'Proximos 3 meses', '3 a 6 meses', '6 a 12 meses', '1 ano o mas'] },
              { key: 'como_contactar', label: '¿Como quieres que te contactemos?', req: true, opts: ['Selecciona un medio', 'Email', 'Telefono', 'WhatsApp'] },
              { key: 'como_conocio', label: '¿Como supiste de nosotros?', req: false, opts: ['Selecciona una opcion', 'Referido', 'Redes Sociales', 'Buscadores', 'Pagina Web', 'Ferias'] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 20 }}>
                <label style={label}>{f.label}{f.req && <span style={{ color: '#52448a' }}> *</span>}</label>
                <select style={sel} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}>
                  {f.opts.map(o => <option key={o} value={o === f.opts[0] ? '' : o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ width: '100%', height: 1, background: 'rgba(20,18,16,0.06)', margin: '8px 0 28px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {[
                { key: 'mailchimp', text: 'Quiero recibir contenido sobre construccion industrializada y novedades de FURO.' },
                { key: 'privacidad', text: 'Acepto la politica de privacidad y el uso de mis datos para gestionar mi consulta.' },
              ].map(c => (
                <label key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={(form as any)[c.key]} onChange={e => set(c.key, e.target.checked)} style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, accentColor: '#52448a', cursor: 'pointer' }} />
                  <span style={{ fontSize: 13, fontWeight: 300, color: '#5e5850', lineHeight: 1.55 }}>{c.text}{c.key === 'privacidad' && <span style={{ color: '#52448a' }}> *</span>}</span>
                </label>
              ))}
            </div>
            {status === 'ok' && <div style={{ padding: '20px 24px', background: '#eef4f0', borderLeft: '3px solid #2c4a3d', marginBottom: 20 }}><p style={{ fontSize: 14, fontWeight: 400, color: '#2c4a3d', margin: 0 }}>✓ ¡Gracias! Tu mensaje fue enviado correctamente. Te contactaremos pronto.</p></div>}
            {status === 'error' && <div style={{ padding: '20px 24px', background: '#fdf0f0', borderLeft: '3px solid #e05252', marginBottom: 20 }}><p style={{ fontSize: 14, fontWeight: 400, color: '#c0392b', margin: 0 }}>Por favor completa todos los campos obligatorios.</p></div>}
            <button onClick={submit} disabled={status === 'sending' || status === 'ok'}
              style={{ background: status === 'ok' ? '#2c4a3d' : '#141210', color: '#fff', border: 'none', padding: '18px 48px', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'background 0.25s', display: 'inline-block', marginTop: 4 }}>
              {status === 'sending' ? 'Enviando...' : status === 'ok' ? '✓ Enviado' : 'Enviar consulta →'}
            </button>
            <div style={{ marginTop: 40, padding: '28px 32px', background: '#ece9e3', borderLeft: '3px solid rgba(82,68,138,0.3)' }}>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 10 }}>¿Prefieres no llenar el formulario?</span>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', margin: 0 }}>
                Tambien puedes llamarnos o escribirnos directamente.<br />
                <a href="tel:+56977441963" style={{ color: '#141210', fontWeight: 500 }}>+56 9 7744 1963</a> · <a href="https://wa.me/56977441963" style={{ color: '#141210', fontWeight: 500 }}>WhatsApp</a> · <a href="mailto:contacto@furo.company" style={{ color: '#141210', fontWeight: 500 }}>contacto@furo.company</a>
              </p>
            </div>
          </FadeUp>
        </div>

        <div className="contact-aside-pad">
          <FadeUp delay={0.1}>
            <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid rgba(20,18,16,0.06)' }}>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 18 }}>Oficina comercial</span>
              {[{ icon: '📍', label: 'Direccion', val: 'Suecia 283, Providencia, Santiago, Chile' }, { icon: '📞', label: 'Telefono', val: '+56 9 8413 6893' }, { icon: '✉️', label: 'Email', val: 'contacto@furo.company' }].map(i => (
                <div key={i.label} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 34, height: 34, background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>{i.icon}</div>
                  <div><p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8a8278', marginBottom: 3 }}>{i.label}</p><p style={{ fontSize: 14, fontWeight: 300, color: '#141210' }}>{i.val}</p></div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid rgba(20,18,16,0.06)' }}>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 18 }}>Fabrica</span>
              {[{ icon: '📍', label: 'Direccion', val: 'San Pablo 9490, Pudahuel, Santiago de Chile' }, { icon: '🕐', label: 'Visitas', val: 'Lun – Vie, 9:00 – 17:00\nPrevia coordinacion' }].map(i => (
                <div key={i.label} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 34, height: 34, background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>{i.icon}</div>
                  <div><p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8a8278', marginBottom: 3 }}>{i.label}</p><p style={{ fontSize: 14, fontWeight: 300, color: '#141210', whiteSpace: 'pre-line' }}>{i.val}</p></div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid rgba(20,18,16,0.06)' }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 18 }}>Cotiza directo</span>
              <a href="https://wa.me/56977441963" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '13px 22px', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.525 5.84L.057 23.197a.75.75 0 00.956.899l5.51-1.747A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.497-5.23-1.367l-.374-.213-3.882 1.231 1.102-3.762-.23-.38A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Escribir por WhatsApp
              </a>
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 18 }}>Siguenos</span>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { href: 'https://instagram.com/furo.company', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                  { href: 'https://linkedin.com/company/furōcompany', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" style={{ width: 34, height: 34, background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52448a', transition: 'background 0.2s, color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#52448a'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f5f3ee'; (e.currentTarget as HTMLElement).style.color = '#52448a' }}>
                    {s.svg}
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      <section className="contact-ig-pad">
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 6 }}>Instagram</span>
              <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 300, color: '#141210', margin: 0 }}>@furo.company</h2>
            </div>
            <a href="https://instagram.com/furo.company" target="_blank" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.2)', paddingBottom: 1 }}>Ver perfil →</a>
          </div>
          <div className="contact-ig-grid">
            {[1,2,3,4,5].map(i => (
              <a key={i} href="https://instagram.com/furo.company" target="_blank"
                style={{ aspectRatio: '1', background: '#ddd8d0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(20,18,16,0.25)' }}>Post</span>
              </a>
            ))}
          </div>
        </FadeUp>
      </section>

      <Footer />
    </main>
  )
}