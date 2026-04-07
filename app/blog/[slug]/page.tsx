import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const query = `*[_type == "blog" && slug.current == $slug][0] {
  titulo, slug, fecha, autor, resumen, imagen_principal, contenido
}`

const otrosQuery = `*[_type == "blog" && slug.current != $slug] | order(fecha desc)[0...3] {
  titulo, slug, fecha, imagen_principal, resumen
}`

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase()
}

const portableComponents = {
  types: {
    image: ({ value }: any) => (
      <figure style={{ margin: '48px 0' }}>
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ''}
          style={{ width: '100%', display: 'block' }}
        />
        {value.caption && (
          <figcaption style={{ fontSize: 12, color: '#8a8278', marginTop: 10, textAlign: 'center', fontWeight: 300 }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    galeria: ({ value }: any) => {
      const cols = value.layout === 'three' ? 3 : 2
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4, margin: '48px 0' }}>
          {value.imagenes?.map((img: any, i: number) => (
            <img key={i} src={urlFor(img).width(800).url()} alt={img.alt || ''}
              style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
          ))}
        </div>
      )
    },
    video: ({ value }: any) => {
      const getEmbed = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const id = url.includes('youtu.be') ? url.split('youtu.be/')[1] : url.split('v=')[1]?.split('&')[0]
          return `https://www.youtube.com/embed/${id}`
        }
        if (url.includes('vimeo.com')) return `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`
        return url
      }
      return (
        <figure style={{ margin: '48px 0' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <iframe src={getEmbed(value.url)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          </div>
          {value.caption && <figcaption style={{ fontSize: 12, color: '#8a8278', marginTop: 10, textAlign: 'center', fontWeight: 300 }}>{value.caption}</figcaption>}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 style={{ fontSize: 'clamp(18px,1.8vw,24px)', fontWeight: 400, lineHeight: 1.25, color: '#141210', margin: '48px 0 16px' }}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontSize: 'clamp(15px,1.4vw,20px)', fontWeight: 400, lineHeight: 1.3, color: '#141210', margin: '36px 0 12px' }}>{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.9, color: '#3a3632', marginBottom: 22 }}>{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{ borderLeft: '2px solid #52448a', paddingLeft: 20, margin: '36px 0', fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: '#52448a' }}>{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 500, color: '#141210' }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value.href} target="_blank" rel="noopener" style={{ color: '#52448a', borderBottom: '1px solid rgba(82,68,138,0.3)', paddingBottom: 1 }}>{children}</a>
    ),
  },
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, otros] = await Promise.all([
    client.fetch(query, { slug }),
    client.fetch(otrosQuery, { slug }),
  ])

  if (!post) return <div>Post no encontrado</div>

  return (
    <main style={{ backgroundColor: '#fff', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; }
        .sidebar-card:hover .sidebar-titulo { color: #52448a; }
      `}</style>

      <Nav dark />

      {/* HEADER — centrado, sin hero */}
      <section style={{ padding: '140px 56px 48px', borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.14em', color: '#8a8278' }}>
              {post.fecha ? formatFecha(post.fecha) : ''}
            </span>
            {post.autor && (
              <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.14em', color: '#8a8278', textTransform: 'uppercase' }}>
                {post.autor}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3vw,42px)', fontWeight: 400, lineHeight: 1.15, color: '#141210', textAlign: 'center', marginBottom: 28 }}>
            {post.titulo}
          </h1>
          <div style={{ width: 60, height: 1, background: '#141210', margin: '0 auto 32px' }} />
          {post.resumen && (
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', textAlign: 'center' }}>
              {post.resumen}
            </p>
          )}
        </div>
      </section>

      {/* IMAGEN PRINCIPAL */}
      {post.imagen_principal && (
        <div style={{ padding: '48px 56px 0' }}>
          <img
            src={urlFor(post.imagen_principal).width(1400).url()}
            alt={post.titulo}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      )}

      {/* LAYOUT CON SIDEBAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '0 64px', padding: '64px 56px 120px', alignItems: 'start' }}>

        {/* CONTENIDO PRINCIPAL */}
        <article>
          {post.contenido && (
            <PortableText value={post.contenido} components={portableComponents} />
          )}

          {/* Volver */}
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(20,18,16,0.08)' }}>
            <Link href="/blog" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#141210', borderBottom: '1px solid rgba(20,18,16,0.25)', paddingBottom: 2 }}>
              ← Volver al blog
            </Link>
          </div>
        </article>

        {/* SIDEBAR */}
        <aside style={{ position: 'sticky', top: 120 }}>

          {/* Sobre FURŌ */}
          <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
            <img
              src="https://cdn.prod.website-files.com/69c9b2d67436dcea96fc3636/69c9b9f30560bd793310acfd_Logo-Furo-Blanco_web_medium.png"
              alt="FURŌ"
              style={{ height: 20, filter: 'brightness(0)', opacity: 0.7, display: 'block', marginBottom: 16 }}
            />
            <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.8, color: '#5e5850', marginBottom: 16 }}>
              Construimos con madera laminada (GLT y CLT) para proyectos de todo tipo, tamaño y lugar en Chile.
            </p>
            <Link href="/contacto" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: '#141210', padding: '10px 18px', display: 'inline-block' }}>
              Hablemos →
            </Link>
          </div>

          {/* Otros posts */}
          {otros.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 24 }}>
                También te puede interesar
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {otros.map((otro: any) => (
                  <Link key={otro.slug.current} href={`/blog/${otro.slug.current}`} className="sidebar-card" style={{ display: 'block' }}>
                    {otro.imagen_principal && (
                      <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#e8e4de', marginBottom: 12 }}>
                        <img
                          src={urlFor(otro.imagen_principal).width(400).url()}
                          alt={otro.titulo}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    )}
                    <span style={{ fontSize: 10, color: '#8a8278', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                      {otro.fecha ? formatFecha(otro.fecha) : ''}
                    </span>
                    <p className="sidebar-titulo" style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.35, color: '#141210', textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'color 0.2s' }}>
                      {otro.titulo}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter mini */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid rgba(20,18,16,0.08)' }}>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a8278', marginBottom: 12 }}>
              Novedades
            </p>
            <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.7, color: '#5e5850', marginBottom: 16 }}>
              Recibe catálogos, detalles constructivos y proyectos recientes.
            </p>
            <Link href="/#newsletter" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52448a', borderBottom: '1px solid rgba(82,68,138,0.3)', paddingBottom: 1 }}>
              Suscribirse →
            </Link>
          </div>

        </aside>
      </div>

      <Footer />
    </main>
  )
}