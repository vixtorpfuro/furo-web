'use client'
import { ModeloDetail } from '../ModeloTemplate'

export default function NokiII140() {
  return (
    <ModeloDetail
      eyebrow="Modelos · Noki II"
      title="Noki II — 140 m²"
      description="Pensado para familias que necesitan más espacio, con áreas comunes generosas para la vida diaria y para recibir visitas."
      heroImg="/noki/Modelos/baja/nokiII_140.jpg"
      detailImg="/noki/Modelos/baja/nokiII_140b.jpg"
      specs={[
        { l: 'Área total', v: '140 m²' },
        { l: 'Dormitorios', v: '3' },
        { l: 'Baños', v: '2' },
        { l: 'Quincho', v: '36 m²' },
      ]}
      planoPdf="/noki/Modelos/nokiII_140.pdf"
    />
  )
}
