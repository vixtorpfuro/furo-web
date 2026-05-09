import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'noki.cl' }],
          destination: '/noki/:path*',
        },
        {
          source: '/',
          has: [{ type: 'host', value: 'noki.cl' }],
          destination: '/noki',
        },
      ],
    }
  },
};
export default nextConfig;
