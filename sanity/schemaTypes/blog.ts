export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    { name: 'titulo', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo' } },
    { name: 'fecha', title: 'Fecha', type: 'date' },
    { name: 'autor', title: 'Autor', type: 'string' },
    { name: 'resumen', title: 'Resumen', type: 'text', rows: 3 },
    {
      name: 'imagen_principal',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }]
    },
    {
      name: 'contenido',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Cita', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [{ name: 'href', type: 'url', title: 'URL' }]
              }
            ]
          }
        },
        // Imagen simple
        {
          type: 'image',
          title: 'Imagen',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Texto alternativo', type: 'string' },
            {
              name: 'caption',
              title: 'Pie de foto',
              type: 'string',
            },
            {
              name: 'size',
              title: 'Tamaño',
              type: 'string',
              options: {
                list: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'Ancho completo', value: 'full' },
                  { title: 'Grande', value: 'large' },
                ],
                layout: 'radio',
              },
              initialValue: 'normal',
            },
          ]
        },
        // Galería de imágenes
        {
          type: 'object',
          name: 'galeria',
          title: 'Galería',
          fields: [
            {
              name: 'imagenes',
              title: 'Imágenes',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt', type: 'string' }] }]
            },
            {
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: '2 columnas', value: 'two' },
                  { title: '3 columnas', value: 'three' },
                ],
                layout: 'radio',
              },
              initialValue: 'two',
            }
          ],
          preview: { select: { media: 'imagenes.0' }, prepare: () => ({ title: 'Galería' }) }
        },
        // Video embed (YouTube/Vimeo)
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            { name: 'url', title: 'URL (YouTube o Vimeo)', type: 'url' },
            { name: 'caption', title: 'Pie de video', type: 'string' },
          ],
          preview: { select: { title: 'url' }, prepare: ({ title }: any) => ({ title: `Video: ${title}` }) }
        },
      ]
    },
  ],
  preview: {
    select: { title: 'titulo', media: 'imagen_principal', date: 'fecha' },
    prepare: ({ title, media, date }: any) => ({ title, media, subtitle: date })
  }
}