// Datos de los modelos Noki. Fuente: planos del 03-11-2026 y presupuestos
// preliminares del 11-11-2026 (Drive FURO COMPANY › 03. NOKI › PRESUPUESTOS).
// Los valores "desde" son el total con IVA de cada presupuesto preliminar.

export type Spec = { l: string; v: string }

export type Modelo = {
  slug: string
  nombre: string
  linea: 'Noki I' | 'Noki II'
  m2: number
  resumen: string
  descripcion: string
  specs: Spec[]
  programa: string[]
  superficies: Spec[]
  desdeUF: number | null
  planoPdf?: string
  planoImg?: string
  hero: string
  galeria: string[]
  fotosReales?: boolean
}

const G = (slug: string, ...f: string[]) => f.map(n => `/noki/Modelos/galeria/${slug}/${n}`)

export const MODELOS: Modelo[] = [
  {
    slug: 'noki-ii-70',
    nombre: 'Noki II 70',
    linea: 'Noki II',
    m2: 70,
    resumen: '1 dormitorio en suite · 1 baño · 70 m²',
    descripcion: 'El Noki más compacto: un refugio de descanso o primera vivienda, con un estar-cocina abierto al paisaje y un dormitorio en suite.',
    specs: [
      { l: 'Superficie', v: '70 m²' },
      { l: 'Dormitorios', v: '1 en suite' },
      { l: 'Baños', v: '1' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', 'Closet técnico'],
    superficies: [
      { l: 'Interior térmico', v: '65 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 2858,
    planoPdf: '/noki/Modelos/planos/nokiII_70.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_70_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-70/hero.jpg',
    galeria: G('noki-ii-70', 'hero.jpg', 'living.jpg', 'dormitorio.jpg', 'extra.jpg', 'dusk.jpg'),
  },
  {
    slug: 'noki-ii-75',
    nombre: 'Noki II 75',
    linea: 'Noki II',
    m2: 75,
    resumen: '1 dormitorio en suite · 1 baño · 75 m²',
    descripcion: 'Un dormitorio en suite y un estar más generoso. Ideal para parejas o como casa de fin de semana, con grandes ventanales hacia el entorno.',
    specs: [
      { l: 'Superficie', v: '75 m²' },
      { l: 'Dormitorios', v: '1 en suite' },
      { l: 'Baños', v: '1' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', 'Closet técnico'],
    superficies: [
      { l: 'Interior térmico', v: '70 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 3021,
    planoPdf: '/noki/Modelos/planos/nokiII_75.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_75_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-75/hero.jpg',
    galeria: G('noki-ii-75', 'hero.jpg', 'living.jpg', 'dormitorio.jpg', 'extra.jpg', 'dusk.jpg'),
  },
  {
    slug: 'noki-ii-97',
    nombre: 'Noki II 97',
    linea: 'Noki II',
    m2: 97,
    resumen: '3 dormitorios · 2 baños · 97 m²',
    descripcion: 'Una sola nave con el estar-cocina al centro: la suite principal a un lado y dos dormitorios con baño compartido al otro. Pensada para familias.',
    specs: [
      { l: 'Superficie', v: '97 m²' },
      { l: 'Dormitorios', v: '3' },
      { l: 'Baños', v: '2' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', '2 dormitorios secundarios con antebaño y baño', 'Módulo chiflonera y closet técnico'],
    superficies: [
      { l: 'Interior térmico', v: '92 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 4092,
    planoPdf: '/noki/Modelos/planos/nokiII_97.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_97_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-97/hero.jpg',
    galeria: G('noki-ii-97', 'hero.jpg', 'living.jpg', 'dormitorio.jpg', 'extra.jpg', 'dusk.jpg'),
  },
  {
    slug: 'noki-ii-108',
    nombre: 'Noki II 108',
    linea: 'Noki II',
    m2: 108,
    resumen: '2 dormitorios · 2 baños · 108 m²',
    descripcion: 'Suite principal y un segundo dormitorio con baño propio, separados por el estar-cocina. Espacios independientes sin perder cercanía.',
    specs: [
      { l: 'Superficie', v: '108 m²' },
      { l: 'Dormitorios', v: '2' },
      { l: 'Baños', v: '2' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', 'Dormitorio secundario con antebaño y baño', 'Módulo chiflonera y closet técnico'],
    superficies: [
      { l: 'Interior térmico', v: '103 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 4768,
    planoPdf: '/noki/Modelos/planos/nokiII_108.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_108_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-108/hero.jpg',
    galeria: [...G('noki-ii-108', 'hero.jpg', 'living.jpg', 'dormitorio.jpg', 'extra.jpg', 'dusk.jpg'), '/noki/Modelos/baja/nokiII_110.jpg'],
  },
  {
    slug: 'noki-ii-120',
    nombre: 'Noki II 120',
    linea: 'Noki II',
    m2: 120,
    resumen: '3 dormitorios · 2 baños · 120 m²',
    descripcion: 'Tres pabellones unidos por puentes vidriados: la suite, el estar-cocina y los dormitorios, cada uno con su propia relación con el paisaje.',
    specs: [
      { l: 'Superficie', v: '120 m²' },
      { l: 'Dormitorios', v: '3' },
      { l: 'Baños', v: '2' },
      { l: 'Pabellones', v: '3' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', '2 dormitorios secundarios con antebaño y baño', 'Módulo chiflonera y closet técnico', 'Puentes vidriados entre pabellones'],
    superficies: [{ l: 'Interior térmico', v: '120 m²' }],
    desdeUF: 4573,
    planoPdf: '/noki/Modelos/planos/nokiII_120.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_120_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-120/hero.jpg',
    galeria: G('noki-ii-120', 'hero.jpg', 'living.jpg', 'dormitorio.jpg', 'extra.jpg', 'dusk.jpg'),
  },
  {
    slug: 'noki-ii-135',
    nombre: 'Noki II 135',
    linea: 'Noki II',
    m2: 135,
    resumen: '5 dormitorios · 3 baños · 135 m²',
    descripcion: 'Dos naves unidas por un acceso vidriado: la casa principal y un pabellón de dormitorios. El Noki con más dormitorios, para familias grandes o visitas.',
    specs: [
      { l: 'Superficie', v: '135 m²' },
      { l: 'Dormitorios', v: '5' },
      { l: 'Baños', v: '3' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', '4 dormitorios secundarios con antebaño y baño', 'Módulo chiflonera y closet técnico'],
    superficies: [
      { l: 'Interior térmico', v: '130 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 5489,
    planoPdf: '/noki/Modelos/planos/nokiII_135.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_135_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-135/hero.jpg',
    galeria: G('noki-ii-135', 'hero.jpg', 'living.jpg', 'dormitorio.jpg', 'extra.jpg', 'dusk.jpg'),
  },
  {
    slug: 'noki-ii-147',
    nombre: 'Noki II 147',
    linea: 'Noki II',
    m2: 147,
    resumen: '3 dormitorios · 2 baños · Quincho 36 m²',
    descripcion: 'Una nave larga con un quincho techado de 36 m² al centro, que separa la zona de dormitorios del estar-cocina. Para recibir todo el año.',
    specs: [
      { l: 'Superficie', v: '147 m²' },
      { l: 'Dormitorios', v: '3' },
      { l: 'Baños', v: '2' },
      { l: 'Quincho techado', v: '36 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', '2 dormitorios secundarios con antebaño y baño', 'Módulo chiflonera y closet técnico', 'Quincho techado'],
    superficies: [
      { l: 'Interior térmico', v: '111 m²' },
      { l: 'Quincho techado', v: '36 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 5005,
    planoPdf: '/noki/Modelos/planos/nokiII_147.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_147_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-147/hero.jpg',
    galeria: [...G('noki-ii-147', 'hero.jpg', 'living.jpg', 'extra.jpg', 'dormitorio.jpg', 'dusk.jpg'), '/noki/Modelos/baja/nokiII_140.jpg'],
  },
  {
    slug: 'noki-ii-160',
    nombre: 'Noki II 160',
    linea: 'Noki II',
    m2: 160,
    resumen: '3 dormitorios · 2 baños · Quincho 36 m²',
    descripcion: 'Nuestra versión más completa: la casa principal y un pabellón de quincho de 36 m², unidos por una pasarela. Para disfrutar en familia o con amigos.',
    specs: [
      { l: 'Superficie', v: '160 m²' },
      { l: 'Dormitorios', v: '3' },
      { l: 'Baños', v: '2' },
      { l: 'Quincho techado', v: '36 m²' },
    ],
    programa: ['Dormitorio principal en suite con baño', 'Living, comedor y cocina', '2 dormitorios secundarios con antebaño y baño', 'Módulo chiflonera y closet técnico', 'Pabellón de quincho techado'],
    superficies: [
      { l: 'Interior térmico', v: '120 m²' },
      { l: 'Quincho techado', v: '36 m²' },
      { l: 'Chiflonera', v: '5 m²' },
    ],
    desdeUF: 5311,
    planoPdf: '/noki/Modelos/planos/nokiII_160.pdf',
    planoImg: '/noki/Modelos/planos/nokiII_160_plano.jpg',
    hero: '/noki/Modelos/galeria/noki-ii-160/hero.jpg',
    galeria: [...G('noki-ii-160', 'hero.jpg', 'living.jpg', 'extra.jpg', 'dormitorio.jpg', 'dusk.jpg'), '/noki/Modelos/baja/nokiII_160.jpg'],
  },
  {
    slug: 'noki-i',
    nombre: 'Noki I',
    linea: 'Noki I',
    m2: 162,
    resumen: '3 dormitorios · 3 baños · 162 m²',
    descripcion: 'Nuestro modelo insignia: 162 m² en dos pisos, con living-comedor amplio y luminoso, cocina integrada y una terraza techada de 22 m² para disfrutar el exterior todo el año.',
    specs: [
      { l: 'Superficie', v: '162 m²' },
      { l: 'Dormitorios', v: '3' },
      { l: 'Baños', v: '3' },
      { l: 'Terraza techada', v: '22 m²' },
    ],
    programa: ['3 dormitorios', '3 baños', 'Living-comedor y cocina integrada', 'Terraza techada de 22 m²'],
    superficies: [
      { l: 'Interior térmico', v: '140 m²' },
      { l: 'Terraza techada', v: '22 m²' },
    ],
    desdeUF: null,
    planoPdf: '/noki/Modelos/nokiI.pdf',
    hero: '/noki/Modelos/baja/nokiI.jpg',
    galeria: ['/noki/P1010657.jpg', '/noki/P1010640.jpg', '/noki/P1010586.jpg', '/noki/P1010591.jpg', '/noki/P1010593.jpg', '/noki/P1010594.jpg', '/noki/P1010632.jpg'],
    fotosReales: true,
  },
]

export const modeloPorSlug = (slug: string) => MODELOS.find(m => m.slug === slug)

export const formatoUF = (n: number) => n.toLocaleString('es-CL')

export const INCLUYE = [
  { l: 'Cubierta', v: 'Zincalum microondulado 0,5 mm' },
  { l: 'Fachada', v: 'Pino termotratado con Cutek, fachada ventilada' },
  { l: 'Muros interiores y cielos', v: 'Pino clear con Cutek' },
  { l: 'Piso interior', v: 'Piso flotante HDF AC4 con manta acústica' },
  { l: 'Baños', v: 'Cerámica 30×60 blanco mate en muros, porcelanato 60×60 en piso' },
  { l: 'Terrazas', v: 'Deck de pino termotratado con Cutek' },
]

export const LETRA_CHICA =
  'Valores referenciales en UF, IVA incluido, según presupuesto preliminar de noviembre de 2026. No incluyen fundaciones, logística y transporte ni preparación del terreno, que dependen de la ubicación y de las condiciones de cada terreno. Valores sujetos a confirmación tras la visita técnica. Imágenes referenciales.'
