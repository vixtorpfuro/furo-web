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
  async headers() {
    return [
      { source: "/interno/:path*", headers: cabecerasInternas },
      { source: "/api/interno/:path*", headers: cabecerasInternas },
    ];
  },
};

export default nextConfig;
