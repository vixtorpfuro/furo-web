// Atributos de Noki, con íconos de línea simples.
import { C } from '../shared'

const trazo = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const ICONOS: Record<string, React.ReactNode> = {
  ubicacion: (<><path {...trazo} d="M24 40s-11-12.2-11-20a11 11 0 0 1 22 0c0 7.8-11 20-11 20z" /><circle {...trazo} cx="24" cy="20" r="4" /><path {...trazo} d="M10 42h28" /></>),
  velocidad: (<><circle {...trazo} cx="24" cy="25" r="15" /><path {...trazo} d="M24 16v9l6 4M20 6h8M24 6v4" /></>),
  energia: (<><path {...trazo} d="M10 8v32M20 8v32" /><path {...trazo} d="M10 12l10 4-10 4 10 4-10 4 10 4-10 4" /><path {...trazo} d="M38 16l-8 8 8 8" /></>),
  laminada: (<><path {...trazo} d="M8 14h32v20H8z" /><path {...trazo} d="M8 19h32M8 24h32M8 29h32" /><path {...trazo} d="M14 14v20" /></>),
  minimalista: (<><path {...trazo} d="M10 40V22l14-12 14 12v18z" /><path {...trazo} d="M20 40v-9h8v9" /></>),
  premium: (<><path {...trazo} d="M10 8h28v32H10z" /><path {...trazo} d="M19 8c-3 6-3 26 0 32M29 8c3 8 3 24 0 32M24 8v32" /></>),
}

export const ATRIBUTOS = [
  { k: 'ubicacion', t: 'Ubicación flexible', d: 'Fabricada en planta y montada en tu terreno, del desierto a la Patagonia.' },
  { k: 'velocidad', t: 'Velocidad', d: 'La estructura se fabrica en planta mientras se preparan las fundaciones, y se monta en semanas.' },
  { k: 'energia', t: 'Eficiencia energética', d: 'Paneles estructurales térmicos FURŌ con aislación continua: más confort y menos gasto en calefacción.' },
  { k: 'laminada', t: 'Estructura de madera laminada', d: 'Componentes prefabricados en madera, cortados con precisión de fábrica.' },
  { k: 'minimalista', t: 'Diseño minimalista', d: 'Volúmenes simples a dos aguas, espacios abiertos y mucha luz natural.' },
  { k: 'premium', t: 'Materiales premium', d: 'Pino termotratado con Cutek, interiores en pino clear y porcelanato en zonas húmedas.' },
]

export default function Atributos({ fondo = '#f4f1eb' }: { fondo?: string }) {
  return (
    <section style={{ background: fondo, padding: 'clamp(56px,8vw,96px) 16px' }}>
      <style>{`
        .noki-attr { display: grid; grid-template-columns: repeat(3, 1fr); gap: 56px 40px; max-width: 1080px; margin: 0 auto; }
        @media (max-width: 900px) { .noki-attr { grid-template-columns: 1fr 1fr; gap: 44px 24px; } }
        @media (max-width: 560px) { .noki-attr { grid-template-columns: 1fr; gap: 40px; } }
      `}</style>
      <div className="noki-attr">
        {ATRIBUTOS.map(a => (
          <div key={a.k} style={{ textAlign: 'center' }}>
            <svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true" style={{ color: C.dark, display: 'block', margin: '0 auto 18px' }}>{ICONOS[a.k]}</svg>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dark, marginBottom: 10 }}>{a.t}</p>
            <p style={{ fontSize: 15, fontWeight: 300, color: C.mid, lineHeight: 1.65, maxWidth: 300, margin: '0 auto' }}>{a.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
