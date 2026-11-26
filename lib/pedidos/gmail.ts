import 'server-only'
import { google, type gmail_v1 } from 'googleapis'

// Acceso a la casilla de FURŌ que recibe los leads de Noki. Usa la misma cuenta de servicio de
// Drive con delegación de dominio (Google Workspace): la cuenta actúa como GMAIL_CASILLA.
// Permisos mínimos: leer correos y crear/enviar borradores. No borra ni mueve correos.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose']

// Avisos que envía Make: "Nuevo lead Noki — …" (campaña Noki) y "Nuevo lead FURŌ — …" (formulario /contacto).
export const ASUNTOS_LEAD = ['Nuevo lead Noki', 'Nuevo lead FURŌ']
const Q_LEADS = '(' + ASUNTOS_LEAD.map((a) => `subject:"${a}"`).join(' OR ') + ')'
const Q_SIN_LEADS = ASUNTOS_LEAD.map((a) => `-subject:"${a}"`).join(' ')

export function casilla() {
  const c = process.env.GMAIL_CASILLA
  if (!c) throw new Error('Falta configurar GMAIL_CASILLA en el servidor.')
  return c
}

function getGmail() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('Falta configurar GOOGLE_SERVICE_ACCOUNT_KEY en el servidor.')
  const key = JSON.parse(raw) as { client_email: string; private_key: string }
  const auth = new google.auth.JWT({ email: key.client_email, key: key.private_key, scopes: SCOPES, subject: casilla() })
  return google.gmail({ version: 'v1', auth })
}

export type Lead = {
  id: string // id del correo "Nuevo lead Noki"
  fecha: string
  nombre: string
  email: string
  celular: string
  modelo: string
  perfil: string
  ubicacion: string
  terreno: string
  plazo: string
  contacto: string
  origen: string
}

export type MensajeHilo = { id: string; threadId: string; de: string; deFuro: boolean; fecha: string; asunto: string; texto: string }

export type Borrador = { id: string; threadId: string; para: string; asunto: string; cuerpo: string }

// ---------- utilidades MIME ----------
const b64 = (s: string) => Buffer.from(s, 'base64url').toString('utf-8')

function cabecera(m: gmail_v1.Schema$Message | undefined, nombre: string) {
  return m?.payload?.headers?.find((h) => h.name?.toLowerCase() === nombre.toLowerCase())?.value ?? ''
}

function cuerpoDe(part: gmail_v1.Schema$MessagePart | undefined, tipo: string): string {
  if (!part) return ''
  if (part.mimeType === tipo && part.body?.data) return b64(part.body.data)
  for (const p of part.parts ?? []) {
    const t = cuerpoDe(p, tipo)
    if (t) return t
  }
  return ''
}

function htmlATexto(html: string) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h\d)>/gi, '\n')
    .replace(/<\/t[dh]>/gi, '\t')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]*\n[ \t\n]*/g, '\n')
    .trim()
}

function textoDe(m: gmail_v1.Schema$Message) {
  const plano = cuerpoDe(m.payload, 'text/plain')
  return plano || htmlATexto(cuerpoDe(m.payload, 'text/html')) || m.snippet || ''
}

// Quita el texto citado de respuestas anteriores ("El ... escribió:", "On ... wrote:", líneas ">").
function sinCitas(t: string) {
  const lineas = t.replace(/\r/g, '').split('\n')
  const fuera: string[] = []
  for (const l of lineas) {
    if (/^\s*>/.test(l)) break
    if (/^(El|On) .{5,200}(escribió|wrote):\s*$/.test(l.trim())) break
    if (/^-{2,}\s*(Mensaje original|Original Message)/i.test(l.trim())) break
    fuera.push(l)
  }
  return fuera.join('\n').trim().slice(0, 6000)
}

const emailDe = (de: string) => (de.match(/<([^>]+)>/)?.[1] ?? de).trim().toLowerCase()

// ---------- leads ----------
const ETIQUETAS: [keyof Lead, string][] = [
  ['nombre', 'Nombre'],
  ['email', 'Email'],
  ['celular', 'Celular'],
  ['modelo', 'Modelo de interés'],
  ['perfil', 'Perfil'],
  ['perfil', 'Soy'], // formulario /contacto (avisos antiguos)
  ['ubicacion', '¿Dónde quiere construir?'],
  ['terreno', '¿Tiene terreno?'],
  ['plazo', '¿En cuánto tiempo piensa construir?'],
  ['plazo', 'Cuándo quiere comenzar'], // formulario /contacto (avisos antiguos)
  ['contacto', 'Cómo contactar'],
  ['origen', 'Cómo conoció FURŌ'],
]

export function parsearLead(texto: string): Partial<Lead> {
  // El aviso de Make trae "EtiquetaValorEtiquetaValor..." con saltos de línea en cualquier parte.
  const plano = texto.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ')
  const out: Partial<Lead> = {}
  const posiciones = ETIQUETAS.map(([k, e]) => ({ k, e, i: plano.indexOf(e) })).filter((p) => p.i >= 0).sort((a, b) => a.i - b.i)
  posiciones.forEach((p, n) => {
    const fin = n + 1 < posiciones.length ? posiciones[n + 1].i : plano.length
    const v = plano.slice(p.i + p.e.length, fin).trim()
    if (v || !out[p.k]) out[p.k] = v
  })
  return out
}

export async function listarLeads(max = 30): Promise<Lead[]> {
  const gmail = getGmail()
  const res = await gmail.users.messages.list({ userId: 'me', q: `${Q_LEADS} newer_than:120d`, maxResults: max })
  const ids = res.data.messages?.map((m) => m.id!).filter(Boolean) ?? []
  const mensajes = await Promise.all(ids.map((id) => gmail.users.messages.get({ userId: 'me', id, format: 'full' })))
  const leads: Lead[] = []
  const vistos = new Set<string>()
  for (const { data: m } of mensajes) {
    const p = parsearLead(textoDe(m))
    const email = (p.email ?? '').toLowerCase()
    if (!email || !email.includes('@') || email.endsWith('@example.com') || vistos.has(email)) continue // duplicados: queda el más reciente
    vistos.add(email)
    leads.push({
      id: m.id!, fecha: new Date(Number(m.internalDate)).toISOString(),
      nombre: p.nombre ?? '', email, celular: p.celular ?? '', modelo: p.modelo ?? '', perfil: p.perfil ?? '',
      ubicacion: p.ubicacion ?? '', terreno: p.terreno ?? '', plazo: p.plazo ?? '', contacto: p.contacto ?? '', origen: p.origen ?? '',
    })
  }
  return leads
}

// ---------- conversación con el cliente ----------
export async function conversacion(email: string): Promise<MensajeHilo[]> {
  const gmail = getGmail()
  const yo = casilla().toLowerCase()
  const res = await gmail.users.threads.list({ userId: 'me', q: `(from:${email} OR to:${email} OR cc:${email}) ${Q_SIN_LEADS}`, maxResults: 5 })
  const hilos = await Promise.all((res.data.threads ?? []).map((t) => gmail.users.threads.get({ userId: 'me', id: t.id!, format: 'full' })))
  const msgs: MensajeHilo[] = []
  for (const { data: h } of hilos) {
    for (const m of h.messages ?? []) {
      if (m.labelIds?.includes('DRAFT')) continue
      const de = cabecera(m, 'From')
      // Solo mensajes que el cliente escribió o recibió: deja fuera respuestas internas del equipo en el mismo hilo.
      const destinatarios = (cabecera(m, 'To') + ',' + cabecera(m, 'Cc')).toLowerCase()
      if (emailDe(de) !== email && !destinatarios.includes(email)) continue
      msgs.push({
        id: m.id!, threadId: m.threadId!, de, deFuro: emailDe(de) === yo || emailDe(de).endsWith('@furo.company'),
        fecha: new Date(Number(m.internalDate)).toISOString(), asunto: cabecera(m, 'Subject'), texto: sinCitas(textoDe(m)),
      })
    }
  }
  return msgs.sort((a, b) => a.fecha.localeCompare(b.fecha))
}

export async function borradoresPara(email: string): Promise<Borrador[]> {
  const gmail = getGmail()
  const res = await gmail.users.drafts.list({ userId: 'me', q: `to:${email}`, maxResults: 5 })
  const out: Borrador[] = []
  for (const d of res.data.drafts ?? []) {
    const { data } = await gmail.users.drafts.get({ userId: 'me', id: d.id!, format: 'full' })
    const m = data.message
    if (!m) continue
    out.push({ id: data.id!, threadId: m.threadId ?? '', para: emailDe(cabecera(m, 'To')), asunto: cabecera(m, 'Subject'), cuerpo: textoDe(m) })
  }
  return out
}

// ---------- crear / enviar borrador ----------
const encabezadoUtf8 = (s: string) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, 'utf-8').toString('base64')}?=`)
const limpiarCabecera = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

function mime(para: string, asunto: string, cuerpo: string, responderA?: { messageId: string; references: string }) {
  const lineas = [
    `From: ${casilla()}`,
    `To: ${limpiarCabecera(para)}`,
    `Subject: ${encabezadoUtf8(limpiarCabecera(asunto))}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
  ]
  if (responderA?.messageId) {
    lineas.push(`In-Reply-To: ${responderA.messageId}`, `References: ${(responderA.references + ' ' + responderA.messageId).trim()}`)
  }
  const cuerpoB64 = Buffer.from(cuerpo, 'utf-8').toString('base64').replace(/(.{76})/g, '$1\r\n')
  return Buffer.from(lineas.join('\r\n') + '\r\n\r\n' + cuerpoB64, 'utf-8').toString('base64url')
}

// Crea (o reemplaza) el borrador para el cliente. Responde en su hilo más reciente si existe.
export async function guardarBorrador(email: string, asunto: string, cuerpo: string, threadId?: string, reemplazarId?: string) {
  const gmail = getGmail()
  let responderA: { messageId: string; references: string } | undefined
  let asuntoFinal = asunto
  if (threadId) {
    const { data: h } = await gmail.users.threads.get({ userId: 'me', id: threadId, format: 'metadata', metadataHeaders: ['Message-ID', 'References', 'Subject'] })
    const ultimo = h.messages?.filter((m) => !m.labelIds?.includes('DRAFT')).at(-1)
    if (ultimo) {
      responderA = { messageId: cabecera(ultimo, 'Message-ID'), references: cabecera(ultimo, 'References') }
      const s = cabecera(ultimo, 'Subject')
      if (s) asuntoFinal = /^re:/i.test(s) ? s : `Re: ${s}`
    }
  }
  const requestBody = { message: { raw: mime(email, asuntoFinal, cuerpo, responderA), threadId: threadId || undefined } }
  const res = reemplazarId
    ? await gmail.users.drafts.update({ userId: 'me', id: reemplazarId, requestBody })
    : await gmail.users.drafts.create({ userId: 'me', requestBody })
  return { id: res.data.id!, threadId: res.data.message?.threadId ?? '', asunto: asuntoFinal }
}

export async function obtenerBorrador(id: string): Promise<Borrador | null> {
  const gmail = getGmail()
  try {
    const { data } = await gmail.users.drafts.get({ userId: 'me', id, format: 'full' })
    const m = data.message
    if (!m) return null
    return { id: data.id!, threadId: m.threadId ?? '', para: emailDe(cabecera(m, 'To')), asunto: cabecera(m, 'Subject'), cuerpo: textoDe(m) }
  } catch {
    return null
  }
}

export async function enviarBorrador(id: string) {
  const gmail = getGmail()
  const res = await gmail.users.drafts.send({ userId: 'me', requestBody: { id } })
  return { id: res.data.id!, threadId: res.data.threadId ?? '' }
}
