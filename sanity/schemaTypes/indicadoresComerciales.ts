// Indicadores UF/m² del board comercial. Documento único (_id "comercial.indicadores"), se edita desde /interno/comercial.

const indicadoresComerciales = {
  name: 'indicadoresComerciales',
  title: 'Planificación comercial — Indicadores',
  type: 'document',
  fields: [
    { name: 'estructuras', title: 'Solo estructuras (UF/m²)', type: 'number' },
    { name: 'bim', title: 'BIM, modelación y cálculo (UF/m²)', type: 'number' },
    { name: 'montaje', title: 'Montaje de estructuras (UF/m²)', type: 'number' },
    { name: 'envolvente', title: 'Envolvente: revestimiento ext., techumbre, ventanas y puertas exteriores (UF/m²)', type: 'number' },
    { name: 'completa', title: 'Obra completa (UF/m², se suma a lo anterior)', type: 'number' },
    { name: 'logistica', title: 'Logística mínima Santiago (UF/m²)', type: 'number' },
    { name: 'actualizadoPor', title: 'Actualizado por', type: 'string', readOnly: true },
  ],
  preview: { prepare: () => ({ title: 'Indicadores comerciales' }) },
}

export default indicadoresComerciales
