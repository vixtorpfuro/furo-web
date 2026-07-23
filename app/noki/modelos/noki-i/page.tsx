'use client'
import { ModeloDetail } from '../ModeloTemplate'

export default function NokiI() {
  return (
    <ModeloDetail
      eyebrow="Modelos"
      title="Noki I"
      description="Nuestro modelo insignia: 162 m² en dos pisos, con living-comedor amplio y luminoso, cocina integrada y una terraza techada de 22 m² para disfrutar el exterior todo el año."
      heroImg="/noki/Modelos/baja/nokiI.jpg"
      detailImg="/noki/noki_I_iso.jpg"
      specs={[
        { l: 'Área útil (térmico)', v: '140 m²' },
        { l: 'Terraza techada', v: '22 m²' },
        { l: 'Área total', v: '162 m²' },
        { l: 'Dormitorios / Baños', v: '3D / 3B' },
      ]}
      planoPdf="/noki/Modelos/nokiI.pdf"
      gallery={['/noki/P1010657.jpg', '/noki/P1010640.jpg', '/noki/P1010586.jpg', '/noki/P1010591.jpg', '/noki/P1010593.jpg', '/noki/P1010594.jpg', '/noki/P1010632.jpg']}
    />
  )
}
