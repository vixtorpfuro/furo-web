import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import ObrasClient from './ObrasClient'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)
const urlFor = (source: any) => builder.image(source).url()

export const revalidate = 60

export default async function ObrasPage() {
  let obras: any[] = []
  try {
    const raw = await client.fetch(`
      *[_type == "obra"] | order(_createdAt asc) {
        _id, titulo, slug, categoria, destacada,
        cliente, arquitecto, ubicacion, superficie, anio,
        resumen, descripcion, imagen_principal
      }
    `)
    obras = (raw ?? []).map((o: any) => ({
      ...o,
      imagen_url: o.imagen_principal ? urlFor(o.imagen_principal) : null,
    }))
  } catch (e) {
    console.error('Sanity fetch error:', e)
  }

  return (
    <main style={{ backgroundColor: '#f5f3ee', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');*{margin:0;padding:0;box-sizing:border-box;}a{text-decoration:none;}`}</style>
      <Nav dark />
      <ObrasClient obras={obras} />
      <Footer />
    </main>
  )
}