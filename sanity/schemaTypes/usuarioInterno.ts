const usuarioInterno = {
  name: 'usuarioInterno',
  title: 'Usuarios — Interno FURŌ',
  type: 'document',
  fields: [
    { name: 'nombre', title: 'Nombre', type: 'string', validation: (Rule: { required: () => unknown }) => Rule.required() },
    { name: 'email', title: 'Email', type: 'string', validation: (Rule: { required: () => unknown }) => Rule.required() },
    { name: 'passwordHash', title: 'Password Hash', type: 'string', validation: (Rule: { required: () => unknown }) => Rule.required() },
    { name: 'mondayPersonId', title: 'ID persona en Monday', type: 'string' },
    { name: 'activo', title: 'Activo', type: 'boolean', initialValue: true },
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'email' },
  },
}

export default usuarioInterno
