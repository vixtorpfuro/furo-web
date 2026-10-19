"""Convierte el HTML publicado en cotizadorfuro.netlify.app en la versión interna de furo-web.

Uso: python3 -I parchar_cotizador.py <index.html original> <salida.html>
Cada reemplazo debe encontrar exactamente una coincidencia; si no, el script falla.
"""
import re
import sys

src, dst = sys.argv[1], sys.argv[2]
html = open(src, encoding='utf-8').read()


def reemplazar(viejo, nuevo, n=1):
    global html
    c = html.count(viejo)
    if c != n:
        sys.exit(f'Esperaba {n} coincidencia(s) y encontré {c}: {viejo[:80]!r}')
    html = html.replace(viejo, nuevo)


def reemplazar_region(inicio, fin, nuevo):
    """Reemplaza desde `inicio` (incluido) hasta `fin` (excluido)."""
    global html
    if html.count(inicio) != 1 or html.count(fin) != 1:
        sys.exit(f'Región ambigua: {inicio[:60]!r} / {fin[:60]!r}')
    a = html.index(inicio)
    b = html.index(fin)
    if b <= a:
        sys.exit(f'Región invertida: {inicio[:60]!r}')
    html = html[:a] + nuevo + html[b:]


# ── <head>: quitar restos de "guardar como", PWA rota y URLs absolutas de Netlify ──
html = re.sub(r'<!-- saved from url=[^>]*-->\n?', '', html)
html = re.sub(r'<!-- This site is hosted on Netlify\..*?-->\n?', '', html, flags=re.S)
reemplazar_region(
    '<!-- ===== PWA: app instalable, offline-capable ===== -->',
    '<style>',
    '<meta name="robots" content="noindex,nofollow">\n'
    '<link rel="icon" type="image/png" href="/icon.png">\n',
)

# ── Librerías servidas desde el propio sitio (SheetJS 0.20.3 corrige CVE-2023-30533 / CVE-2024-22363) ──
reemplazar('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>',
           '<script src="/vendor/cotizador/pdf.min.js"></script>')
reemplazar('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>',
           '<script src="/vendor/cotizador/xlsx.full.min.js"></script>')
reemplazar("pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';",
           "pdfjsLib.GlobalWorkerOptions.workerSrc='/vendor/cotizador/pdf.worker.min.js';")

# ── pdf.js: mitigación oficial de CVE-2024-4367 ──
reemplazar('pdfjsLib.getDocument({data: ab})', 'pdfjsLib.getDocument({data: ab, isEvalSupported: false})')

# ── Quitar configuración de tokens en el navegador (botones y modales) ──
reemplazar('      <button class="btn" onclick="configurarSheet()">⚙ Config Sheet maestro</button>\n', '')
reemplazar('      <button class="btn" onclick="configurarMonday()">⚙ Config Monday</button>\n', '')
reemplazar_region('<!-- Modal Sheet maestro config -->', '<div class="toast" id="toast"></div>', '')

# ── Saneamiento de datos importados / guardados ──
reemplazar(
    "function escapeHtml(s){\n",
    """// Datos importados (Excel/JSON) o leídos de localStorage no son de confianza: se insertan en
// innerHTML y en atributos onclick. Quitamos los caracteres que permiten romper esos contextos y
// solo aceptamos imágenes como data URI de imagen en base64.
const _IMG_DATA_RE=/^data:image\\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\\/=]+$/;
function sanitizarImportado(v, clave){
  if(typeof v==='string'){
    if(clave==='data') return _IMG_DATA_RE.test(v)?v:'';
    return v.replace(/[<>"'`\\\\]/g,'');
  }
  if(typeof v==='number') return Number.isFinite(v)?v:0;
  if(typeof v==='boolean'||v===null) return v;
  if(Array.isArray(v)) return v.map(x=>sanitizarImportado(x));
  if(typeof v==='object'){
    const o={};
    Object.keys(v).forEach(k=>{
      if(k==='__proto__'||k==='constructor'||k==='prototype')return;
      o[sanitizarImportado(k)]=sanitizarImportado(v[k],k);
    });
    return o;
  }
  return undefined;
}

function escapeHtml(s){
""",
)
reemplazar('      const stored=JSON.parse(r.value);\n      if(Array.isArray(stored)&&stored.length>0){',
           '      const stored=sanitizarImportado(JSON.parse(r.value));\n      if(Array.isArray(stored)&&stored.length>0){')
reemplazar('    window._historico=r?JSON.parse(r.value):[];\n',
           '    window._historico=r?sanitizarImportado(JSON.parse(r.value)):[];\n'
           '    if(!Array.isArray(window._historico))window._historico=[];\n')
reemplazar('    const data=JSON.parse(json);\n    if(!Array.isArray(data))throw new Error',
           '    const data=sanitizarImportado(JSON.parse(json));\n    if(!Array.isArray(data))throw new Error')
reemplazar("onclick=\"cargarProyectoHistorico('${h.id}')\"", "onclick=\"cargarProyectoHistorico('${escapeHtml(h.id)}')\"")
reemplazar("onclick=\"eliminarProyectoHistorico('${h.id}')\"", "onclick=\"eliminarProyectoHistorico('${escapeHtml(h.id)}')\"")
reemplazar('<div style="font-family:monospace">${h.layer||\'\'}</div>',
           '<div style="font-family:monospace">${escapeHtml(h.layer||\'\')}</div>')

# ── Correlativo: del JSONP con token en la URL a la API del servidor ──
reemplazar_region(
    '// === CORRELATIVO via JSONP ===',
    'function renderHistorico(){',
    """// === CORRELATIVO ===
// Lo pide el servidor de FURŌ al Sheet maestro; el token del Apps Script no llega al navegador.
async function pedirCorrelativo(){
  const r=await apiCotizador('sheet',{accion:'correlativo'});
  return r.correlativo;
}

""",
)
reemplazar(
    """    const cfg=window._sheetCfg;
    if(cfg && cfg.url && cfg.token){
      showToast('Pidiendo correlativo al Sheet maestro...');
      try {
        numCot = await pedirCorrelativo(cfg.url, cfg.token);""",
    """    {
      showToast('Pidiendo correlativo al Sheet maestro...');
      try {
        numCot = await pedirCorrelativo();""",
)
reemplazar(
    """    } else {
      showToast('Sin config Sheet maestro, guardo sin correlativo','err');
    }
""",
    """    }
""",
)

# ── Sheet maestro y Monday: siempre vía servidor ──
reemplazar_region(
    '// === SHEET MAESTRO (Apps Script webhook) ===',
    'function mostrarErrorMonday(mensaje,raw,colVals){',
    """// === SHEET MAESTRO y MONDAY (vía servidor FURŌ) ===
// Los tokens y la configuración viven en variables de entorno del servidor. El navegador solo
// envía los datos de la cotización y el servidor confirma la escritura.
async function apiCotizador(ruta, body){
  const resp=await fetch('/api/interno/cotizador/'+ruta,{
    method:'POST',
    credentials:'same-origin',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  let data={};
  try{ data=await resp.json(); }catch(e){}
  if(resp.status===401){
    showToast('Tu sesión expiró. Vuelve a ingresar.','err');
    setTimeout(()=>{ location.href='/interno/login?next=/interno/cotizador'; },1500);
    throw new Error('Sesión expirada');
  }
  if(!resp.ok||!data.ok) throw new Error(data.error||('Error '+resp.status));
  return data;
}

async function enviarHistorico(){
  const s=window._snapshot;
  if(!s||!s.totals.gt||s.totals.gt===0){showToast('No hay datos para enviar','err');return;}
  if(!s.meta.proj){showToast('Asigna nombre al proyecto antes de enviar','err');return;}

  if(s.totals.montajeAlerta){
    if(!confirm(`⚠ ALERTA: GG+Utilidades del montaje superan el 25% de (Estructuras + Montaje base).\\n\\n¿Continuar y enviar de todos modos al Sheet maestro?`))return;
  }

  if(!confirm(`Enviar al Sheet maestro?\\n\\nProyecto: ${s.meta.proj}\\nCliente: ${s.meta.cliente}\\nUF total (neto, sin IVA): ${FMT(s.totals.gtNeto,2)}\\nm²: ${FMT(s.totals.tm2,1)}\\nm³: ${FMT(s.totals.totalM3||0,3)}\\n\\nEsta acción agrega una fila al Sheet.`))return;

  const datos={
    fecha: new Date().toLocaleDateString('es-CL'),
    numCotizacion: s.meta.numCotizacion || '',
    proyecto: s.meta.proj || '',
    cliente: s.meta.cliente || '',
    etapa: s.meta.etapaLbl || '',
    capa: 'Capa '+s.totals.layer+' — '+(LAYERS[s.totals.layer]||''),
    tipoProyecto: tipoLabel(),
    proveedor: provLabel(),
    margen: Math.round(mgn()*100)+'%',
    numVolumenes: s.totals.volumes || 0,
    supM2: R2(s.totals.tm2,2),
    mlTotal: R2(s.totals.totalML,2),
    m3Madera: R2(s.totals.totalM3||0,3),
    ufTotal: R2(s.totals.gtNeto,2),
    ufPorM2: s.totals.tm2>0 ? R2(s.totals.gtNeto/s.totals.tm2,3) : '',
    mlPorM2: s.totals.tm2>0 ? R2(s.totals.totalML/s.totals.tm2,2) : '',
    m3PorM2: s.totals.tm2>0 ? R2((s.totals.totalM3||0)/s.totals.tm2,4) : '',
    notas: s.meta.notas || ''
  };

  showToast('Enviando al Sheet maestro...');
  try {
    const r=await apiCotizador('sheet',{accion:'registrar',datos});
    showToast(r.confirmado
      ? `✓ Registrado en el Sheet: ${s.meta.proj}`
      : `Enviado: ${s.meta.proj}. El Sheet no confirmó la fila; verifícalo.`, r.confirmado?undefined:'err');
  } catch(e){
    showToast('✗ '+e.message,'err');
  }
}

async function enviarMonday(){
  const s=window._snapshot;
  if(!s||!s.totals.gt||s.totals.gt===0){showToast('No hay datos para enviar','err');return;}
  if(!s.meta.proj){showToast('Asigna nombre al proyecto antes de enviar','err');return;}

  if(!confirm(`Enviar a Monday?\\n\\nProyecto: ${s.meta.proj}\\nCliente: ${s.meta.cliente}\\nUF total (neto, sin IVA): ${FMT(s.totals.gtNeto,2)}\\nm²: ${FMT(s.totals.tm2,1)}\\nEtapa: ${s.meta.etapaLbl}`))return;

  const datos={
    proyecto: s.meta.proj || '',
    cliente: s.meta.cliente || '',
    etapa: s.meta.etapaLbl || '',
    ufNeto: R2(s.totals.gtNeto,2),
    m2: R2(s.totals.tm2,1)
  };

  try {
    const r=await apiCotizador('monday',datos);
    showToast(`Enviado a Monday — item #${r.itemId}`);
  } catch(e){
    mostrarErrorMonday(e.message,{error:e.message},datos);
  }
}

""",
)

# ── init: ya no hay config local; borrar tokens que hayan quedado de versiones anteriores ──
reemplazar('  await cargarMondayCfg();\n  await cargarSheetCfg();\n',
           "  try{ localStorage.removeItem('furo_sheet_cfg'); localStorage.removeItem('furo_monday_cfg'); }catch(e){}\n")

# ── Service worker inexistente (404) ──
html, n = re.subn(r"// === PWA: registrar service worker.*?\n\}\n", '', html, flags=re.S)
if n != 1:
    sys.exit(f'Bloque service worker: {n} coincidencias')

# ── Comprobaciones finales ──
for prohibido in ['cotizadorfuro.netlify.app', 'src="https://cdnjs', 'api.monday.com', '_sheetCfg',
                  '_mondayCfg', 'serviceWorker', 'sh_token', 'md_token', 'enviarPorFormulario']:
    if prohibido in html:
        sys.exit(f'Quedó una referencia a {prohibido!r}')

open(dst, 'w', encoding='utf-8').write(html)
print('OK', len(html), 'bytes')
