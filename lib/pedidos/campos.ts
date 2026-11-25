// Información que el agente busca reunir antes de pasar un pedido Noki a cotización y diseño.
export const CAMPOS = [
  { clave: 'modelo', t: 'Modelo Noki o programa (m², dormitorios)' },
  { clave: 'ubicacion', t: 'Comuna y ubicación del terreno' },
  { clave: 'terreno', t: 'Terreno propio (rol o dirección, superficie)' },
  { clave: 'topografia', t: 'Pendiente y tipo de suelo' },
  { clave: 'acceso', t: 'Acceso para camión y grúa' },
  { clave: 'servicios', t: 'Agua, luz y alcantarillado / fosa' },
  { clave: 'plazo', t: 'Plazo para construir' },
  { clave: 'presupuesto', t: 'Presupuesto y financiamiento' },
  { clave: 'terminaciones', t: 'Terminaciones base u opcionales' },
  { clave: 'antecedentes', t: 'Fotos, planos o levantamiento' },
] as const
