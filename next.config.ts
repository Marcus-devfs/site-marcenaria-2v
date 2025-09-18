import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
