import Nav from '../../../components/Nav'
import Footer from '../../../components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Modelos FURŌ — Catálogo de sistemas residenciales',
  description: 'Cinco sistemas residenciales en madera laminada: Modelo A, T, Ts, Txs y W. Descarga el catálogo de cada modelo.',
}

const MODELOS = [
  {
    id: 'a',
    nombre: 'Modelo A',
    tag: 'A-frame · Lugares extremos',
    resumen: 'Estructura triangular icónica diseñada para topografías complejas y climas extremos. Su forma en A maximiza la resistencia estructural y minimiza la superficie expuesta al viento y la nieve.',
    specs: [
      { label: 'Superficie interior', val: '75 m²' },
      { label: 'Terrazas', val: '16 m²' },
      { label: 'Dormitorios', val: '2' },
      { label: 'Baños', val: '2' },
      { label: 'Plazo', val: '3 meses' },
    ],
    imagen: '/catalogos/Catalogo-A-Op-1.jpg',
    catalogo: '/catalogos/Catalogo-A-Op.pdf',
  },
  {
    id: 'w',
    nombre: 'Modelo W',
    tag: 'Granero amplio · Sur de Chile',
    resumen: 'Casa de un piso diseñada para el sur de Chile. Gran espacio social con quincho integrado, terraza corrida y amplio dormitorio principal. La más completa de la familia FURŌ.',
    specs: [
      { label: 'Superficie interior', val: '115 m²' },
      { label: 'Terrazas', val: '16 m²' },
      { label: 'Dormitorios', val: '2 + escritorio' },
      { label: 'Baños', val: '2' },
      { label: 'Plazo', val: '5 meses' },
    ],
    imagen: '/catalogos/Catalogo-W-Op-1.jpg',
    catalogo: '/catalogos/Catalogo-W-Op.pdf',
  },
  {
    id: 't',
    nombre: 'Modelo T',
    tag: 'Granero · Familia',
    resumen: 'Casa de un piso tipo granero para familias. Disponible en configuración de 3 y 4 dormitorios con cocina integrada o semi-integrada. Sistema ampliable hasta 23 m² adicionales.',
    specs: [
      { label: 'Superficie interior', val: 'Desde 153 m²' },
      { label: 'Terrazas', val: '26 m²' },
      { label: 'Superficie ampliable', val: 'Hasta 23 m²' },
      { label: 'Dormitorios', val: '3–4' },
      { label: 'Plazo', val: '5 meses' },
    ],
    imagen: '/catalogos/Catalogo-T-Op-1.jpg',
    catalogo: '/catalogos/Catalogo-T-Op.pdf',
  },
  {
    id: 'ts',
    nombre: 'Modelo Ts',
    tag: 'Granero con altillo · Versátil',
    resumen: 'Versión compacta del sistema granero con altillo habitable. Cuatro variantes desde 59,5 m² hasta 120 m² con amplias terrazas. Ideal para segunda vivienda o uso turístico.',
    specs: [
      { label: 'Superficie interior', val: 'Desde 59,5 m²' },
      { label: 'Terrazas', val: 'Hasta 87 m²' },
      { label: 'Altillo', val: '15,5 m²' },
      { label: 'Dormitorios', val: '1–3' },
      { label: 'Variantes', val: '4' },
    ],
    imagen: '/catalogos/Catalogo-Ts-Op-1.jpg',
    catalogo: '/catalogos/Catalogo-Ts-Op.pdf',
  },
  {
    id: 'txs',
    nombre: 'Modelo Txs',
    tag: 'Compacto · Alta terraza',
    resumen: 'Sistema compacto con gran terraza proporcionalmente. Cuatro variantes desde 46,2 m² hasta 90 m² con altillo. Óptimo para terrenos reducidos o proyectos de hospedaje boutique.',
    specs: [
      { label: 'Superficie interior', val: 'Desde 46,2 m²' },
      { label: 'Terrazas', val: 'Hasta 79 m²' },
      { label: 'Altillo', val: '15,5 m²' },
      { label: 'Dormitorios', val: '1–2' },
      { label: 'Variantes', val: '4' },
    ],
    imagen: '/catalogos/Catalogo-Txs-Op-1.jpg',
    catalogo: '/catalogos/Catalogo-Txs-Op.pdf',
  },
]

function ModeloFila({ modelo, bgText }: { modelo: any, bgText?: string }) {
  return (
    <>
      {/* Imagen portada vertical */}
      <div style={{
        background: '#f0ede7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        borderRight: '1px solid rgba(20,18,16,0.08)',
      }}>
        <img
          src={modelo.imagen}
          alt={modelo.nombre}
          style={{ display: 'block', width: '100%', maxHeight: 480, objectFit: 'contain', objectPosition: 'center' }}
        />
      </div>

      {/* Texto */}
      <div style={{
        background: bgText || '#fff',
        padding: '52px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRight: '1px solid rgba(20,18,16,0.08)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', display: 'block', marginBottom: 14 }}>{modelo.tag}</span>
        <h2 style={{ fontSize: 'clamp(22px,2.4vw,36px)', fontWeight: 300, lineHeight: 1.1, color: '#141210', marginBottom: 18 }}>{modelo.nombre}</h2>
        <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 0 }}>{modelo.resumen}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', margin: '24px 0 32px' }}>
          {modelo.specs.map((s: any) => (
            <div key={s.label}>
              <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8278', display: 'block', marginBottom: 4 }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 400, color: '#141210' }}>{s.val}</span>
            </div>
          ))}
        </div>

        <div>
          <a href={modelo.catalogo} download style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#141210', color: '#fff', padding: '13px 22px',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
            textDecoration: 'none',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Descargar catálogo
          </a>
        </div>
      </div>
    </>
  )
}

export default function ModelosFuroPage() {
  // Agrupar en filas de 2
  const filas: (typeof MODELOS[0] | null)[][] = []
  for (let i = 0; i < MODELOS.length; i += 2) {
    filas.push([MODELOS[i], MODELOS[i + 1] ?? null])
  }

  return (
    <main style={{ backgroundColor: '#f5f3ee', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}a{text-decoration:none;}

        .obra-hero-text { padding: 0 56px 64px; }

        .obra-meta { display: grid; grid-template-columns: repeat(4,1fr); background: #fff; border-bottom: 1px solid rgba(20,18,16,0.08); }
        .obra-meta-item { padding: 28px 32px; border-right: 1px solid rgba(20,18,16,0.08); }
        .obra-meta-item:last-child { border-right: none; }

        /* Grilla 4 columnas: img | txt | img | txt */
        .modelos-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          border-top: 1px solid rgba(20,18,16,0.08);
        }

        /* Cada fila = 4 celdas que comparten border-bottom */
        .modelos-fila {
          display: contents;
        }
        .modelos-fila > * {
          border-bottom: 1px solid rgba(20,18,16,0.08);
        }

        /* Celda vacía cuando hay modelo impar */
        .celda-vacia {
          background: #f5f3ee;
          border-bottom: 1px solid rgba(20,18,16,0.08);
        }

        @media (max-width: 1100px) {
          .modelos-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .modelos-grid { grid-template-columns: 1fr; }
          .obra-meta { grid-template-columns: 1fr 1fr; }
          .obra-meta-item { border-right: none; border-bottom: 1px solid rgba(20,18,16,0.08); }
        }
        @media (max-width: 480px) {
          .obra-meta { grid-template-columns: 1fr; }
          .obra-hero-text { padding: 0 24px 48px !important; }
        }
      `}</style>

      <Nav />

      {/* HERO */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 480, overflow: 'hidden', background: '#1a1816' }}>
        <img
          src="/catalogos/Catalogo-W-Op-1.jpg"
          alt="Modelos FURŌ"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.8) 0%, rgba(12,10,8,0.15) 60%)' }} />
        <div className="obra-hero-text" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 14 }}>Residencial</span>
          <h1 style={{ fontSize: 'clamp(32px,6vw,76px)', fontWeight: 300, lineHeight: 1.05, color: '#fff', margin: 0 }}>Modelos FURŌ</h1>
        </div>
      </section>

      {/* META BAR */}
      <div className="obra-meta">
        {[
          { label: 'Sistema', val: 'Paneles Estructurales Termicos FURŌ' },
          { label: 'Modelos', val: '5 sistemas' },
          { label: 'Superficies', val: 'Desde 46 m²' },
          { label: 'Plazo', val: 'Desde 3 meses' },
        ].map((m) => (
          <div key={m.label} className="obra-meta-item">
            <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8278', display: 'block', marginBottom: 6 }}>{m.label}</span>
            <span style={{ fontSize: 15, fontWeight: 400, color: '#141210' }}>{m.val}</span>
          </div>
        ))}
      </div>

      {/* INTRO */}
      <div style={{ padding: '72px 56px 80px', borderBottom: '1px solid rgba(20,18,16,0.08)', maxWidth: 800 }}>
        <p style={{ fontSize: 'clamp(17px,2vw,22px)', fontWeight: 300, lineHeight: 1.7, color: '#141210' }}>
          Cinco sistemas residenciales industrializados en madera laminada. Cada modelo está diseñado para un uso y contexto específico — desde refugios en zonas extremas hasta casas familiares para el sur de Chile. Todos comparten el mismo sistema constructivo modular de FURŌ: componentes fabricados en planta, ensamblados en terreno en una fracción del tiempo de la construcción tradicional.
        </p>
      </div>

      {/* GRILLA 4 COLUMNAS: img | txt | img | txt */}
      <div className="modelos-grid">
        {filas.map((fila, fi) => (
          <div key={fi} className="modelos-fila">
            {/* Modelo izquierdo */}
            <ModeloFila modelo={fila[0]!} bgText={fi % 2 === 0 ? '#fff' : '#faf9f6'} />

            {/* Modelo derecho o celdas vacías */}
            {fila[1] ? (
              <ModeloFila modelo={fila[1]} bgText={fi % 2 === 0 ? '#faf9f6' : '#fff'} />
            ) : (
              <>
                <div className="celda-vacia" />
                <div className="celda-vacia" style={{ borderRight: 'none' }} />
              </>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 56px', background: '#141210', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>¿Tienes un proyecto en mente?</span>
        <h2 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, maxWidth: 560 }}>Conversemos sobre tu terreno y el modelo que mejor se adapta.</h2>
        <Link href="/contacto" style={{ display: 'inline-block', background: '#fff', color: '#141210', padding: '14px 32px', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8 }}>
          Contactar →
        </Link>
      </div>

      <div style={{ padding: '32px 56px', borderTop: '1px solid rgba(20,18,16,0.08)' }}>
        <Link href="/obras" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52448a' }}>
          ← Volver a proyectos
        </Link>
      </div>

      <Footer />
    </main>
  )
}