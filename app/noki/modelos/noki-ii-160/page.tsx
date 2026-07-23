'use client'
import { ModeloDetail } from '../ModeloTemplate'

export default function NokiII160() {
  return (
    <ModeloDetail
      eyebrow="Modelos · Noki II"
      title="Noki II — 160 m²"
      description="Nuestra versión más completa de la línea Noki II, con un quincho de 36 m² para disfrutar en familia o con amigos, en cualquier rincón de Chile."
      heroImg="/noki/Modelos/baja/nokiII_160.jpg"
      specs={[
        { l: 'Área total', v: '160 m²' },
        { l: 'Dormitorios', v: '2 (en suite)' },
        { l: 'Baños', v: '2' },
        { l: 'Quincho', v: '36 m²' },
      ]}
      planoPdf="/noki/Modelos/nokiII_160.pdf"
    />
  )
}
