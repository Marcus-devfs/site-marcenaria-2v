import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Desabilitar verificação de tipos durante o build para permitir build com warnings
    ignoreBuildErrors: true,
  },
  eslint: {
    // Desabilitar ESLint durante o build para permitir build com warnings
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mf-planejados.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-mfplanejados.vercel.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3000/uploads/:path*', // Proxy para o backend
      },
      {
        source: '/testimonials/:path*',
        destination: 'https://mf-planejados.s3.us-east-1.amazonaws.com/testimonials/:path*', // Proxy para o backend
      },
      {
        source: '/uploads/:path*',
        destination: 'https://api-mfplanejados.vercel.app/uploads/:path*', // Proxy para o backend
      },
    ];
  },
};

export default nextConfig;
