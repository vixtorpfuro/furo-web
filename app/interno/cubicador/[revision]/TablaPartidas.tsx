'use client'

import { useState } from 'react'
import type { PartidaCub } from '@/lib/cubicador/datos'

const C = { dark: '#141210', muted: '#8a8278', border: 'rgba(20,18,16,0.10)', purple: '#3a2d5e' }
const CONFIANZA = { alta: '#2f7d4f', media: '#c99a5b', baja: '#c0392b' } as const
const celda: React.CSSProperties = { padding: '7px 10px', borderTop: `1px solid ${C.border}`, verticalAlign: 'middle' }
const campo: React.CSSProperties = { font: 'inherit', fontSize: 13, width: '100%', padding: '4px 6px', border: '1px solid transparent', borderRadius: 4, background: 'transparent' }

const fmt = (n: number | null) => (n === null ? '' : n.toLocaleString('es-CL', { maximumFractionDigits: 2 }))

export default function TablaPartidas({ partidas: iniciales, titulo }: { partidas: PartidaCub[]; titulo: string }) {
  const [partidas, setPartidas] = useState(iniciales)
  const [error, setError] = useState('')

  async function guardar(p: PartidaCub, cambios: Partial<Pick<PartidaCub, 'cantidad' | 'descripcion'>>) {
    const nueva = { ...p, ...cambios }
    if (nueva.cantidad === p.cantidad && nueva.descripcion === p.descripcion) return
    setPartidas(ps => ps.map(x => (x.id === p.id ? nueva : x)))
    setError('')
    const res = await fetch(`/api/interno/cubicador/partidas/${p.id}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cantidad: nueva.cantidad, descripcion: nueva.descripcion }),
    }).catch(() => null)
    if (!res?.ok) {
      setPartidas(ps => ps.map(x => (x.id === p.id ? p : x)))
      setError((await res?.json().catch(() => null))?.error ?? 'No se pudo guardar el cambio.')
    }
  }

  function descargarCsv() {
    const filas = [['Grupo', 'Código', 'Descripción', 'Unidad', 'Cantidad', 'Cantidad leída del plano', 'Confianza', 'Fuente']]
    for (const p of partidas) filas.push([p.grupo, p.codigo, p.descripcion, p.unidad, String(p.cantidad ?? ''), String(p.cantidadOriginal ?? ''), p.confianza, p.fuente ?? ''])
    const csv = filas.map(f => f.map(v => `"${v.replace(/"/g, '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `Cubicacion ${titulo}.csv` })
    a.click()
    URL.revokeObjectURL(url)
  }

  const grupos = [...new Set(partidas.map(p => p.grupo))]

  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '6px 6px 12px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px 6px', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          Haz clic en una descripción o cantidad para corregirla. Las cantidades corregidas quedan marcadas y conservan el valor leído del plano.
        </p>
        <button onClick={descargarCsv} style={{ font: 'inherit', fontSize: 13, padding: '7px 12px', borderRadius: 6, border: `1px solid ${C.purple}`, background: '#fff', color: C.purple, cursor: 'pointer' }}>
          Descargar CSV
        </button>
      </div>
      {error && <p style={{ color: '#c0392b', fontSize: 13, margin: '0 10px 8px' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 820 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: C.muted, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <th style={{ padding: '6px 10px', width: 96 }}>Código</th>
            <th style={{ padding: '6px 10px' }}>Descripción</th>
            <th style={{ padding: '6px 10px', width: 120, textAlign: 'right' }}>Cantidad</th>
            <th style={{ padding: '6px 10px', width: 50 }}>Ud.</th>
            <th style={{ padding: '6px 10px', width: 80 }}>Confianza</th>
            <th style={{ padding: '6px 10px', width: 260 }}>Fuente</th>
          </tr>
        </thead>
        {grupos.map(g => (
          <tbody key={g}>
            <tr><td colSpan={6} style={{ padding: '16px 10px 6px', fontWeight: 500, fontSize: 14 }}>{g}</td></tr>
            {partidas.filter(p => p.grupo === g).map(p => {
              const corregida = p.cantidadOriginal !== null && p.cantidad !== p.cantidadOriginal
              return (
                <tr key={p.id}>
                  <td style={{ ...celda, color: C.muted, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.codigo}</td>
                  <td style={celda}>
                    <input key={p.descripcion} defaultValue={p.descripcion} style={campo} aria-label={`Descripción ${p.codigo}`}
                      onFocus={e => (e.target.style.borderColor = C.border)}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; const v = e.target.value.trim(); if (v) guardar(p, { descripcion: v }) }} />
                  </td>
                  <td style={{ ...celda, textAlign: 'right' }}>
                    <input key={String(p.cantidad)} defaultValue={fmt(p.cantidad)} style={{ ...campo, textAlign: 'right', fontWeight: corregida ? 600 : 400, color: corregida ? C.purple : C.dark }}
                      aria-label={`Cantidad ${p.codigo}`} inputMode="decimal"
                      title={corregida ? `Leído del plano: ${fmt(p.cantidadOriginal)}` : undefined}
                      onFocus={e => (e.target.style.borderColor = C.border)}
                      onBlur={e => {
                        e.target.style.borderColor = 'transparent'
                        // Acepta "1.234,5" (formato chileno) y "1234.5".
                        const crudo = e.target.value.trim()
                        const txt = crudo.includes(',') ? crudo.replace(/\./g, '').replace(',', '.') : crudo
                        const n = txt === '' ? null : Number(txt)
                        if (n === null || Number.isFinite(n)) guardar(p, { cantidad: n === null ? null : Math.round(n * 1000) / 1000 })
                        else e.target.value = fmt(p.cantidad)
                      }} />
                    {corregida && <div style={{ fontSize: 11, color: C.muted, paddingRight: 6 }}>plano: {fmt(p.cantidadOriginal)}</div>}
                  </td>
                  <td style={{ ...celda, color: C.muted }}>{p.unidad}</td>
                  <td style={celda}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, color: '#fff', background: CONFIANZA[p.confianza] }}>{p.confianza}</span>
                  </td>
                  <td style={{ ...celda, color: C.muted, fontSize: 12 }}>{p.fuente}</td>
                </tr>
              )
            })}
          </tbody>
        ))}
      </table>
    </div>
  )
}
