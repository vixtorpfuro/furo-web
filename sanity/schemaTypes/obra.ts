export default {
  name: 'obra',
  title: 'Obras',
  type: 'document',
  fields: [
    { name: 'titulo', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo' } },
    { name: 'categoria', title: 'Categoría', type: 'string', options: { list: [
      'Residencial', 'Comercial', 'Educacional', 'Industrial', 'Vivienda Economica', 'Hoteleria', 'Restaurante'
    ]}},
    { name: 'destacada', title: 'Destacada en Obras', type: 'boolean' },
    { name: 'cliente', title: 'Cliente', type: 'string' },
    { name: 'arquitecto', title: 'Arquitecto / Oficina de Arquitectura', type: 'string' },
    { name: 'ubicacion', title: 'Ubicación', type: 'string' },
    { name: 'superficie', title: 'Superficie', type: 'string' },
    { name: 'anio', title: 'Año', type: 'number' },
    { name: 'descripcion', title: 'Descripción', type: 'text' },
    { name: 'resumen', title: 'Resumen (portada)', type: 'text', rows: 3 },
    { name: 'contenido', title: 'Contenido detallado', type: 'array', of: [{ type: 'block' }] },
    { name: 'imagen_principal', title: 'Imagen principal', type: 'image', options: { hotspot: true } },
    { name: 'galeria', title: 'Galería', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
  ]
}