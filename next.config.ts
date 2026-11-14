import type { NextConfig } from "next";

const cabecerasInternas = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  // El cotizador se lee desde disco en su route handler; hay que incluirlo en el bundle del servidor.
  outputFileTracingIncludes: {
    "/interno/cotizador": ["./lib/cotizador/cotizador.html"],
  },
  // Modelos Noki renombrados con los planos de noviembre 2026.
  async redirects() {
    const renombrados = [
      ["noki-ii-65", "noki-ii-70"],
      ["noki-ii-110", "noki-ii-108"],
      ["noki-ii-140", "noki-ii-147"],
    ];
    return renombrados.flatMap(([de, a]) => [
      { source: `/noki/modelos/${de}`, destination: `/noki/modelos/${a}`, permanent: true },
      { source: `/modelos/${de}`, destination: `/modelos/${a}`, permanent: true },
    ]);
  },
  async headers() {
    return [
      { source: "/interno/:path*", headers: cabecerasInternas },
      { source: "/api/interno/:path*", headers: cabecerasInternas },
      // Propuestas para clientes: enlace directo, sin indexar en buscadores.
      { source: "/propuestas/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
