'use client'
import { ModeloDetail } from '../ModeloTemplate'

export default function NokiII65() {
  return (
    <ModeloDetail
      eyebrow="Modelos · Noki II"
      title="Noki II — 65 m²"
      description="El modelo compacto de la línea Noki II: ideal como refugio de descanso o primera vivienda, con un estar integrado que conecta la vida interior con el paisaje."
      heroImg="/noki/Modelos/baja/nokiII_65.jpg"
      specs={[
        { l: 'Área total', v: '65 m²' },
        { l: 'Dormitorios', v: '1' },
        { l: 'Baños', v: '1' },
        { l: 'Estar', v: '1' },
      ]}
      planoPdf="/noki/Modelos/nokiII_65.pdf"
    />
  )
}
