class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = {
      vista: 'portada', rol: 0, rolAbierto: false,
      subPed: 'lista', split: false, filtro: -1, ped: 1, iter: {},
      p3d: 0, lod: 300, fam: null,
      subCot: 'res', alcance: 3,
      verif: {}, calcValidado: false,
      qc: {}, qcOk: false,
      cam: 1, slot: null,
      preg: 0, planModo: 0, aprob: {}, accExtra: {}
    };
  }

  renderVals() {
    const st = this.state;
    const go = (v, extra) => () => this.setState(Object.assign({ vista: v, rolAbierto: false }, extra || {}));
    const noop = () => {};
    const chip = (bg, fg) => 'display:inline-block;justify-self:start;align-self:center;white-space:nowrap;font-size:11px;padding:3px 9px;border-radius:99px;background:' + bg + ';color:' + fg;
    const pill = (on) => 'border:none;border-radius:9px;padding:8px 14px;font-size:13px;cursor:pointer;min-height:36px;background:' + (on ? '#141210' : 'transparent') + ';color:' + (on ? '#fff' : '#141210');
    const fmt = (n) => Math.round(n).toLocaleString('es-CL');
    const cel = (c) => typeof c === 'string' || typeof c === 'number'
      ? { t: String(c), s: 'min-width:0;overflow:hidden;text-overflow:ellipsis' }
      : { t: c.t, s: c.chip ? chip(c.chip[0], c.chip[1]) : ('min-width:0;' + (c.s || '')) };
    const tabla = (cols, widths, filas, minw) => ({
      wrap: 'overflow-x:auto', inner: 'min-width:' + (minw || 560) + 'px',
      cab: 'display:grid;grid-template-columns:' + widths + ';gap:10px;padding:10px 18px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8278;border-bottom:1px solid rgba(20,18,16,0.08)',
      cols,
      filas: filas.map(f => ({
        celdas: f.c.map(cel), pick: f.pick || noop,
        estilo: 'display:grid;grid-template-columns:' + widths + ';gap:10px;padding:11px 18px;font-size:13px;align-items:center;border-bottom:1px solid rgba(20,18,16,0.05);' + (f.sel ? 'background:#f3f0fa;' : '') + (f.pick ? 'cursor:pointer;' : '') + (f.dim ? 'opacity:0.4;' : '')
      }))
    });

    // ---------- servicios ----------
    const SERV = [
      { t: 'Estructuras', c: ['#efe7da', '#6e5131'] },
      { t: 'Estructuras térmicas', c: ['#e5efe6', '#2f6f48'] },
      { t: 'Térmicas + envolvente', c: ['#e8e4f4', '#3a2d5e'] },
      { t: 'Obra completa', c: ['#141210', '#f5f3ee'] }
    ];

    // ---------- roles ----------
    const ROLES = [
      { nombre: 'Administrador', ini: 'A', alcance: 'Todo + usuarios y permisos', acc: null, admin: true },
      { nombre: 'Gerencia', ini: 'G', alcance: 'Todas las secciones', acc: ['portada', 'pedidos', '3d', 'cotizaciones', 'calculo', 'fabricacion', 'logistica', 'montaje', 'planificacion', 'venta'] },
      { nombre: 'Comercial', ini: 'C', alcance: 'Pedidos, cotizaciones y venta', acc: ['portada', 'pedidos', 'cotizaciones', 'planificacion', 'venta'] },
      { nombre: 'Proyecto y dibujo', ini: 'P', alcance: 'Pedidos, 3D, cotización, cálculo', acc: ['portada', 'pedidos', '3d', 'cotizaciones', 'calculo', 'fabricacion', 'planificacion'] },
      { nombre: 'Calculista externo', ini: 'K', alcance: 'Solo cálculo y modelo 3D', acc: ['calculo', '3d'] },
      { nombre: 'Fábrica', ini: 'F', alcance: 'Fabricación, logística, plan', acc: ['fabricacion', 'logistica', 'planificacion'] },
      { nombre: 'Obra y montaje', ini: 'O', alcance: 'Montaje y despachos', acc: ['montaje', 'logistica'] }
    ];
    ROLES.forEach((r, i) => { if (r.acc) { const ex = st.accExtra[i] || {}; r.acc = r.acc.filter(v => ex[v] !== false).concat(Object.keys(ex).filter(v => ex[v] === true && r.acc.indexOf(v) < 0)); } });
    const rol = ROLES[st.rol];
    const puede = (v) => !rol.acc || rol.acc.indexOf(v) >= 0;
    const roles = ROLES.map((r, i) => ({
      nombre: r.nombre, alcance: r.alcance,
      pick: () => { const v = (!r.acc || r.acc.indexOf(st.vista) >= 0) ? st.vista : r.acc[0]; this.setState({ rol: i, rolAbierto: false, vista: v }); },
      estilo: 'display:block;width:100%;text-align:left;border:none;border-radius:8px;padding:8px 10px;cursor:pointer;color:#f5f3ee;background:' + (i === st.rol ? '#3a2d5e' : 'transparent')
    }));

    // ---------- navegación ----------
    const NAV = [
      ['portada', 'Portada', 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', ''],
      ['pedidos', 'Pedidos', 'M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z', '6'],
      ['3d', '3D FURŌ', 'M12 2l9 5v10l-9 5-9-5V7zM12 22V12M21 7l-9 5-9-5', ''],
      ['cotizaciones', 'Cotizaciones', 'M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6', '3'],
      ['calculo', 'Cálculo', 'M3 7h18M3 17h18M7 7l5 10 5-10', '2'],
      ['fabricacion', 'Fabricación', 'M3 21V10l5 3V10l5 3V10l5 3V4h3v17z', ''],
      ['logistica', 'Logística', 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 18a1.5 1.5 0 1 0 0 .01M17 18a1.5 1.5 0 1 0 0 .01', '1'],
      ['montaje', 'Montaje', 'M6 21V3h2l12 4H8M4 21h6M16 7v6', ''],
      ['planificacion', 'Planificación', 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4', ''],
      ['venta', 'Venta', 'M4 20V10M10 20V4M16 20v-7M21 20H3', ''],
      ['accesos', 'Usuarios y accesos', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4', '']
    ];
    const nav = NAV.map(n => {
      const on = st.vista === n[0], ok = n[0] === 'accesos' ? !!rol.admin : puede(n[0]);
      return {
        nombre: n[1], icon: n[2], badge: ok ? n[3] : '🔒', actual: on ? 'page' : 'false',
        pick: go(n[0]),
        estilo: 'display:flex;align-items:center;gap:12px;width:100%;border:none;border-radius:10px;padding:10px 12px;font-size:14px;cursor:pointer;text-align:left;min-height:40px;color:' + (on ? '#141210' : '#d9d4ca') + ';background:' + (on ? '#f5f3ee' : 'transparent') + ';opacity:' + (ok ? 1 : 0.45),
        badgeEst: (ok && n[3]) ? 'font-size:11px;min-width:20px;text-align:center;padding:1px 6px;border-radius:99px;background:' + (on ? '#3a2d5e' : '#3a2d5e') + ';color:#fff' : 'font-size:11px'
      };
    });
    const conexiones = [['WhatsApp Business', 'activo', '#3d8b5a'], ['proyectos@furo.company', 'activo', '#3d8b5a'], ['Revit · PC FURŌ-01', 'en línea', '#3d8b5a'], ['SAP2000 / Robot', 'parcial', '#d9822b']]
      .map(c => ({ nombre: c[0], estado: c[1], punto: 'width:7px;height:7px;border-radius:50%;background:' + c[2] }));

    const TIT = { portada: ['FURŌ OS · martes 24 de noviembre', 'Centro de operaciones'], pedidos: ['Ingreso', 'Pedidos'], '3d': ['Modelo', '3D FURŌ'], cotizaciones: ['Comercial', 'Cotizaciones'], calculo: ['Ingeniería', 'Cálculo estructural'], fabricacion: ['Planta Pudahuel', 'Fabricación'], logistica: ['Despacho', 'Logística'], montaje: ['Obra', 'Montaje'], planificacion: ['Área de proyectos', 'Planificación'], venta: ['Finanzas', 'Venta'], accesos: ['Administración', 'Usuarios y accesos'] };
    const ok = st.vista === 'accesos' ? !!rol.admin : puede(st.vista);
    const V = (v) => ok && st.vista === v;

    // ---------- PORTADA ----------
    const PIN = [
      [557, 81, 'PLANTA PUDAHUEL', '3 de 4 mesas activas · 61 % del plan', '#52448a', 'fabricacion'],
      [702, 314, 'CAMIÓN 2 · EN RUTA', 'Colonia Suiza · llega mañana 09:00', '#c08a3e', 'logistica'],
      [517, 282, 'COLONIA SUIZA · MONTAJE', 'Día 4 de 7 · 62 % montado', '#6f9a72', 'montaje'],
      [700, 396, 'LAS PALMAS · ESTRUCTURA', 'Lista para envolvente', '#8b7fc0', 'planificacion'],
      [883, 286, 'NOKI II · ENTREGADA', 'Recepción final 18-11', '#141210', 'venta']
    ];
    const pins = PIN.map(p => {
      const w = Math.round(Math.max(p[2].length * 6.8, p[3].length * 5.7) + 38);
      const lx = p[0] - 16, ly = p[1] - 66;
      return { etq: 'position:absolute;cursor:pointer;text-align:left;white-space:nowrap;background:rgba(251,250,247,0.95);border:1px solid ' + p[4] + '80;border-radius:9px;padding:5px 10px;color:#141210;font:inherit;box-shadow:0 4px 14px rgba(20,18,16,0.08);left:' + ((lx + 40) / 12) + '%;top:' + ((ly - 6) / 6) + '%', dot: 'position:absolute;left:9px;top:10px;width:7px;height:7px;border-radius:50%;background:' + p[4], x: p[0], y: p[1], ly2: ly + 38, lx, ly, w, dx: lx + 14, dy: ly + 13, tx: lx + 24, ty1: ly + 16, ty2: ly + 30, t1: p[2], t2: p[3], col: p[4], pick: go(p[5]) };
    });
    const atencion = [
      ['Andrea M. no ha dado su correo', 'WhatsApp · el agente lo pide de nuevo hoy', go('pedidos', { subPed: 'wa', ped: 4, split: false })],
      ['Coyhaique: vano de 7,20 m en V2', 'Cálculo espera decisión de arquitectura', go('calculo')],
      ['Laminada 40×185 bajo stock', 'Fábrica · 96 ml, se necesitan 176 ml', go('fabricacion')]
    ].map(a => ({ t: a[0], d: a[1], pick: a[2], estilo: 'text-align:left;border:none;background:rgba(255,255,255,0.75);border-radius:12px;padding:10px 12px;cursor:pointer;color:#141210;border-left:3px solid #c0563e' }));
    const leyenda = [['Pedidos y diseño', '#8b7fc0'], ['Fábrica', '#52448a'], ['Despacho', '#c08a3e'], ['Montaje', '#6f9a72']]
      .map(l => ({ t: l[0], punto: 'width:8px;height:8px;border-radius:50%;background:' + l[1] }));
    const seg = (arr) => arr.map(a => 'flex:' + a[0] + ';background:' + a[1]);
    const kpis = [
      { t: 'Pedidos activos', v: '6', u: 'nuevos', d: 'por servicio: 2 · 1 · 2 · 1', seg: seg([[2, '#d8b98d'], [1, '#9cc39f'], [2, '#8b7fc0'], [1, '#141210']]), pick: go('pedidos') },
      { t: 'En cotización', v: '14.230', u: 'UF', d: '5 propuestas · 2 vistas esta semana', seg: seg([[5, '#52448a'], [2, '#ece9e2']]), pick: go('cotizaciones') },
      { t: 'En fábrica', v: '412', u: 'm²', d: '3 proyectos · 61 % de avance', seg: seg([[61, '#52448a'], [39, '#ece9e2']]), pick: go('fabricacion') },
      { t: 'Facturado 2026', v: '18.940', u: 'UF', d: '92 % de lo estimado a la fecha', seg: seg([[92, '#3a2d5e'], [8, '#ece9e2']]), pick: go('venta') }
    ];
    const flujo = [['01', 'Pedidos', '6', '2 sin correo', 'pedidos'], ['02', 'Análisis', '3', 'Coyhaique REV03', 'pedidos'], ['03', 'Cotización', '5', '14.230 UF', 'cotizaciones'], ['04', 'Cálculo', '2', '1 en iteración', 'calculo'], ['05', 'Fábrica', '3', '4 mesas', 'fabricacion'], ['06', 'Despacho', '4', 'camiones', 'logistica'], ['07', 'Montaje', '1', 'Colonia Suiza', 'montaje']]
      .map(f => ({ n: f[0], t: f[1], v: f[2], d: f[3], pick: f[4] === 'pedidos' && f[0] === '02' ? go('pedidos', { subPed: 'analisis', split: false }) : go(f[4]) }));
    const APR = [
      ['PEDIDOS', 'Responder a Raúl Vargas con el análisis REV03', 'Agente · borrador', go('pedidos', { subPed: 'mail', ped: 1, split: false })],
      ['COTIZACIÓN', 'Propuesta Casa Coyhaique · Obra completa 12.986 UF', 'Comercial', go('cotizaciones', { subCot: 'link' })],
      ['FÁBRICA', 'Liberar Camión 2 a obra (QC 22/22 piezas)', 'Jefe de planta', go('logistica', { cam: 1 })]
    ];
    const aprobaciones = APR.map((a, i) => {
      const hecho = !!st.aprob[i];
      return { area: a[0], t: a[1], quien: a[2], ver: a[3], pend: !hecho, hecho,
        ok: () => this.setState({ aprob: Object.assign({}, st.aprob, { [i]: true }) }),
        caja: 'padding:12px;border-radius:12px;background:' + (hecho ? '#eef5ef' : '#fbf6ec') + ';border:1px solid ' + (hecho ? '#cfe3d4' : '#efdcb9') };
    });

    // ---------- PEDIDOS ----------
    const PED = [
      { cod: 'P-2611-014', cliente: 'Camila Rojas', perfil: 'Propietaria', serv: 2, canal: 'Formulario', lugar: 'Pucón', m2: 150, info: [1, 1, 1, 1, 1, 0, 0, 0], prob: 55, fab: 'Sem. 10 · mar 2027', email: 'camila.rojas@correo.cl', asunto: 'Casa en Pucón · térmicas con envolvente', hora: '09:12', tieneMail: true,
        mail: [['Camila Rojas', '09:12', 'Hola, adjunto el anteproyecto de nuestra casa en Pucón (150 m²). Nos interesa dejarla cerrada con ventanas.']],
        wa: [], borrador: 'Hola Camila, gracias por los planos. Para avanzar con el análisis de modulación nos falta saber si el terreno tiene factibilidad de agua y luz, y si ya tienen arquitecto patrocinante. ¿Agendamos 30 min esta semana?' },
      { cod: 'P-2611-012', cliente: 'Raúl Vargas', perfil: 'Propietario', serv: 1, canal: 'WhatsApp → mail', lugar: 'Coyhaique', m2: 392, info: [1, 1, 1, 1, 1, 1, 0, 1], prob: 68, fab: 'Sem. 5 · feb 2027', email: 'raul.vargas@correo.cl', asunto: 'Casa Coyhaique · análisis de modulación REV03', hora: 'ayer', tieneMail: true,
        mail: [['Raúl Vargas', '20-11 10:05', 'Les envío el DWG de la vivienda, cabañas y quincho. Queremos partir en marzo.'], ['Victor (FURŌ)', '21-11 16:30', 'Raúl, adjunto la REV02 del análisis. La cabaña y el quincho son directos; la vivienda requiere ajustar largos.'], ['Raúl Vargas', '23-11 19:48', '¿Se puede mantener el ventanal del living? Es lo que más nos importa.']],
        wa: [['u', 'Hola, quiero cotizar una casa en Coyhaique'], ['b', '¡Hola! ¿Qué servicio necesitas y cuántos m² aprox.?'], ['u', 'Estructuras térmicas, como 390 m² con cabañas'], ['b', 'Para enviarte el análisis, ¿me compartes tu correo?'], ['u', 'raul.vargas@correo.cl'], ['b', 'Listo, seguimos por correo ✉️']],
        borrador: 'Raúl, sí: el ventanal del living se puede mantener con un vano estructural de 7,20 m y una viga colectora embutida, que debe verificar el calculista. La alternativa sin riesgo son 3 vanos de 1,16 m. Te adjunto la REV03 con ambas opciones.' },
      { cod: 'P-2611-011', cliente: 'Arquitectos Sur', perfil: 'Oficina de arquitectura', serv: 0, canal: 'Correo', lugar: 'Puerto Varas', m2: 210, info: [1, 1, 1, 1, 1, 1, 1, 0], prob: 74, fab: 'Sem. 3 · ene 2027', email: 'contacto@arquitectossur.cl', asunto: 'Estructura casa Loteo Los Alerces', hora: 'lun', tieneMail: true,
        mail: [['Arquitectos Sur', '23-11 11:20', 'Adjuntamos planos y EETT. Solo necesitamos la estructura, el montaje lo hace la constructora.']], wa: [],
        borrador: 'Hola, recibimos planos y EETT. El análisis preliminar indica compatibilidad directa en 3 de 4 fachadas. Les enviamos la cotización de estructuras el jueves.' },
      { cod: 'P-2611-009', cliente: 'Inmobiliaria Andes', perfil: 'Inmobiliaria', serv: 3, canal: 'Correo', lugar: 'Chicureo', m2: 1680, info: [1, 0, 1, 1, 1, 0, 0, 0], prob: 40, fab: 'Sem. 14 · abr 2027', email: 'proyectos@inmoandes.cl', asunto: '12 casas · llave en mano', hora: 'vie', tieneMail: true,
        mail: [['Inmobiliaria Andes', '20-11 08:40', 'Evaluamos 12 casas de 140 m² llave en mano. ¿Pueden cotizar a partir de nuestra tipología?']], wa: [],
        borrador: 'Gracias por considerarnos. Para cotizar 12 unidades necesitamos la tipología en DWG, el loteo y la factibilidad sanitaria. Con eso entregamos un estimado de obra completa en 5 días hábiles.' },
      { cod: 'P-2611-008', cliente: 'Andrea M.', perfil: 'Propietaria', serv: 2, canal: 'WhatsApp', lugar: 'Frutillar', m2: 120, info: [0, 1, 1, 1, 0, 0, 0, 0], prob: 30, fab: 'Sin fecha', email: 'sin correo', asunto: '—', hora: '—', tieneMail: false,
        mail: [], wa: [['u', 'Hola! Vi la casa en Instagram, cuánto sale una de 120 m2?'], ['b', '¡Hola Andrea! Depende del servicio: ¿estructura, casa cerrada o llave en mano?'], ['u', 'Cerrada con ventanas, tengo terreno en Frutillar'], ['b', 'Perfecto. ¿Me compartes tu correo para enviarte opciones y precios?'], ['u', '[foto de un croquis]'], ['b', 'Gracias por el croquis 🙌 Para enviarte la propuesta necesito tu correo, ¿me lo compartes?']],
        borrador: 'Sin correo no se envía propuesta. El agente vuelve a pedirlo mañana a las 10:00.' },
      { cod: 'P-2611-006', cliente: 'Constructora Lago', perfil: 'Constructora', serv: 0, canal: 'Formulario', lugar: 'Valdivia', m2: 540, info: [1, 1, 1, 1, 1, 1, 1, 1], prob: 81, fab: 'Sem. 2 · ene 2027', email: 'ofertas@constructoralago.cl', asunto: 'Estructuras 4 casas Valdivia', hora: '18-11', tieneMail: true,
        mail: [['Constructora Lago', '18-11 15:02', 'Confirmamos interés. Esperamos la propuesta final para firmar.']], wa: [],
        borrador: 'Les enviamos la propuesta final firmada por Gerencia. Al aceptar, entra a cálculo y reservamos mesa en fábrica para la semana 2.' }
    ];
    const CHECK = ['Planos de arquitectura', 'Ubicación y terreno', 'Superficie', 'Servicio definido', 'Correo de contacto', 'EETT o materialidades', 'Normativa / permiso', 'Presupuesto objetivo'];
    const pedVis = PED.map((p, i) => ({ p, i })).filter(o => st.filtro < 0 || o.p.serv === st.filtro);
    const ps = PED[st.ped];
    const infoN = (p) => p.info.reduce((a, b) => a + b, 0);
    const canalEst = (c) => c.indexOf('WhatsApp') === 0 ? chip('#e3f3e8', '#1f7a44') : (c === 'Correo' ? chip('#e8eef5', '#2d4f73') : chip('#f1ede4', '#5d564e'));
    const pedSel = {
      cod: ps.cod, cliente: ps.cliente, perfil: ps.perfil, lugar: ps.lugar, m2: fmt(ps.m2), canal: ps.canal, servicio: SERV[ps.serv].t,
      servEst: chip(SERV[ps.serv].c[0], SERV[ps.serv].c[1]), info: infoN(ps) + ' de 8',
      check: CHECK.map((c, j) => ({ t: c, icono: ps.info[j] ? '✓' : '○', estilo: 'color:' + (ps.info[j] ? '#2f6f48' : '#a35a12') })),
      prob: ps.prob + ' %', probBarra: 'height:100%;background:' + (ps.prob >= 60 ? '#3d8b5a' : ps.prob >= 45 ? '#d9822b' : '#c0563e') + ';width:' + ps.prob + '%',
      fab: ps.fab, email: ps.email, mailAsunto: ps.asunto, borrador: ps.borrador,
      mailTxt: ps.tieneMail ? '✉ correo capturado' : '⚠ sin correo', mailEst: ps.tieneMail ? chip('#e3f3e8', '#1f7a44') : chip('#fbeee0', '#a35a12')
    };
    const filaMini = (on) => 'display:block;width:100%;text-align:left;border:none;border-bottom:1px solid rgba(20,18,16,0.05);padding:11px 14px;cursor:pointer;color:#141210;background:' + (on ? '#f3f0fa' : 'transparent') + ';border-left:3px solid ' + (on ? '#52448a' : 'transparent');
    const pedidosLista = pedVis.map(o => ({
      cliente: o.p.cliente, servicio: SERV[o.p.serv].t, m2: fmt(o.p.m2), canal: o.p.canal, canalEst: canalEst(o.p.canal),
      mailHora: o.p.hora, mailAsunto: o.p.asunto, pick: () => this.setState({ ped: o.i }), filaMini: filaMini(o.i === st.ped)
    }));
    const pedidosWa = PED.map((p, i) => ({ p, i })).filter(o => o.p.wa.length).map(o => ({
      cliente: o.p.cliente, servicio: SERV[o.p.serv].t, pick: () => this.setState({ ped: o.i }), filaMini: filaMini(o.i === st.ped),
      mailTxt: o.p.tieneMail ? '✉ correo' : '⚠ sin correo', mailEst: o.p.tieneMail ? chip('#e3f3e8', '#1f7a44') : chip('#fbeee0', '#a35a12')
    }));
    const mailHilo = (ps.mail.length ? ps.mail : [['—', '', 'Este pedido todavía no tiene correo: la conversación sigue en WhatsApp hasta que el cliente lo comparta.']]).map(m => ({
      de: m[0], hora: m[1], t: m[2], caja: 'padding:12px 14px;border-radius:12px;background:' + (m[0].indexOf('FURŌ') >= 0 ? '#f3f0fa' : '#f7f5f1')
    }));
    const waHilo = (ps.wa.length ? ps.wa : [['b', 'Este pedido no entró por WhatsApp.']]).map(m => ({
      t: m[1], fila: 'display:flex;justify-content:' + (m[0] === 'u' ? 'flex-start' : 'flex-end'),
      burbuja: 'max-width:80%;padding:8px 11px;border-radius:10px;font-size:13px;line-height:1.4;box-shadow:0 1px 0 rgba(0,0,0,0.06);background:' + (m[0] === 'u' ? '#fff' : '#dcf8c6')
    }));
    const tablaPedidos = tabla(['Pedido', 'Cliente', 'Servicio', 'Canal', 'm²', 'Info', 'Prob.'], '92px 1.3fr 1.3fr 1fr 56px 52px 52px',
      pedVis.map(o => ({
        sel: o.i === st.ped, pick: () => this.setState({ ped: o.i }),
        c: [{ t: o.p.cod.slice(2), s: "font-family:'JetBrains Mono',monospace;font-size:11px;color:#6f6860" }, { t: o.p.cliente, s: 'font-weight:500' }, { t: SERV[o.p.serv].t, chip: SERV[o.p.serv].c },
          { t: o.p.canal, chip: o.p.canal.indexOf('WhatsApp') === 0 ? ['#e3f3e8', '#1f7a44'] : o.p.canal === 'Correo' ? ['#e8eef5', '#2d4f73'] : ['#f1ede4', '#5d564e'] },
          fmt(o.p.m2), { t: infoN(o.p) + '/8', s: 'color:' + (infoN(o.p) >= 7 ? '#2f6f48' : '#a35a12') }, o.p.prob + ' %']
      })), 720);
    const subPed = [['lista', 'Listado', '6'], ['mail', 'Correo', '3'], ['wa', 'WhatsApp', '2'], ['analisis', 'Análisis de planos', '']].map(s => ({
      t: s[1], b: s[2], pick: () => this.setState({ subPed: s[0], split: false }),
      estilo: pill(st.subPed === s[0] && !st.split), bEst: s[2] ? 'font-size:10px;padding:1px 6px;border-radius:99px;margin-left:4px;background:' + (st.subPed === s[0] && !st.split ? '#52448a' : '#ece9e2') : 'display:none'
    }));
    const filtrosServ = [{ t: 'Todos', i: -1 }].concat(SERV.map((s, i) => ({ t: s.t, i }))).map(f => ({
      t: f.t, n: f.i < 0 ? PED.length : PED.filter(p => p.serv === f.i).length, pick: () => this.setState({ filtro: f.i }),
      estilo: 'border-radius:99px;padding:7px 12px;font-size:12px;cursor:pointer;min-height:32px;border:1px solid ' + (st.filtro === f.i ? '#52448a' : 'rgba(20,18,16,0.12)') + ';background:' + (st.filtro === f.i ? '#f3f0fa' : '#fff') + ';color:#141210'
    }));

    // análisis de planos (Casa Coyhaique REV03)
    const anStats = [['Proyecto', '392 m²', '6 volúmenes · terreno 5.000 m²'], ['Techo', '88 / 72', 'CT / CB · 399 m²'], ['Muros', '67 CM', '231,7 m² · 72 vanos/CB'], ['Colectoras', '175,8 ml', 'laminada 40×185'], ['Laminada', '7,76 m³', 'total proyecto']].map(s => ({ t: s[0], v: s[1], d: s[2] }));
    const COMP = [['V1', 'Vivienda · dormitorios', '14 / 52,9', '13 / 50,0', 'Con ajustes', 'CM de 3,10 m'], ['V2', 'Vivienda · estar', '12 / 41,9', '7 / 21,6', 'Directo', '—'], ['V3', 'Conector', '4 / 12,5', '2 / 5,8', 'Con ajustes', 'Limahoyas, 13°'], ['C1 ×3', 'Cabañas', '36 / 100,5', '27 / 86,7', 'Directo', 'CM de 2,59 m'], ['Q1', 'Quincho', '10 / 35,0', '6 / 22,5', 'Con ajustes', 'CM de 3,03 m'], ['B1', 'Bodega', '12 / 42,8', '12 / 45,1', 'Con ajustes', 'CM de 3,03 m']];
    const tablaCompat = tabla(['Vol.', 'Uso', 'CT pzas/m²', 'CM pzas/m²', 'Grado', 'Observación'], '64px 1.2fr 1fr 1fr 110px 1.1fr',
      COMP.map(c => ({ c: [{ t: c[0], s: "font-family:'JetBrains Mono',monospace;font-size:12px" }, c[1], c[2], c[3], { t: c[4], chip: c[4] === 'Directo' ? ['#e3f3e8', '#1f7a44'] : ['#fbeee0', '#a35a12'] }, { t: c[5], s: 'color:#6f6860' }] })), 640);
    const ITER = [['V1', 'Largo entre testeros 15,10 m → 15,64 m (+54 cm). Ventanas de dormitorio bajan a 1,16 m y se corren 10 a 97 cm.', 1], ['V2', 'Ventanal living: vano estructural de 7,20 m con viga colectora embutida, o 3 vanos de 1,16 m (se pierden ≈2,5 m de vidrio).', 0], ['C1', 'Cabaña: largo 12,40 → 12,04 m (−36 cm). Fachada poniente calza con 2 ventanas corridas 26 a 29 cm.', 2], ['Q1', 'Quincho: largo 9,15 → 9,64 m (+49 cm); ventanales de 2,48 y 2,19 m se mantienen eliminando un CM.', 1], ['V3', 'Conector: acceso vidriado sin CM y ventana de baño reducida.', 2]];
    const EST = [['Requiere decisión', '#fbeee0', '#a35a12'], ['Enviado al cliente', '#e8eef5', '#2d4f73'], ['Aceptado', '#e3f3e8', '#1f7a44']];
    const iteraciones = ITER.map((it, i) => {
      const e = st.iter[i] !== undefined ? st.iter[i] : it[2];
      return { v: it[0], t: it[1], estado: EST[e][0], pick: () => this.setState({ iter: Object.assign({}, st.iter, { [i]: (e + 1) % 3 }) }),
        estilo: 'border:none;cursor:pointer;white-space:nowrap;font-size:11px;padding:5px 10px;border-radius:99px;background:' + EST[e][1] + ';color:' + EST[e][2] };
    });
    const aceptadas = ITER.filter((it, i) => (st.iter[i] !== undefined ? st.iter[i] : it[2]) === 2).length;
    const probCoyN = 58 + aceptadas * 4;
    const factores = [['Planos DWG completos', '+12'], ['4 de 6 volúmenes directos o casi', '+10'], ['Cambios aceptados por el cliente (' + aceptadas + '/5)', '+' + aceptadas * 4], ['Terreno rural (Art. 55 LGUC)', '−8'], ['Sin EETT', '−6'], ['Distancia logística ~1.700 km', '−4']]
      .map(f => ({ t: f[0], v: f[1], estilo: 'font-family:JetBrains Mono,monospace;color:' + (f[1][0] === '+' ? '#9cc39f' : '#e8a68c') }));
    const tiempos = [['Iteración con cliente', (5 - aceptadas) + ' sem', (5 - aceptadas) * 12], ['Permiso DOM (en paralelo)', '8 sem', 96], ['Cálculo estructural', '3 sem', 36], ['Planos de fabricación', '2 sem', 24]]
      .map(t => ({ t: t[0], v: t[1], barra: 'height:100%;border-radius:99px;background:#8b7fc0;width:' + t[2] + '%' }));
    const normativa = [['Uso de suelo', 'Rural · requiere autorización Art. 55 LGUC', 'Pendiente'], ['Zona térmica', 'Zona 7 · exigencias de envolvente altas', 'A confirmar'], ['Carga de nieve', 'NCh431 · relevante en Coyhaique', 'A confirmar'], ['Zona sísmica', 'NCh433', 'A confirmar'], ['Permiso de edificación', 'DOM Coyhaique · arquitecto patrocinante', 'Pendiente'], ['Recepción final', 'Después del montaje y especialidades', '—']]
      .map(n => ({ t: n[0], v: n[1], e: n[2], estilo: chip(n[2] === 'Pendiente' ? '#fbeee0' : '#f1ede4', n[2] === 'Pendiente' ? '#a35a12' : '#5d564e') }));

    // ---------- 3D FURŌ ----------
    const P3D = ['Casa Coyhaique', 'Colonia Suiza', 'Casa Las Palmas'];
    const proyectos3d = P3D.map((t, i) => ({ t, pick: () => this.setState({ p3d: i }), estilo: pill(st.p3d === i) }));
    const lods = [300, 350].map(l => ({ t: 'LOD ' + l, pick: () => this.setState({ lod: l }), estilo: pill(st.lod === l) }));
    const FAM = [
      ['ct', 'CT01', 'Componente techo 1,24 m', '#8b7fc0', 88], ['ct2', 'CT02', 'Medio componente 0,64 m', '#b3a9e0', 12], ['cb', 'CB', 'Bastidor techo 1,16 m', '#c9a06c', 72],
      ['cm', 'CM01', 'Componente muro 1,24 m', '#6f9a72', 67], ['cm2', 'CM02', 'Medio componente 0,64 m', '#9cc39f', 9], ['cbm', 'CB-M', 'Bastidor de muro 1,16 m', '#d8c29b', 40],
      ['vano', 'VANO', 'Ventana o puerta', '#3b4a55', 32], ['test', 'TST', 'Testero tabique 2×6 + OSB', '#8a8278', 14], ['col', 'COL', 'Colectora laminada 40×185', '#d9822b', 175.8]
    ];
    const famColor = {};
    FAM.forEach(f => { famColor[f[0]] = (!st.fam || st.fam === f[0]) ? f[3] : '#34302b'; });
    const familias = FAM.map(f => ({
      cod: f[1], t: f[2], n: f[0] === 'col' ? '175,8 ml' : f[4], pick: () => this.setState({ fam: st.fam === f[0] ? null : f[0] }),
      sw: 'width:14px;height:14px;border-radius:4px;flex:0 0 auto;background:' + f[3],
      estilo: 'display:flex;align-items:center;gap:10px;width:100%;border:none;border-radius:10px;padding:7px 8px;cursor:pointer;color:#141210;background:' + (st.fam === f[0] ? '#f3f0fa' : 'transparent')
    }));
    const famSel = FAM.find(f => f[0] === st.fam);
    const jobs = [['Agente: dibujar V1 con criterio Las Palmas', 72], ['Agente: colectoras embutidas V2', 35], ['Exportar modelo analítico a SAP2000', 100]]
      .map(j => ({ t: j[0], p: j[1] + ' %', barra: 'display:block;height:100%;border-radius:99px;background:' + (j[1] === 100 ? '#6f9a72' : '#8b7fc0') + ';width:' + j[1] + '%' }));
    const CUB3 = st.lod === 300
      ? [['CT01/CT02 · techo', '100 pzas', '285,6 m²'], ['CB · bastidor techo', '72 pzas', '113,5 m²'], ['CM01/CM02 · muro', '76 pzas', '231,7 m²'], ['Colectora 40×185', '—', '175,8 ml'], ['Testeros 2×6 + OSB', '14', '96,4 m²'], ['Madera laminada', '—', '7,76 m³']]
      : [['Viga laminada 40×185 (CT)', '200 pzas', '678 ml'], ['Pino 2×6 dimensionado', '1.940 pzas', '6.208 ml'], ['OSB 11 mm', '412 planchas', '1.226 m²'], ['Aislación lana mineral', '—', '630 m²'], ['Tornillos y herrajes', '18.400 un', '—'], ['Barrera de vapor', '—', '660 m²']];
    const tablaCub3d = tabla(['Elemento', 'Cant.', 'Medida'], '1.6fr 0.8fr 0.8fr', CUB3.map(c => ({ c: [c[0], c[1], { t: c[2], s: "font-family:'JetBrains Mono',monospace;font-size:12px" }] })), 300);

    // ---------- COTIZACIONES ----------
    const M2 = 392;
    const BLQ = [
      ['01', 'Fundaciones', 'Estimado antes de cálculo · pilotes con arriostramiento', 1.6, 3],
      ['02', 'Estructura FURŌ', 'Componentes de muro, techo y entrepiso en madera', 7, 0],
      ['03', 'Capa térmica', 'Aislación, barreras y OSB integrados en fábrica', 4, 1],
      ['04', 'Envolvente exterior', 'Revestimiento termotratado, cubierta, hojalatería y ventanas', 5.5, 2],
      ['05', 'Terminaciones y especialidades', 'Interiores, eléctrica, sanitaria, gas y clima según especificación FURŌ', 15, 3]
    ];
    const incluido = (b) => b[4] <= st.alcance;
    const total = BLQ.filter(incluido).reduce((a, b) => a + b[3] * M2, 0);
    const COLB = ['#8a8278', '#c9a06c', '#6f9a72', '#52448a', '#141210'];
    const bloquesCot = BLQ.map((b, i) => {
      const inc = incluido(b);
      return { n: b[0], t: b[1], d: b[2], uf: fmt(b[3] * M2), m2: String(b[3]).replace('.', ','), estado: inc ? 'Incluido' : 'No incluido',
        chip: inc ? chip('#e3f3e8', '#1f7a44') : chip('#f1ede4', '#8a8278'),
        caja: 'background:#fff;border-radius:18px;padding:18px;border:1px solid rgba(20,18,16,0.07);border-top:4px solid ' + COLB[i] + ';opacity:' + (inc ? 1 : 0.42),
        mini: 'background:#fff;border-radius:12px;padding:12px;border:1px solid rgba(20,18,16,0.07);opacity:' + (inc ? 1 : 0.35) };
    });
    const barraCot = BLQ.map((b, i) => incluido(b) ? 'flex:' + b[3] + ';background:' + COLB[i] : 'display:none');
    barraCot[4] = incluido(BLQ[4]) ? 'flex:15;background:#f5f3ee' : 'display:none';
    const alcances = SERV.map((s, i) => ({ t: s.t, pick: () => this.setState({ alcance: i }),
      estilo: 'border-radius:99px;padding:7px 12px;font-size:12px;cursor:pointer;min-height:32px;border:1px solid ' + (st.alcance === i ? '#52448a' : 'rgba(20,18,16,0.12)') + ';background:' + (st.alcance === i ? '#f3f0fa' : '#fff') + ';color:#141210' }));
    const subCot = [['res', 'Resumen'], ['cub', 'Cubicaciones'], ['apu', 'APU'], ['link', 'Link al cliente']].map(s => ({ t: s[1], pick: () => this.setState({ subCot: s[0] }), estilo: pill(st.subCot === s[0]) }));
    const CV = [['V1', '14 / 52,9', '12 / 24,2', '13 / 50,0', '31,3', '1,46'], ['V2', '12 / 41,9', '10 / 18,2', '7 / 21,6', '24,1', '0,98'], ['V3', '4 / 12,5', '2 / 2,3', '2 / 5,8', '4,9', '0,30'], ['C1 ×3', '36 / 100,5', '30 / 35,4', '27 / 86,7', '72,2', '2,87'], ['Q1', '10 / 35,0', '8 / 14,6', '6 / 22,5', '19,3', '0,87'], ['B1', '12 / 42,8', '10 / 18,8', '12 / 45,1', '24,1', '1,27']];
    const tablaCubVol = tabla(['Volumen', 'CT pzas/m²', 'CB techo', 'CM pzas/m²', 'Colect. ml', 'Lam. m³'], '90px 1fr 1fr 1fr 0.8fr 0.7fr',
      CV.map(c => ({ c: [{ t: c[0], s: 'font-weight:500' }, c[1], c[2], c[3], c[4], c[5]] })).concat([{ c: [{ t: 'Total', s: 'font-weight:500' }, { t: '88 / 285,6', s: 'font-weight:500' }, { t: '72 / 113,5', s: 'font-weight:500' }, { t: '67 / 231,7', s: 'font-weight:500' }, { t: '175,8', s: 'font-weight:500' }, { t: '7,76', s: 'font-weight:500' }] }]), 640);
    const APU = [['CT01 · componente techo 1,24 × 3,39', 'un', '2,1 HH', '3,9', '0,6', '4,5'], ['CM01 · componente muro 1,24 × 2,53', 'un', '1,8 HH', '3,1', '0,5', '3,6'], ['CB · bastidor 1,16 m', 'un', '0,9 HH', '1,2', '0,3', '1,5'], ['Colectora laminada 40×185', 'ml', '0,2 HH', '0,35', '0,05', '0,40'], ['Aislación lana mineral 160 mm', 'm²', '0,15 HH', '0,22', '0,04', '0,26'], ['OSB 11 mm', 'm²', '0,1 HH', '0,18', '0,03', '0,21'], ['Revestimiento termotratado + Cutek', 'm²', '0,35 HH', '0,62', '0,10', '0,72'], ['Montaje en obra', 'm²', '0,6 HH', '—', '1,4', '1,40'], ['Fundación pilote + arriostre', 'un', '1,2 HH', '0,9', '0,4', '1,30']];
    const tablaApu = tabla(['Partida', 'Un.', 'Rendimiento', 'Material', 'Mano de obra', 'P. unitario'], '2fr 50px 0.9fr 0.8fr 0.9fr 0.9fr',
      APU.map(a => ({ c: [a[0], a[1], { t: a[2], s: 'color:#6f6860' }, a[3], a[4], { t: a[5], s: 'font-weight:500' }] })), 700);

    // ---------- CÁLCULO ----------
    const firmas = [['① Calculista', st.calcValidado], ['② Revisión FURŌ · Hernán', st.calcValidado], ['③ Validado', st.calcValidado]]
      .map((f, i) => ({ t: f[0], estilo: chip(f[1] ? '#e3f3e8' : (i === 0 ? '#fbeee0' : '#f1ede4'), f[1] ? '#1f7a44' : (i === 0 ? '#a35a12' : '#8a8278')) }));
    const parametros = [['Ubicación', 'Coyhaique · sector Río Polux'], ['Zona sísmica (NCh433)', 'a confirmar'], ['Nieve (NCh431)', 'carga relevante · a confirmar'], ['Viento (NCh432)', 'a confirmar'], ['Suelo', 'sin mecánica de suelos'], ['Madera', 'pino 2×6 + laminada 40×185'], ['Módulo', '2,40 m · CT/CM 1,24 + CB 1,16'], ['Alturas de muro', 'CM 2,53 · 2,59 · 3,03 · 3,10 m']]
      .map(p => ({ t: p[0], v: p[1], estilo: 'text-align:right;color:' + (p[1].indexOf('confirmar') >= 0 || p[1].indexOf('sin ') === 0 ? '#a35a12' : '#141210') }));
    const programas = [['Rv', 'Revit 2025', 'Modelo analítico v3 · sincronizado 10:42', 'Conectado', '#e3f3e8', '#1f7a44', '#3a2d5e'], ['SAP', 'SAP2000', 'OAPI · modelo generado desde Revit 23-11', 'Conectado', '#e3f3e8', '#1f7a44', '#2d4f73'], ['Rb', 'Robot Structural', 'API · uniones y fundaciones', 'Por conectar', '#fbeee0', '#a35a12', '#8a8278']]
      .map(p => ({ ini: p[0], t: p[1], d: p[2], e: p[3], estEst: chip(p[4], p[5]), logo: 'width:38px;height:38px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:500;background:' + p[6] }));
    const iterCalc = [['21-11', 'Comercial', 'Venta aprobada: estructuras térmicas · 392 m²', '#3d8b5a'], ['22-11', 'Calculista', 'Pide confirmar altura de muro en V1 (3,10 m)', '#d9822b'], ['23-11', 'Arquitectura', 'Propone vano de 7,20 m con colectora embutida en V2', '#8b7fc0'], ['24-11', 'Cliente', 'Prioriza mantener el ventanal del living', '#8b7fc0']]
      .map(i => ({ f: i[0], quien: i[1], t: i[2], punto: 'width:10px;height:10px;border-radius:50%;margin-top:3px;background:' + i[3] }));
    const VER = [['Componentes de muro de 3,10 m', 'V1 · más altos que Las Palmas (2,53 m)', 1], ['Componentes de muro de 3,03 m', 'Quincho y bodega', 1], ['Vano de 7,20 m · colectora embutida', 'V2 · ventanal living', 0], ['Limahoyas y pendiente 13°', 'V3 conector contra V2', 2], ['Uniones de cumbrera', 'Faldones de 2,45 a 3,33 m', 2], ['Fundaciones', 'Pilotes con arriostramiento en cruz', 0]];
    const EV = [['Iterando', '#fbeee0', '#a35a12'], ['En revisión', '#e8eef5', '#2d4f73'], ['OK', '#e3f3e8', '#1f7a44']];
    let verOk = 0;
    const verificar = VER.map((v, i) => {
      const e = st.verif[i] !== undefined ? st.verif[i] : v[2];
      if (e === 2) verOk++;
      return { t: v[0], d: v[1], e: EV[e][0], chip: chip(EV[e][1], EV[e][2]), pick: () => this.setState({ verif: Object.assign({}, st.verif, { [i]: (e + 1) % 3 }), calcValidado: false }),
        caja: 'display:flex;gap:10px;align-items:center;width:100%;border:none;cursor:pointer;padding:10px 12px;border-radius:12px;color:#141210;background:#f7f5f1' };
    });
    const todoOk = verOk === VER.length;
    const validarTxt = st.calcValidado ? '✓ Validado · pasa a planos de fabricación' : (todoOk ? 'Firmar memoria y validar' : 'Faltan ' + (VER.length - verOk) + ' puntos por cerrar');
    const validarEst = 'width:100%;margin-top:14px;border:none;border-radius:10px;padding:12px;font-size:13px;min-height:44px;cursor:' + (todoOk ? 'pointer' : 'default') + ';background:' + (st.calcValidado ? '#3d8b5a' : todoOk ? '#141210' : '#ece9e2') + ';color:' + (todoOk || st.calcValidado ? '#fff' : '#8a8278');

    // ---------- FABRICACIÓN ----------
    const mesas = [['Mesa 1', 'Activa', 'Colonia Suiza · muros', 'Plantilla CM01 1,24 × 2,53', 14, 22, 'termina 26-11 15:00'], ['Mesa 2', 'Activa', 'Colonia Suiza · techo', 'Plantilla CT01 1,24 × 3,39', 8, 18, 'termina 27-11 12:00'], ['Mesa 3', 'Control de calidad', 'Las Palmas · bastidores', 'Plantilla CB 1,16', 30, 30, 'QC en curso'], ['Mesa 4', 'Por configurar', 'Coyhaique · muros 3,10 m', 'Espera validación de cálculo', 0, 76, 'inicio estimado sem. 5']]
      .map(m => ({ t: m[0], e: m[1], proy: m[2], config: m[3], pzas: m[4] + ' de ' + m[5] + ' piezas', fin: m[6],
        chip: chip(m[1] === 'Activa' ? '#e3f3e8' : m[1] === 'Por configurar' ? '#f1ede4' : '#e8eef5', m[1] === 'Activa' ? '#1f7a44' : m[1] === 'Por configurar' ? '#8a8278' : '#2d4f73'),
        barra: 'height:100%;border-radius:99px;background:#52448a;width:' + Math.round(m[4] / m[5] * 100) + '%' }));
    const PZ = [['CM01-14', 'Muro 1,24 × 2,53', 'Mesa 1', 'Armado', '1,8 h', '1,9 h'], ['CM01-15', 'Muro 1,24 × 2,53', 'Mesa 1', 'Corte', '1,8 h', '—'], ['CT01-08', 'Techo 1,24 × 3,39', 'Mesa 2', 'Armado', '2,1 h', '2,4 h'], ['CT01-09', 'Techo 1,24 × 3,39', 'Mesa 2', 'En espera', '2,1 h', '—'], ['CB-30', 'Bastidor 1,16', 'Mesa 3', 'QC', '0,9 h', '0,8 h'], ['CT02-07', 'Medio techo 0,64', 'Mesa 2', 'En espera', '1,2 h', '—']];
    const EPZ = { 'Armado': ['#e8e4f4', '#3a2d5e'], 'Corte': ['#efe7da', '#6e5131'], 'En espera': ['#f1ede4', '#8a8278'], 'QC': ['#e8eef5', '#2d4f73'] };
    const tablaPiezas = tabla(['Pieza', 'Tipo', 'Mesa', 'Estado', 'Estimado', 'Real'], '90px 1.4fr 70px 100px 70px 60px',
      PZ.map(p => ({ c: [{ t: p[0], s: "font-family:'JetBrains Mono',monospace;font-size:12px" }, p[1], p[2], { t: p[3], chip: EPZ[p[3]] }, p[4], { t: p[5], s: 'color:' + (p[5] !== '—' && parseFloat(p[5].replace(',', '.')) > parseFloat(p[4].replace(',', '.')) ? '#a35a12' : '#141210') }] })), 600);
    const QC = ['Medidas dentro de ±2 mm', 'Escuadra y diagonales', 'Humedad de la madera bajo 19 %', 'Rotulado QR y posición de montaje'];
    const qcN = QC.filter((q, i) => st.qc[i]).length;
    const qc = QC.map((q, i) => ({ t: q, icono: st.qc[i] ? '☑' : '☐', pick: () => this.setState({ qc: Object.assign({}, st.qc, { [i]: !st.qc[i] }), qcOk: false }),
      estilo: 'display:flex;gap:10px;align-items:center;width:100%;border:none;cursor:pointer;padding:9px 10px;border-radius:10px;font-size:13px;color:#141210;background:' + (st.qc[i] ? '#eef5ef' : '#f7f5f1') }));
    const qcTodo = qcN === QC.length;
    const inventario = [['Pino 2×6 · 3,20 m', '840 un', 70, 0], ['Laminada 40×185', '96 ml · faltan 80', 35, 1], ['OSB 11 mm', '210 planchas', 60, 0], ['Lana mineral 160 mm', '64 rollos', 45, 0], ['Tornillos y herrajes', 'ok', 80, 0]]
      .map(i => ({ t: i[0], v: i[1], estilo: 'font-size:12px;color:' + (i[3] ? '#c0563e' : '#6f6860'), barra: 'height:100%;border-radius:99px;background:' + (i[3] ? '#c0563e' : '#6f9a72') + ';width:' + i[2] + '%' }));

    // ---------- LOGÍSTICA ----------
    const IZ = [['1° izaje · muros eje A', '#52448a', '#fff'], ['2° izaje · muros eje B', '#c08a3e', '#fff'], ['3° izaje · colectoras + CT', '#6f9a72', '#fff'], ['4° izaje · CB techo', '#b3a9e0', '#141210']];
    const CAMS = [
      { t: 'Camión 1', d: 'entregado 22-11', peso: '11,8 t', ruta: 'Pudahuel → obra · 14 h', carga: [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1] },
      { t: 'Camión 2', d: 'en ruta · llega 25-11 09:00', peso: '12,4 t', ruta: 'salió 24-11 19:00', carga: [2, 2, 3, 3, 1, 1, 2, 2, 3, 3, 1, 1] },
      { t: 'Camión 3', d: 'cargando · sale 27-11', peso: '9,6 t', ruta: 'Pudahuel → obra', carga: [3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, -1] },
      { t: 'Camión 4', d: 'programado 29-11', peso: '7,2 t', ruta: 'herrajes y remates', carga: [3, 3, -1, -1, -1, -1, 3, 3, -1, -1, -1, -1] }
    ];
    const camionesTab = CAMS.map((c, i) => ({ t: c.t, pick: () => this.setState({ cam: i, slot: null }), estilo: pill(st.cam === i) }));
    const cs = CAMS[st.cam];
    const CODS = { 0: 'CM01', 1: 'CM01', 2: 'COL/CT01', 3: 'CB' };
    const slots = cs.carga.map((o, j) => {
      const pos = String.fromCharCode(65 + Math.floor(j / 6)) + (j % 6 + 1);
      const vacio = o < 0;
      const on = st.slot === j;
      return { pos, orden: vacio ? '' : (o + 1) + '°', t: vacio ? 'libre' : CODS[o] + '-' + (10 + j), peso: vacio ? '' : (380 + (j * 37) % 260) + ' kg',
        pick: () => this.setState({ slot: j }),
        estilo: 'text-align:left;cursor:pointer;min-height:64px;border-radius:8px;padding:8px;font:inherit;' + (vacio ? 'background:repeating-linear-gradient(45deg,#f1eee8,#f1eee8 6px,#e8e4dc 6px,#e8e4dc 12px);color:#8a8278;border:1px dashed #cfc9bd' : 'background:' + IZ[o][1] + ';color:' + IZ[o][2] + ';border:2px solid ' + (on ? '#141210' : 'transparent')) };
    });
    const sl = st.slot !== null ? cs.carga[st.slot] : null;
    const slotDetalle = sl === null ? 'Selecciona una posición para ver qué pieza va, en qué orden se iza y dónde se monta.' : (sl < 0 ? 'Posición libre: el agente sugiere completar con remates del Camión 4.' : 'Posición ' + slots[st.slot].pos + ' · ' + slots[st.slot].t + ' · ' + IZ[sl][0] + '. Se descarga directo con grúa a su eje: no se acopia en obra.');
    const ruedas = [40, 120, 560, 640, 812].map(x => 'position:absolute;bottom:4px;left:' + x + 'px;width:34px;height:34px;border-radius:50%;background:#2b2622;border:5px solid #5d564e;box-sizing:border-box');
    const leyendaIzaje = IZ.map(l => ({ t: l[0], sw: 'width:14px;height:14px;border-radius:4px;background:' + l[1] }));
    const tablaDespachos = tabla(['Camión', 'Sale', 'Llega', 'Contenido', 'Peso', 'Estado'], '90px 80px 90px 1.6fr 70px 110px', [
      ['Camión 1', '21-11', '22-11 09:00', 'Muros eje A y B · anclajes', '11,8 t', ['Entregado', '#e3f3e8', '#1f7a44']],
      ['Camión 2', '24-11', '25-11 09:00', 'Colectoras, CT01 faldón norte, CB', '12,4 t', ['En ruta', '#fbeee0', '#a35a12']],
      ['Camión 3', '27-11', '28-11 09:00', 'CT01 faldón sur, CB, testeros', '9,6 t', ['Cargando', '#e8eef5', '#2d4f73']],
      ['Camión 4', '29-11', '30-11 09:00', 'Herrajes, remates, hojalatería', '7,2 t', ['Programado', '#f1ede4', '#8a8278']]
    ].map(r => ({ sel: CAMS[st.cam].t === r[0], pick: () => this.setState({ cam: parseInt(r[0].slice(-1)) - 1, slot: null }), c: [{ t: r[0], s: 'font-weight:500' }, r[1], r[2], r[3], r[4], { t: r[5][0], chip: [r[5][1], r[5][2]] }] })), 680);

    // ---------- MONTAJE ----------
    const montajeKpi = [['Avance real', '62 %', 'plan del día 4: 57 %'], ['Piezas montadas', '141 / 228', 'faldón norte completo'], ['Camiones recibidos', '1 de 4', 'Camión 2 llega mañana'], ['Horas grúa', '19 h', 'de 42 h estimadas']]
      .map(k => ({ t: k[0], v: k[1], d: k[2] }));
    const PREG = [
      ['¿Cómo va la unión del CT01 con la colectora en el eje 5?', 'Tornillo 8×200 cada 30 cm, dos por viga del componente, más ángulo AG-90 en cada extremo. Ver lámina M-07, detalle 3.'],
      ['¿En qué camión viene el CT02-07?', 'Todavía está en Mesa 2 (en espera). Sale en el Camión 3 el 27-11, posición B4, 3° izaje.']
    ];
    const preguntas = [];
    PREG.slice(0, st.preg + 1).forEach(p => { preguntas.push({ de: 'Jefe de obra', t: p[0], caja: 'padding:10px 12px;border-radius:12px;background:#f7f5f1' }); preguntas.push({ de: 'FURŌ · modelo', t: p[1], caja: 'padding:10px 12px;border-radius:12px;background:#f3f0fa' }); });
    const sugPreg = st.preg < PREG.length - 1 ? [{ t: PREG[st.preg + 1][0], pick: () => this.setState({ preg: st.preg + 1 }) }] : [{ t: '↺ Reiniciar', pick: () => this.setState({ preg: 0 }) }];
    const llegadas = [['Camión 1 · 74 piezas', 'Recibido ✓', '#1f7a44'], ['Camión 2 · 66 piezas', 'En ruta', '#a35a12'], ['Camión 3 · 58 piezas', 'Cargando', '#2d4f73'], ['Camión 4 · 30 piezas', 'Programado', '#8a8278']]
      .map(l => ({ t: l[0], e: l[1], estilo: 'font-size:12px;color:' + l[2] }));

    // ---------- PLANIFICACIÓN ----------
    const FASES = [['Análisis y dibujo', '#b3a9e0'], ['Cálculo', '#8b7fc0'], ['Fábrica', '#52448a'], ['Logística', '#c08a3e'], ['Montaje', '#6f9a72'], ['Terminaciones', '#8a8278'], ['Especialidades', '#3b4a55']];
    const fasesLeyenda = FASES.map(f => ({ t: f[0], sw: 'width:12px;height:12px;border-radius:3px;background:' + f[1] }));
    const D0 = new Date(2026, 10, 1).getTime(), DAYS = 181;
    const pos = (a, b) => { const s = (new Date(a[0], a[1] - 1, a[2]).getTime() - D0) / 864e5, e = (new Date(b[0], b[1] - 1, b[2]).getTime() - D0) / 864e5; return [Math.max(0, s / DAYS * 100), Math.max(0.8, (Math.min(e, DAYS) - Math.max(0, s)) / DAYS * 100)]; };
    const bar = (f, a, b, l) => { const p = pos(a, b); return { t: FASES[f][0], l: l || '', s: 'position:absolute;top:3px;height:20px;border-radius:6px;font-size:10px;line-height:20px;padding-left:6px;overflow:hidden;white-space:nowrap;box-sizing:border-box;color:' + (f === 0 ? '#141210' : '#fff') + ';background:' + FASES[f][1] + ';left:' + p[0] + '%;width:' + p[1] + '%' }; };
    const G_TODOS = [
      { t: 'Colonia Suiza', d: 'Obra completa · 162 m²', barras: [bar(2, [2026, 11, 1], [2026, 11, 20], 'Fábrica'), bar(3, [2026, 11, 21], [2026, 11, 30]), bar(4, [2026, 11, 22], [2026, 12, 4], 'Montaje'), bar(5, [2026, 12, 7], [2027, 2, 12], 'Terminaciones'), bar(6, [2026, 12, 14], [2027, 2, 5])] },
      { t: 'Casa Coyhaique', d: 'Estructuras térmicas · 392 m²', barras: [bar(0, [2026, 11, 1], [2026, 12, 4], 'Análisis'), bar(1, [2026, 12, 7], [2026, 12, 30], 'Cálculo'), bar(0, [2027, 1, 4], [2027, 1, 22]), bar(2, [2027, 1, 25], [2027, 3, 5], 'Fábrica'), bar(3, [2027, 3, 8], [2027, 3, 19]), bar(4, [2027, 3, 15], [2027, 4, 9], 'Montaje')] },
      { t: 'Casa Las Palmas', d: 'Térmicas + envolvente · 148 m²', barras: [bar(2, [2026, 11, 1], [2026, 11, 27], 'Fábrica'), bar(3, [2026, 12, 1], [2026, 12, 4]), bar(4, [2026, 12, 7], [2026, 12, 23], 'Montaje + envolvente')] },
      { t: 'Arquitectos Sur', d: 'Estructuras · 210 m²', barras: [bar(0, [2026, 11, 23], [2026, 12, 11], 'Análisis'), bar(1, [2026, 12, 14], [2027, 1, 1]), bar(2, [2027, 1, 11], [2027, 2, 5], 'Fábrica'), bar(3, [2027, 2, 8], [2027, 2, 10])] },
      { t: 'Constructora Lago', d: 'Estructuras · 540 m²', barras: [bar(1, [2026, 12, 1], [2026, 12, 22], 'Cálculo'), bar(2, [2027, 1, 4], [2027, 2, 26], 'Fábrica'), bar(3, [2027, 3, 1], [2027, 3, 12])] }
    ];
    const G_UNO = [
      { t: 'Fábrica', d: 'Mesas 1 y 2', barras: [bar(2, [2026, 11, 1], [2026, 11, 20], 'CM01 · CT01 · CB')] },
      { t: 'Logística', d: '4 camiones', barras: [bar(3, [2026, 11, 21], [2026, 11, 30], 'C1 → C4')] },
      { t: 'Montaje estructura', d: 'grúa + 4 personas', barras: [bar(4, [2026, 11, 22], [2026, 12, 4], '7 días hábiles')] },
      { t: 'Terminaciones', d: 'interiores', barras: [bar(5, [2026, 12, 7], [2027, 1, 15], 'Revestimientos'), bar(5, [2027, 1, 18], [2027, 2, 12], 'Pintura y remates')] },
      { t: 'Especialidades', d: 'eléctrica · sanitaria · gas · clima', barras: [bar(6, [2026, 12, 14], [2027, 1, 8], 'Redes'), bar(6, [2027, 1, 25], [2027, 2, 5], 'Artefactos')] },
      { t: 'Recepción', d: 'DOM', barras: [bar(1, [2027, 2, 15], [2027, 2, 26], 'Recepción final')] }
    ];
    const planModos = ['Todos los proyectos', 'Colonia Suiza'].map((t, i) => ({ t, pick: () => this.setState({ planModo: i }), estilo: pill(st.planModo === i) }));
    const hoyP = (new Date(2026, 10, 24).getTime() - D0) / 864e5 / DAYS * 100;

    // ---------- VENTA ----------
    const VM = [['nov', 2150, 1830], ['dic', 3420, 0], ['ene', 2980, 0], ['feb', 4120, 0], ['mar', 3650, 0], ['abr', 2890, 0], ['may', 1900, 0], ['jun', 1400, 0]];
    const vmax = 4400;
    const ventaMeses = VM.map(m => ({ m: m[0], e: fmt(m[1]), r: fmt(m[2]), lbl: m[2] ? fmt(m[2]) : fmt(m[1]),
      be: 'width:36%;max-width:26px;border-radius:6px 6px 0 0;background:#d9d4f0;height:' + (m[1] / vmax * 100) + '%',
      br: 'width:36%;max-width:26px;border-radius:6px 6px 0 0;background:#3a2d5e;height:' + (m[2] / vmax * 100) + '%;' + (m[2] ? '' : 'display:none') }));
    const ventaKpi = [['Facturado 2026', '18.940', '92 % de lo estimado'], ['Estimado próximo trimestre', '10.520', 'dic · ene · feb'], ['Por cobrar', '820', '2 hitos vencen esta semana'], ['Contribución promedio', '24 %', 'sobre venta neta']]
      .map(k => ({ t: k[0], v: k[1], d: k[2] }));
    const tablaContrib = tabla(['Proyecto', 'Servicio', 'Venta UF', 'Costo UF', 'Contrib.', '%'], '1.2fr 1.2fr 0.8fr 0.8fr 0.8fr 50px', [
      ['Colonia Suiza', 3, 5346, 4130], ['Casa Coyhaique', 1, 4315, 3195], ['Casa Las Palmas', 2, 2368, 1790], ['Constructora Lago', 0, 3780, 2950], ['Noki II', 2, 2402, 1802]
    ].map(r => ({ c: [{ t: r[0], s: 'font-weight:500' }, { t: SERV[r[1]].t, chip: SERV[r[1]].c }, fmt(r[2]), fmt(r[3]), fmt(r[2] - r[3]), Math.round((r[2] - r[3]) / r[2] * 100) + ' %'] })), 620);
    const tablaHitos = tabla(['Proyecto', 'Hito', 'Fecha', 'UF', 'Estado'], '1.1fr 1.3fr 70px 70px 100px', [
      ['Colonia Suiza', '40 % salida de fábrica', '20-11', '2.138', ['Pagado', '#e3f3e8', '#1f7a44']],
      ['Colonia Suiza', '25 % fin de montaje', '04-12', '1.337', ['Por facturar', '#f1ede4', '#5d564e']],
      ['Casa Las Palmas', '40 % salida de fábrica', '27-11', '947', ['Facturado', '#e8eef5', '#2d4f73']],
      ['Casa Coyhaique', '30 % firma', '01-12', '1.295', ['Por facturar', '#f1ede4', '#5d564e']],
      ['Noki II', '5 % recepción', '18-11', '120', ['Vencido', '#fbeee0', '#a35a12']]
    ].map(r => ({ c: [{ t: r[0], s: 'font-weight:500' }, r[1], r[2], r[3], { t: r[4][0], chip: [r[4][1], r[4][2]] }] })), 560);

    // ---------- ACCESOS (solo Administrador) ----------
    const SECC = NAV.filter(n => n[0] !== 'accesos');
    const accCols = ['Nivel'].concat(SECC.map(n => n[1].replace('Planificación', 'Planif.').replace('Cotizaciones', 'Cotiz.').replace('Fabricación', 'Fábrica')));
    const accFilas = ROLES.map((r, i) => ({
      nombre: r.nombre, alcance: r.alcance,
      celdas: SECC.map(n => {
        const tiene = !r.acc || r.acc.indexOf(n[0]) >= 0;
        return { t: tiene ? '✓' : '—', pick: r.admin ? noop : () => { const ex = Object.assign({}, st.accExtra[i] || {}); ex[n[0]] = !tiene; this.setState({ accExtra: Object.assign({}, st.accExtra, { [i]: ex }) }); },
          estilo: 'border:none;border-radius:8px;min-height:34px;font-size:14px;cursor:' + (r.admin ? 'default' : 'pointer') + ';background:' + (tiene ? (r.admin ? '#e8e4f4' : '#e3f3e8') : '#f4f2ee') + ';color:' + (tiene ? (r.admin ? '#3a2d5e' : '#1f7a44') : '#b8b1a6') };
      })
    }));
    const usuarios = [['Victor Pellegrini', 'vpellegrini@furo.company', 'Administrador'], ['Rodrigo Urzúa', 'rurzua@furo.company', 'Gerencia'], ['Ignacio Durruty', 'idurruty@furo.company', 'Gerencia'], ['Hernán', 'hernanh@furo.company', 'Proyecto y dibujo'], ['Calculista externo', 'invitado · expira 31-03-2027', 'Calculista externo'], ['Jefe de planta', 'planta@furo.company', 'Fábrica'], ['Jefe de obra', 'obra@furo.company', 'Obra y montaje']]
      .map(u => ({ n: u[0], m: u[1], r: u[2], ini: u[0].split(' ').map(x => x[0]).join('').slice(0, 2), chip: chip(u[2] === 'Administrador' ? '#141210' : '#f3f0fa', u[2] === 'Administrador' ? '#fff' : '#3a2d5e') }));
    const accGrid = 'display:grid;grid-template-columns:170px repeat(' + SECC.length + ', minmax(52px, 1fr));gap:6px;align-items:center';

    // colores modelo 3D y montaje
    const mont = { ct: '#6f9a72', ct2: '#6f9a72', cb: '#8b7fc0', cm: '#6f9a72', cm2: '#6f9a72', cbm: '#6f9a72', vano: '#3b4a55', test: '#6f9a72', col: '#6f9a72' };

    return {
      toggleRol: () => this.setState({ rolAbierto: !st.rolAbierto }), rolAbierto: st.rolAbierto, rolAbiertoTxt: st.rolAbierto ? 'true' : 'false',
      roles, rolNombre: rol.nombre, rolIni: rol.ini, nav, conexiones,
      migas: TIT[st.vista][0], titulo: TIT[st.vista][1], bloqueado: !ok,
      vPortada: V('portada'), vPedidos: V('pedidos'), v3d: V('3d'), vCot: V('cotizaciones'), vCalc: V('calculo'), vFab: V('fabricacion'), vLog: V('logistica'), vMon: V('montaje'), vPlan: V('planificacion'), vVenta: V('venta'),
      // portada
      pins, atencion, leyenda, kpis, flujo, aprobaciones, nAprob: aprobaciones.filter(a => a.pend).length,
      briefing: 'Colonia Suiza va 5 puntos sobre el plan de montaje. El Camión 2 salió anoche. Coyhaique espera una decisión sobre el ventanal de 7,20 m y entraron 2 pedidos nuevos por WhatsApp.',
      ventaMes: '1.830', ventaMesSub: '85 % del estimado de noviembre', gaugeDash: '85 100',
      // pedidos
      subPed, split: st.split, noSplit: !st.split, toggleSplit: () => this.setState({ split: !st.split }),
      splitEst: 'border-radius:10px;padding:9px 14px;font-size:13px;cursor:pointer;min-height:40px;border:1px solid ' + (st.split ? '#52448a' : 'rgba(20,18,16,0.12)') + ';background:' + (st.split ? '#f3f0fa' : '#fff') + ';color:#141210',
      filtrosServ, vPedLista: st.subPed === 'lista', vPedMail: st.subPed === 'mail', vPedWa: st.subPed === 'wa', vPedAnalisis: st.subPed === 'analisis',
      tablaPedidos, pedSel, pedidosLista, pedidosWa, mailHilo, waHilo,
      irAnalisis: () => this.setState({ subPed: 'analisis', split: false }), irMail: () => this.setState({ subPed: 'mail', split: false }),
      anStats, tablaCompat, iteraciones, iterResumen: aceptadas + ' de 5 cambios aceptados', probCoy: probCoyN + ' %', factores, fabCoy: aceptadas >= 4 ? 'Sem. 4 · ene 2027' : 'Sem. 5 · feb 2027', tiempos, normativa,
      // 3d
      proyectos3d, lods, familias, jobs, tablaCub3d, p3dNombre: P3D[st.p3d], lodTxt: 'LOD ' + st.lod,
      famSelTxt: famSel ? famSel[1] + ' · ' + famSel[2] : 'Componentes por familia · corte del faldón sur',
      cCT: famColor.ct, cCT2: famColor.ct2, cCB: famColor.cb, cCM: famColor.cm, cCM2: famColor.cm2, cCBM: famColor.cbm, cVano: famColor.vano, cTest: famColor.test, cCol: famColor.col,
      mCT: mont.ct, mCT2: mont.ct2, mCB: mont.cb, mCM: mont.cm, mCM2: mont.cm2, mCBM: mont.cbm, mVano: mont.vano, mTest: mont.test, mCol: mont.col,
      irCotizar: go('cotizaciones', { subCot: 'cub' }),
      // cotizaciones
      subCot, alcances, bloquesCot, barraCot, alcanceNombre: SERV[st.alcance].t, totalCot: fmt(total), totalM2: (total / M2).toFixed(1).replace('.', ','),
      vCotRes: st.subCot === 'res', vCotCub: st.subCot === 'cub', vCotApu: st.subCot === 'apu', vCotLink: st.subCot === 'link',
      tablaCubVol, tablaApu,
      // cálculo
      firmas, parametros, programas, iterCalc, verificar, validarTxt, validarEst,
      validarCalc: () => { if (todoOk) this.setState({ calcValidado: true }); },
      // fabricación
      mesas, tablaPiezas, qc, inventario, qcPieza: 'Pieza CB-30 · Mesa 3 · ' + qcN + ' de 4 controles',
      aprobarQc: () => { if (qcTodo) this.setState({ qcOk: true }); },
      qcBtnTxt: st.qcOk ? '✓ CB-30 validada · pasa a despacho' : (qcTodo ? 'Validar pieza' : 'Marca los 4 controles'),
      qcBtnEst: 'width:100%;margin-top:12px;border:none;border-radius:10px;padding:11px;font-size:13px;min-height:42px;cursor:pointer;background:' + (st.qcOk ? '#3d8b5a' : qcTodo ? '#141210' : '#ece9e2') + ';color:' + (st.qcOk || qcTodo ? '#fff' : '#8a8278'),
      // logística
      camionesTab, camSel: cs, slots, slotDetalle, ruedas, leyendaIzaje, tablaDespachos,
      // montaje
      montajeKpi, preguntas, sugPreg, llegadas,
      // planificación
      planModos, fasesLeyenda, meses: ['nov 26', 'dic', 'ene 27', 'feb', 'mar', 'abr'], gantt: st.planModo === 0 ? G_TODOS : G_UNO, planCab: st.planModo === 0 ? 'Proyecto' : 'Colonia Suiza · fase',
      hoyEst: 'position:absolute;top:-4px;bottom:-4px;width:2px;background:#c0563e;left:' + hoyP + '%',
      // venta
      ventaKpi, ventaMeses, tablaContrib, tablaHitos,
      vAccesos: ok && st.vista === 'accesos', accCols, accFilas, accGrid, usuarios
    };
  }
}
