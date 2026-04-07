'use client'
import { useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const CATEGORIAS = [
  {
    cat: 'Generales',
    items: [
      { q: '¿Qué es FURŌ?', r: 'FURŌ es una empresa especializada en soluciones constructivas eficientes en madera laminada. Desarrollamos componentes estructurales industrializados que permiten construir con mayor precisión, rapidez y calidad.' },
      { q: '¿Qué tipo de proyectos puede desarrollar FURŌ?', r: 'Nuestra tecnología se adapta a múltiples escalas y usos: desde viviendas sociales hasta colegios, proyectos turísticos, comerciales e institucionales.' },
      { q: '¿Qué incluye el servicio FURŌ?', r: 'FURŌ puede participar en distintas etapas del proyecto: consultoría y soporte en anteproyectos, ingeniería estructural y coordinación BIM, fabricación industrial de componentes, logística y transporte a obra, montaje o asistencia técnica en terreno, y acompañamiento durante la obra (opcional).' },
      { q: '¿En qué se diferencia FURŌ de una constructora tradicional?', r: 'FURŌ no es una constructora. Somos un partner técnico que optimiza la obra gruesa mediante diseño, ingeniería y fabricación industrializada. Trabajamos en conjunto con constructoras locales, mejorando la eficiencia, reduciendo tiempos y aumentando la calidad del proyecto.' },
      { q: '¿FURŌ ofrece casas prefabricadas?', r: 'No vendemos casas prefabricadas genéricas. Contamos con modelos eficientes configurables, y también trabajamos con proyectos personalizados. Si tienes un anteproyecto, podemos analizarlo y definir la mejor solución constructiva con nuestros componentes.' },
      { q: '¿En qué se diferencia FURŌ de un sistema modular o SIP?', r: 'FURŌ combina lo mejor de ambos mundos: la eficiencia de la construcción industrializada y la libertad de diseño de la arquitectura tradicional. A diferencia de sistemas rígidos como SIP, trabajamos con estructuras de madera laminada que permiten mayor flexibilidad, precisión y durabilidad.' },
      { q: '¿Puedo construir yo mismo con FURŌ?', r: 'Es posible trabajar con autoconstrucción supervisada, aunque recomendamos que el montaje lo realice un equipo capacitado para asegurar calidad y precisión.' },
      { q: '¿Dónde opera FURŌ?', r: 'FURŌ opera en todo Chile. Gracias a la ligereza de nuestros componentes, podemos construir en zonas remotas, rurales o de difícil acceso.' },
      { q: '¿Los proyectos FURŌ pueden financiarse?', r: 'Sí. Entregamos toda la documentación técnica necesaria para presentar proyectos a entidades financieras.' },
      { q: '¿Los productos FURŌ tienen garantía?', r: 'Sí. Nuestros componentes cuentan con garantía técnica y soporte durante el proceso de montaje y ejecución.' },
    ]
  },
  {
    cat: 'Madera',
    items: [
      { q: '¿Qué es la madera laminada?', r: 'Es un material estructural de alta precisión, formado por láminas de madera unidas, que permite mayor resistencia, estabilidad y control constructivo.' },
      { q: '¿Por qué trabajar con madera laminada?', r: 'Material renovable que captura carbono, excelente desempeño térmico y acústico, alta resistencia estructural y mayor calidad y precisión constructiva.' },
      { q: '¿Por qué FURŌ utiliza madera laminada?', r: 'Porque permite combinar precisión industrial, libertad arquitectónica, alta eficiencia estructural y bajo impacto ambiental.' },
      { q: '¿La madera requiere mantención?', r: 'No en su estructura. Las terminaciones pueden mantenerse según preferencias estéticas, pero no afectan el comportamiento estructural.' },
    ]
  },
  {
    cat: 'Técnica',
    items: [
      { q: '¿Qué productos ofrece FURŌ?', r: 'Componentes estructurales para obra gruesa: muros, techos, pisos y entrepisos, y fachadas.' },
      { q: '¿Qué incluyen los componentes FURŌ?', r: 'Cada componente incluye estructura en madera laminada, emplacados estructurales, aislación térmica (lana de oveja), herrajes y conectores, pasadas técnicas, y planos y manuales de montaje.' },
      { q: '¿Incluyen cálculo estructural?', r: 'Sí. Todos los proyectos incluyen ingeniería estructural desarrollada en base a normativa vigente.' },
      { q: '¿Cómo se integran las instalaciones?', r: 'Los componentes consideran espacios y pasadas técnicas definidas desde el diseño, facilitando la integración de instalaciones sin afectar la estructura.' },
      { q: '¿Qué tipo de fundaciones requiere FURŌ?', r: 'Depende del proyecto, pero generalmente pueden optimizarse debido a la ligereza del sistema.' },
      { q: '¿Soportan nieve y condiciones extremas?', r: 'Sí. Las estructuras se diseñan según las condiciones específicas del lugar: sismo, viento, nieve, etc.' },
      { q: '¿Puedo conectar servicios?', r: 'Sí. Se integran redes tradicionales o soluciones autónomas según el proyecto.' },
    ]
  },
  {
    cat: 'Diseño',
    items: [
      { q: '¿Puedo personalizar mi proyecto?', r: 'Sí. Cada proyecto puede adaptarse a requerimientos específicos manteniendo eficiencia constructiva.' },
      { q: '¿FURŌ trabaja con arquitectos externos?', r: 'Sí. Nos integramos desde etapas tempranas para optimizar el diseño.' },
      { q: '¿FURŌ diseña proyectos?', r: 'Podemos apoyar en anteproyectos o trabajar sobre diseños existentes.' },
      { q: '¿Puedo traer mi propio diseño?', r: 'Sí. Analizamos el proyecto y proponemos la mejor solución constructiva.' },
      { q: '¿Se puede ampliar en el futuro?', r: 'Sí. Nuestros proyectos pueden diseñarse pensando en crecimiento futuro.' },
    ]
  },
  {
    cat: 'Valores',
    items: [
      { q: '¿Cuánto cuesta construir con FURŌ?', r: 'Las estructuras FURŌ generalmente están entre 4,5 y 5,5 UF/m². Incluyen una solución integrada, por lo que deben compararse con el costo total de construcción y no solo materiales.' },
      { q: '¿Qué incluye FURŌ?', r: 'Ingeniería, componentes estructurales, aislación, emplacados, logística y montaje (según alcance).' },
      { q: '¿Qué no incluye FURŌ?', r: 'Fundaciones, terminaciones, instalaciones y obras exteriores.' },
      { q: '¿Cómo puedo cotizar?', r: 'Contáctanos con información básica del proyecto y te orientaremos con una propuesta inicial.' },
    ]
  },
  {
    cat: 'Tiempos y logística',
    items: [
      { q: '¿Cuánto se demora construir con FURŌ?', r: 'El montaje de estructuras se realiza en una fracción del tiempo de la construcción tradicional.' },
      { q: '¿Incluyen transporte?', r: 'Sí. Podemos encargarnos del transporte optimizado de los componentes a obra.' },
    ]
  },
]

export default function PreguntasFrecuentes() {
  const [open, setOpen] = useState<string | null>(null)
  const [catActiva, setCatActiva] = useState('Generales')

  const toggle = (key: string) => setOpen(open === key ? null : key)

  return (
    <main style={{ backgroundColor: '#f5f3ee', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; }
        .faq-item { border-top: 1px solid rgba(20,18,16,0.08); }
        .faq-item:last-child { border-bottom: 1px solid rgba(20,18,16,0.08); }
        .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 0; background: none; border: none; cursor: pointer; text-align: left; gap: 32px; font-family: DM Sans, sans-serif; }
        .faq-btn:hover .faq-q { color: #52448a; }
        .faq-q { font-size: 16px; font-weight: 400; color: #141210; line-height: 1.4; transition: color 0.2s; }
        .faq-icon { font-size: 20px; font-weight: 300; color: #8a8278; flex-shrink: 0; transition: transform 0.3s; line-height: 1.2; margin-top: 2px; }
        .faq-body { overflow: hidden; transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1); }
        .faq-body p { font-size: 15px; font-weight: 300; color: #5e5850; line-height: 1.85; padding-bottom: 24px; }

        .cat-nav { display: flex; flex-wrap: wrap; gap: 8px; }
        .cat-btn { padding: 8px 18px; font-size: 12px; font-weight: 400; font-family: DM Sans, sans-serif; cursor: pointer; border-radius: 100px; transition: all 0.2s; border: 1px solid rgba(20,18,16,0.12); background: transparent; color: #8a8278; }
        .cat-btn.active { background: #141210; color: #fff; border-color: #141210; }
        .cat-btn:hover:not(.active) { border-color: rgba(20,18,16,0.3); color: #141210; }

        @media (max-width: 768px) {
          .faq-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav dark />

      {/* HEADER */}
      <section style={{ padding: '160px 56px 72px', background: '#fff', borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#52448a', marginBottom: 20 }}>
            Preguntas frecuentes
          </p>
          <h1 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 300, lineHeight: 1.08, color: '#141210', marginBottom: 28 }}>
            Todo lo que necesitas saber sobre FURŌ.
          </h1>
          <p style={{ fontSize: 16, fontWeight: 300, color: '#5e5850', lineHeight: 1.8, maxWidth: 540, marginBottom: 48 }}>
            Si no encuentras lo que buscas, escríbenos directamente y te respondemos a la brevedad.
          </p>
          <a href="/contacto" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.3)', paddingBottom: 2 }}>
            Contactar al equipo →
          </a>
        </div>
      </section>

      {/* CONTENIDO */}
      <section style={{ padding: '64px 56px 120px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>

          {/* Nav de categorías */}
          <div className="cat-nav" style={{ marginBottom: 56 }}>
            {CATEGORIAS.map(({ cat }) => (
              <button
                key={cat}
                className={`cat-btn${catActiva === cat ? ' active' : ''}`}
                onClick={() => setCatActiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Preguntas de la categoría activa */}
          {CATEGORIAS.filter(c => c.cat === catActiva).map(({ cat, items }) => (
            <div key={cat}>
              {items.map((item, i) => {
                const key = `${cat}-${i}`
                const isOpen = open === key
                return (
                  <div key={key} className="faq-item">
                    <button className="faq-btn" onClick={() => toggle(key)}>
                      <span className="faq-q">{item.q}</span>
                      <span className="faq-icon" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                    </button>
                    <div className="faq-body" style={{ maxHeight: isOpen ? 400 : 0 }}>
                      <p>{item.r}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          {/* CTA al final */}
          <div style={{ marginTop: 80, padding: '48px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 300, color: '#141210', marginBottom: 8, lineHeight: 1.3 }}>
                ¿Tienes una pregunta que no está aquí?
              </p>
              <p style={{ fontSize: 14, fontWeight: 300, color: '#5e5850', lineHeight: 1.7 }}>
                Cuéntanos sobre tu proyecto y te orientamos.
              </p>
            </div>
            <a href="/contacto" style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: '#141210', padding: '16px 32px', display: 'inline-block', whiteSpace: 'nowrap' }}>
              Contactar →
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}