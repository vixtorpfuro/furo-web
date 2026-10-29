import type { DatosProyecto } from './datos'
import type { Hito, TipoHito } from './modelo'

// Carga inicial del board: "FURŌ | Cartera de proyectos" (PDF del 29-10-2026) + meses de fábrica y
// montaje anotados en la croquera de Víctor. Los hitos marcados con nota "Croquera, revisar"
// tenían lectura dudosa en la foto.

let n = 0
const h = (tipo: TipoHito, desde: string, extra: Partial<Hito> = {}): Hito => ({
  _key: `semilla${++n}`, tipo, desde, hecho: false, ...extra,
})
const REVISAR = 'Croquera, revisar'

const p = (
  nombre: string, cliente: string, tipo: DatosProyecto['tipo'], superficie: string, m2: number | null,
  estado: string, hitos: Hito[] = [],
): DatosProyecto => ({ nombre, cliente, tipo, superficie, m2, estado, hitos, probabilidad: null, zona: '', logistica: null, ufM2: null, mondayItemId: null })

export const PROYECTOS_SEMILLA: DatosProyecto[] = [
  p('Club de Polo / Driving', '', 'porDefinir', '380 m² (CRM)', 380, 'Horizonte CRM: oct.-dic. 2026. Validar cambios y terrazas.', [
    h('otro', '2027-02', { etiqueta: 'Mock up' }), h('fabrica', '2027-04'), h('montaje', '2027-05'),
  ]),
  p('Patagonia Cliff Lodge', 'Cazú', 'porDefinir', '≈4.600 m² totales', 4600, 'Inicio de obra: noviembre 2027; no es fecha de montaje.'),
  p('Boca de León', 'Clemente Pérez', 'intermedia', '210 m² interiores + casi 100 m² terraza', 210, 'Objetivo: cerrada y techada para marzo. Contratación pendiente.', [
    h('fabrica', '2026-12', { nota: REVISAR }), h('montaje', '2027-02', { nota: REVISAR }),
  ]),
  p('Tawa Lodge', 'Martín Gildemeister', 'intermedia', '300 m² (CRM; por validar)', 300, 'Preliminar: 8 unidades. Sujeto a aprobación, anticipo y fundaciones.', [
    h('montaje', '2027-01', { semanaDesde: 3, hasta: '2027-03', semanaHasta: 4, nota: 'PDF: 15 enero a 15-30 marzo' }),
    h('fabrica', '2027-03', { etiqueta: 'Fábrica etapa 2', nota: REVISAR }),
    h('montaje', '2027-04', { etiqueta: 'Montaje etapa 2', nota: REVISAR }),
  ]),
  p('Reserva Quilaco', 'Leif Kaiser', 'estructuras', 'Pendiente por modelo y total', null, '3 modelos y 3 encargos actuales; solo estructuras.'),
  p('Bahía Coique — conjunto de casas', 'Loreto Cerda', 'porDefinir', 'Pendiente', null, 'Anteproyecto recibido. No duplicar con la oportunidad Bahía Coique.', [
    h('fabrica', '2027-05'), h('montaje', '2027-06'),
  ]),
  p('Todos los Santos', 'Francisco Colchero', 'completa', '400 m² (CRM)', 400, 'Inicio de obra: 1 marzo 2027.', [
    h('fabrica', '2027-02'), h('montaje', '2027-03'),
  ]),
  p('Quincho Todos los Santos', '', 'porDefinir', 'Pendiente', null, 'Fila separada en la croquera.', [
    h('montaje', '2027-05', { nota: REVISAR }),
  ]),
  p('Puerto Laurel', 'Camila Vial', 'porDefinir', 'Pendiente', null, 'Inicio de obra: 1 marzo 2027. Separar casa, quincho y anexos.', [
    h('fabrica', '2027-02'), h('montaje', '2027-03'),
  ]),
  p('CII Renca', '', 'porDefinir', '1.500 m² (CRM)', 1500, 'Horizonte comercial: julio-diciembre 2027.'),
  p('Colegio IRFE', 'Valdivieso Arquitectos', 'porDefinir', '1.295 m²', 1295, '950 m² pabellones + 345 m² complementarios. Horizonte previo: S2 2027.'),
  p('Farellones / Refugio La Leonera', '', 'porDefinir', 'Intervención nueva por determinar', null, '67,9 m² regularizados + ≈37 m² adicionales son antecedentes existentes.', [
    h('fabrica', '2027-03'), h('montaje', '2027-04'),
  ]),
  p('Coyhaique', 'Raúl Vargas', 'porDefinir', 'Pendiente', null, 'Declaró inicio en 3-6 meses desde octubre 2026; no montaje confirmado.'),
  p('Casa Río', 'Peter Pollak', 'porDefinir', '280 m² (CRM)', 280, 'Pendiente cierre de presupuesto y pedido de madera.', [
    h('montaje', '2026-12'),
  ]),
  p('Casablanca', 'Paola Ramírez', 'noki', '90 m², última alternativa', 90, 'Alternativa en evaluación; anterior: 167 m² + terrazas.', [
    h('fabrica', '2026-12'), h('montaje', '2027-01'),
  ]),
  p('Los Boldos', 'Cardoen-Weinstein', 'porDefinir', '365 m² (CRM)', 365, 'Horizonte previo: oct.-dic. 2026. Actualizar programación.', [
    h('fabrica', '2026-12'), h('montaje', '2027-01'),
  ]),
  p('Bertrand', 'Natho', 'porDefinir', '342 m² (CRM)', 342, 'Obra en ejecución. Separar de montajes futuros: terminaciones y cierre.', [
    h('otro', '2026-11', { etiqueta: 'Cierre / montaje 2H', nota: REVISAR }),
    h('montaje', '2026-12', { etiqueta: 'Montaje mayor', nota: REVISAR }),
  ]),
  p('Mall Paseo San Pedro', 'EBCO', 'porDefinir', '2.050 m² (CRM)', 2050, 'Por validar con EBCO: solicitar la última programación de terreno y montaje.'),
  p('Quillota', 'Tomasello-Beltec', 'porDefinir', 'Pendiente', null, 'Falta consolidar alcance y superficie.'),
  p('NOKI 1', '', 'noki', '100 m²', 100, 'Encargo distinto de Las Palmas.'),
  p('NOKI Las Palmas', '', 'noki', '75 m²', 75, 'Encargo distinto de NOKI 1.', [
    h('otro', '2026-11', { etiqueta: 'Fundaciones' }), h('montaje', '2026-12'),
  ]),
  p('Casa DS-49 Jessica', '', 'porDefinir', 'Pendiente', null, 'Sin fecha futura validada. Confirmar si corresponde a cartera futura o caso ya ejecutado.'),
  p('Altas Cumbres', 'Sarmiento', 'porDefinir', 'Sin encargo específico identificado', null, 'Oportunidad comercial; no asociar superficies de otros proyectos.'),
  p('Max Núñez', '', 'porDefinir', 'Sin encargo específico identificado', null, 'Presentación técnica pendiente; identificar encargo concreto.'),
  p('Francisca Enei / La Reina', 'Francisca Enei', 'completa', '≈160 m² preliminares', 160, 'Sujeto al diseño y objetivo de presupuesto de 7.000 UF.', [
    h('fabrica', '2027-02'), h('montaje', '2027-03'),
  ]),
  p('Ricardo Larraín', '', 'porDefinir', 'Pendiente', null, 'Identificación y antecedentes por consolidar.'),
  p('Piezas de hotel en Bahía', '', 'porDefinir', 'Pendiente', null, 'Separado del conjunto de casas de Bahía Coique.'),
  p('Casas de lujo en playa / Brasil', '', 'porDefinir', 'Pendiente', null, 'Identificar contacto, ubicación y alcance.'),
  p('Correa / Playa Blanca — Todos los Santos', 'Correa', 'porDefinir', '≈218 m² preliminares', 218, 'Anteproyecto 2022: 3 unidades de ≈72,5 m². Intención: inicio en 3 meses desde oct. 2026.', [
    h('fabrica', '2027-02'), h('montaje', '2027-03'),
  ]),
  p('Colegio Patagonia Virgin / Frutillar', '', 'porDefinir', '800 m² (CRM)', 800, 'Horizonte comercial: enero-junio 2027. Confirmar etapa.'),
  p('Pucón', 'Plural — Cristóbal Asenjo', 'porDefinir', 'Pendiente de planos', null, 'Inicio de obra marzo-abril 2027, informado el 28/10/2026.', [
    h('fabrica', '2027-03'), h('montaje', '2027-04'),
  ]),
  p('Casas Diego Sutil / Andrés Mas', 'Ref. Roberto Olivos', 'porDefinir', 'Pendiente de cubicación', null, '3 casas prácticamente iguales. Planos recibidos y revisados el 28/10. Confirmar nombre definitivo.', [
    h('fabrica', '2027-03', { nota: REVISAR }), h('montaje', '2027-04', { nota: REVISAR }),
  ]),
]
