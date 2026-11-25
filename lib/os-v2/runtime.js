// Renderizador mínimo para los componentes .dc.html del mockup FURŌ OS v2.
// Soporta lo que usan esos archivos: huecos {{ a.b }} en texto y atributos,
// <sc-for list as>, <sc-if value>, y atributos on* que apuntan a funciones.
(function () {
  'use strict';

  window.DCLogic = class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(parcial) {
      const p = typeof parcial === 'function' ? parcial(this.state) : parcial;
      this.state = Object.assign({}, this.state, p);
      if (this.__render) this.__render();
    }
  };

  const HUECO = /\{\{\s*([^}]+?)\s*\}\}/g;
  const SOLO = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function buscar(expr, scopes) {
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    const partes = expr.split('.');
    for (let i = scopes.length - 1; i >= 0; i--) {
      const s = scopes[i];
      if (s && Object.prototype.hasOwnProperty.call(s, partes[0])) {
        let v = s[partes[0]];
        for (let j = 1; j < partes.length && v != null; j++) v = v[partes[j]];
        return v;
      }
    }
    return undefined;
  }

  const texto = (v) => (v == null || v === false ? '' : String(v));
  const interpolar = (str, scopes) => str.replace(HUECO, (_, e) => texto(buscar(e, scopes)));

  function procesar(nodo, scopes, destino) {
    if (nodo.nodeType === 3) {
      const t = nodo.nodeValue;
      destino.appendChild(document.createTextNode(t.indexOf('{{') >= 0 ? interpolar(t, scopes) : t));
      return;
    }
    if (nodo.nodeType !== 1) return;
    const tag = nodo.localName;

    if (tag === 'sc-for') {
      const lista = buscar((nodo.getAttribute('list') || '').replace(HUECO, '$1').trim(), scopes) || [];
      const como = nodo.getAttribute('as') || 'item';
      lista.forEach((item, i) => {
        const s = {}; s[como] = item; s.$index = i;
        nodo.childNodes.forEach((h) => procesar(h, scopes.concat([s]), destino));
      });
      return;
    }
    if (tag === 'sc-if') {
      const v = buscar((nodo.getAttribute('value') || '').replace(HUECO, '$1').trim(), scopes);
      if (v) nodo.childNodes.forEach((h) => procesar(h, scopes, destino));
      return;
    }

    const el = nodo.namespaceURI === 'http://www.w3.org/1999/xhtml'
      ? document.createElement(tag)
      : document.createElementNS(nodo.namespaceURI, nodo.tagName);
    for (const a of Array.from(nodo.attributes)) {
      const nombre = a.name;
      if (nombre.startsWith('hint-')) continue;
      if (/^on[a-z]+$/i.test(nombre)) {
        const m = a.value.match(SOLO);
        const fn = m ? buscar(m[1], scopes) : null;
        if (typeof fn === 'function') el.addEventListener(nombre.slice(2).toLowerCase(), (ev) => fn(ev));
        continue;
      }
      if (a.value.indexOf('{{') < 0) { el.setAttribute(nombre, a.value); continue; }
      const m = a.value.match(SOLO);
      if (m) {
        const v = buscar(m[1], scopes);
        if (v === false || v == null) continue;
        el.setAttribute(nombre, v === true ? '' : String(v));
      } else {
        el.setAttribute(nombre, interpolar(a.value, scopes));
      }
    }
    const hijos = tag === 'template' ? nodo.content.childNodes : nodo.childNodes;
    hijos.forEach((h) => procesar(h, scopes, el));
    destino.appendChild(el);
  }

  window.montarDC = function (plantilla, raiz, Clase) {
    const inst = new Clase({});
    inst.__render = () => {
      const vals = inst.renderVals();
      const frag = document.createDocumentFragment();
      plantilla.content.childNodes.forEach((n) => procesar(n, [vals], frag));
      raiz.replaceChildren(frag);
    };
    inst.__render();
    if (typeof inst.alMontar === 'function') inst.alMontar();
  };
})();
