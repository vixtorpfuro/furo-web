'use client'
import { useState } from 'react'
import NokiChrome, { C, ctaBtn, FadeUp, useNokiForm } from '../shared'

const FAQ_CATS = [
  {
    cat: 'FURŌ',
    items: [
      { q: '¿Qué es FURŌ?', r: 'FURŌ es una empresa chilena de construcción industrializada. Fabricamos estructuras en madera laminada desde nuestra planta en Santiago y las montamos en el terreno del cliente, en cualquier geografía del país.' },
      { q: '¿Qué son los Paneles Estructurales Térmicos FURŌ?', r: 'Son el corazón de cada Noki. Paneles prefabricados de madera laminada con aislación integrada de lana de oveja (160mm). Más resistentes y livianos que el hormigón, con interior visto que se siente diferente.' },
      { q: '¿Dónde se fabrican las casas Noki?', r: 'En nuestra planta en Santiago. Cada panel se produce en condiciones controladas, garantizando precisión y calidad constante en cada proyecto.' },
    ]
  },
  {
    cat: 'MATERIALES & DESEMPEÑO',
    items: [
      { q: '¿Qué materiales utilizan?', r: 'Madera laminada, lana de oveja como aislante, zinc en cubierta y terminaciones en madera tratada al exterior. Todos seleccionados por durabilidad, desempeño térmico y origen responsable.' },
      { q: '¿Cómo funciona el aislamiento térmico?', r: 'La envolvente incluye 160mm de lana de oveja. Mantiene el calor en invierno y el frío fuera en verano, sin necesidad de climatización permanente.' },
      { q: '¿Funciona en climas extremos?', r: 'Sí. Diseñada para la diversidad climática de Chile: costa, precordillera, sur lluvioso y patagonia. La lana de oveja regula la humedad y la temperatura de forma natural.' },
      { q: '¿Qué tan resistente es la estructura?', r: 'Los paneles de madera laminada tienen mayor resistencia por peso que el hormigón. La estructura está calculada para cumplir con la normativa sísmica chilena.' },
    ]
  },
  {
    cat: 'PROCESO',
    items: [
      { q: '¿Cómo es el proceso de compra?', r: 'Primero agendas una reunión de 20 minutos con nuestro equipo. Luego definimos el emplazamiento y terminaciones. Firmamos contrato a suma alzada y comenzamos la fabricación. El montaje en terreno dura entre 4 y 8 meses.' },
      { q: '¿Cuánto tiempo tarda todo el proceso?', r: 'Entre 6 y 12 meses desde la firma del contrato hasta las llaves, dependiendo de los tiempos de permisos del terreno.' },
      { q: '¿Necesito contratar un arquitecto por separado?', r: 'No. El proyecto de arquitectura básico está incluido. Si necesitas proyecto de permisos adaptado a tu municipio, lo coordinamos con nuestro equipo técnico.' },
      { q: '¿Puedo personalizar el diseño?', r: 'Sí, dentro del sistema Noki. Puedes elegir terminaciones interiores y exteriores, colores y acabados sin alterar la estructura ni el precio base.' },
    ]
  },
  {
    cat: 'TERRENO & PERMISOS',
    items: [
      { q: '¿Necesito terreno propio?', r: 'Sí. Noki se construye en tu terreno. Si estás buscando, podemos orientarte en el proceso.' },
      { q: '¿Qué tipo de terreno necesito?', r: 'Llegamos a cualquier rincón de Chile — hemos cruzado en balsa y subido a la cordillera. Lo que necesitas es una evaluación previa de suelo; el acceso lo resolvemos nosotros.' },
      { q: '¿Puedo construir en zona rural?', r: 'Sí, en la mayoría de los casos. Evaluamos la factibilidad del terreno caso a caso en la primera reunión.' },
    ]
  },
  {
    cat: 'PRECIOS & FINANCIAMIENTO',
    items: [
      { q: '¿Cuál es el precio?', r: 'El precio de lanzamiento parte desde 6.000 UF para las primeras unidades. Es un precio a suma alzada: lo que firmas es lo que pagas, sin adicionales.' },
      { q: '¿Qué incluye el precio?', r: 'Proyecto de arquitectura, fabricación de paneles, transporte y montaje en terreno, instalaciones básicas y terminaciones del paquete base.' },
      { q: '¿Qué no incluye el precio?', r: 'Terreno, permisos municipales, instalaciones de servicios (agua, luz, alcantarillado) y terminaciones adicionales fuera del paquete base.' },
      { q: '¿Hay opciones de financiamiento?', r: 'Actualmente trabajamos con pago en etapas: reserva, fabricación y entrega. Estamos desarrollando convenios con instituciones financieras para las próximas unidades.' },
    ]
  },
]

export default function SobreNoki() {
  const [openCat, setOpenCat] = useState<string|null>(null)
  const [openFaq, setOpenFaq] = useState<string|null>(null)
  const openForm = useNokiForm()

  return (
    <NokiChrome>
      {/* ABOUT */}
      <section style={{ background: C.white, paddingTop: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '64vh' }}>
          <div style={{ overflow: 'hidden', background: '#dedad4' }}>
            <img src="/noki/P1010640.jpg" alt="Noki exterior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <FadeUp>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dark, opacity: 0.4, marginBottom: 20 }}>Sobre Noki</p>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(26px,3vw,44px)', fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: 32 }}>
                Construimos diferente porque creemos en una arquitectura mejor.
              </h1>
              <p style={{ fontSize: 18, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 20 }}>
                En <strong style={{ fontWeight: 500, color: C.dark }}>FURŌ</strong> llevamos años perfeccionando la construcción con madera laminada en Chile. Aprendimos que la mayor barrera para una casa de calidad no era el costo — era la incertidumbre.
              </p>
              <p style={{ fontSize: 18, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 20 }}>
                Noki nació de una convicción simple: se puede construir mejor para vivir mejor. Prefabricado con precisión, transportado a cualquier lugar, montado en meses.
              </p>
              <p style={{ fontSize: 18, fontWeight: 300, color: C.mid, lineHeight: 1.85, marginBottom: 40 }}>
                Porque creemos en la madera como material del futuro. En casas que se adaptan al paisaje, no al revés.
              </p>
              <button onClick={openForm} style={ctaBtn}>Únete a la lista de espera</button>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: C.dark, marginTop: 32 }}>
        <div style={{ padding: '56px 48px 24px' }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Preguntas Frecuentes</p>
        </div>
        {FAQ_CATS.map(grupo => {
          const isOpen = openCat === grupo.cat
          return (
            <div key={grupo.cat} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setOpenCat(isOpen ? null : grupo.cat)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 20, padding: '26px 48px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 18, color: isOpen ? '#fff' : 'rgba(255,255,255,0.5)', lineHeight: 1, flexShrink: 0 }}>
                  {isOpen ? '—' : '+'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: isOpen ? '#fff' : 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                  {grupo.cat}
                </span>
              </button>
              <div style={{ maxHeight: isOpen ? 2000 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ padding: '0 48px 12px' }}>
                  {grupo.items.map((item, i) => {
                    const key = `${grupo.cat}-${i}`
                    const qOpen = openFaq === key
                    return (
                      <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                          onClick={() => setOpenFaq(qOpen ? null : key)}
                          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 24 }}
                        >
                          <span style={{ fontSize: 17, fontWeight: 300, color: qOpen ? '#fff' : 'rgba(255,255,255,0.65)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                            {item.q}
                          </span>
                          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)', flexShrink: 0, lineHeight: 1.2, transition: 'transform 0.3s', display: 'block', transform: qOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                        </button>
                        <div style={{ maxHeight: qOpen ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                          <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, paddingBottom: 24 }}>{item.r}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', height: 1 }} />
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 48px', background: C.dark, textAlign: 'center' }}>
        <FadeUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/noki/logo_noki_blanco.png" alt="Noki" style={{ height: 26, marginBottom: 32, display: 'block' }} />
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(28px,4vw,56px)', fontWeight: 400, lineHeight: 1.08, color: '#fff', marginBottom: 16, maxWidth: '20ch' }}>
            Construye tu casa en cualquier terreno de Chile.
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>Únete y asegura tu precio de lanzamiento.</p>
          <button onClick={openForm} style={ctaBtn}>
            Únete a la lista de espera
          </button>
        </FadeUp>
      </section>
    </NokiChrome>
  )
}
