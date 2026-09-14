import 'server-only'
import { google } from 'googleapis'

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_COTIZACIONES_FOLDER_ID

function getServiceAccountKey() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('Falta configurar GOOGLE_SERVICE_ACCOUNT_KEY en el servidor.')
  return JSON.parse(raw) as { client_email: string; private_key: string }
}

function getDrive() {
  const key = getServiceAccountKey()
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
  return google.drive({ version: 'v3', auth })
}

function requireRootFolderId() {
  if (!ROOT_FOLDER_ID) throw new Error('Falta configurar GOOGLE_DRIVE_COTIZACIONES_FOLDER_ID en el servidor.')
  return ROOT_FOLDER_ID
}

async function nextFolderNumber(drive: ReturnType<typeof getDrive>, parentId: string): Promise<number> {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(name)',
    pageSize: 1000,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: 'allDrives',
  })
  const numeros = (res.data.files || [])
    .map(f => /^(\d+)\./.exec(f.name || '')?.[1])
    .filter((n): n is string => Boolean(n))
    .map(Number)
  return numeros.length ? Math.max(...numeros) + 1 : 1
}

export async function crearCarpetaProyecto(nombreProyecto: string, nombreCliente: string) {
  const drive = getDrive()
  const parentId = requireRootFolderId()
  const numero = await nextFolderNumber(drive, parentId)
  const nombre = `${numero}. ${nombreProyecto} - ${nombreCliente}`

  const res = await drive.files.create({
    requestBody: {
      name: nombre,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id, name, webViewLink',
    supportsAllDrives: true,
  })

  return { id: res.data.id!, name: res.data.name!, webViewLink: res.data.webViewLink! }
}

export async function subirArchivoACarpeta(folderId: string, nombre: string, mimeType: string, buffer: Buffer) {
  const drive = getDrive()
  const { Readable } = await import('stream')
  const res = await drive.files.create({
    requestBody: { name: nombre, parents: [folderId] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: 'id, name, webViewLink',
    supportsAllDrives: true,
  })
  return { id: res.data.id!, name: res.data.name!, webViewLink: res.data.webViewLink! }
}

export function extraeFolderIdDeUrl(url: string): string | null {
  return /\/folders\/([a-zA-Z0-9_-]+)/.exec(url)?.[1] || null
}

export async function listarArchivosDeCarpeta(folderId: string) {
  const drive = getDrive()
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, webViewLink, iconLink, createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 200,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: 'allDrives',
  })
  return res.data.files || []
}
