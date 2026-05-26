// app/blog/page.tsx
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const query = `*[_type == "blog"] | order(fecha desc) {
  titulo, slug, fecha, autor, resumen, imagen_principal
}`

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase()
}

export default async function Blog() {
  const posts = await client.fetch(query)

  return (
    <main style={{ backgroundColor: '#fff', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        a { text-decoration: none; }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 40px;
          row-gap: 100px;
          padding: 80px 56px 140px;
        }
        .blog-card { display: flex; flex-direction: column; }
        .blog-card-img {
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #e8e4de;
          display: block;
          margin-bottom: 18px;
        }
        .blog-card-img img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .blog-card:hover .blog-card-img img { transform: scale(1.04); }
        .blog-card-fecha {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.14em;
          color: #8a8278;
          margin-bottom: 10px;
          display: block;
        }
        .blog-card-titulo {
          font-size: clamp(13px, 1.1vw, 17px);
          font-weight: 500;
          line-height: 1.3;
          color: #141210;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .blog-card:hover .blog-card-titulo { color: #52448a; }
        .blog-card-resumen {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.8;
          color: #5e5850;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 0 80px; }
        .blog-intro-empty { display: block; }

        .blog-intro-section { padding: 160px 56px 80px; }

        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: repeat(2,1fr); padding: 60px 32px 100px; row-gap: 72px; }
          .blog-intro { grid-template-columns: 1fr !important; gap: 0 !important; }
          .blog-intro-empty { display: none !important; }
          .blog-intro-text { text-align: left !important; }
          .blog-intro-section { padding: 100px 24px 60px !important; }
        }
        @media (max-width: 560px) {
          .blog-grid { grid-template-columns: 1fr; padding: 48px 20px 80px; }
        }
      `}</style>

      <Nav dark />

      {/* INTRO — estilo Nosotros, texto alineado derecha */}
      <section className="blog-intro-section" style={{ background: '#fff', borderBottom: '1px solid rgba(20,18,16,0.08)' }}>
        <div className="blog-intro">
          <div className="blog-intro-empty" />
          <div>
            <p className="blog-intro-text" style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', textAlign: 'right', marginBottom: 20 }}>
              Compartimos lo que aprendemos construyendo con madera laminada en Chile. Proyectos, procesos, tecnología y los desafíos reales de industrializar la construcción.
            </p>
            <p className="blog-intro-text" style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: '#5e5850', textAlign: 'right' }}>
              Desde detalles constructivos hasta reflexiones sobre el futuro de la industria — todo lo que forma parte de nuestra manera de construir.
            </p>
            <p className="blog-intro-text" style={{ fontSize: 18, fontWeight: 300, color: '#52448a', textAlign: 'right', marginTop: 32 }}>
              Blog FURŌ
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="blog-grid">
        {posts.map((post: any) => (
          <Link key={post.slug.current} href={`/blog/${post.slug.current}`} className="blog-card">
            <span className="blog-card-fecha">
              {post.fecha ? formatFecha(post.fecha) : ''}
            </span>
            <div className="blog-card-img">
              {post.imagen_principal && (
                <img src={urlFor(post.imagen_principal).width(800).url()} alt={post.titulo} />
              )}
            </div>
            <h2 className="blog-card-titulo">{post.titulo}</h2>
            {post.resumen && <p className="blog-card-resumen">{post.resumen}</p>}
          </Link>
        ))}
      </div>

      <Footer />
    </main>
  )
}