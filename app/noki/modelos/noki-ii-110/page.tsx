'use client'
import { ModeloDetail } from '../ModeloTemplate'

export default function NokiII110() {
  return (
    <ModeloDetail
      eyebrow="Modelos · Noki II"
      title="Noki II — 110 m²"
      description="Suma un segundo dormitorio y una suite completa. Pensado para parejas o familias pequeñas que buscan espacios independientes sin perder cercanía."
      heroImg="/noki/Modelos/baja/nokiII_110.jpg"
      specs={[
        { l: 'Área total', v: '110 m²' },
        { l: 'Dormitorios', v: '2' },
        { l: 'Baños', v: '2' },
        { l: 'Suite', v: '1 baño en suite' },
      ]}
      planoPdf="/noki/Modelos/nokiII_110.pdf"
    />
  )
}
