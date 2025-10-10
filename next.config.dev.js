/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CONFIGURAÇÃO DE DESENVOLVIMENTO - SEM CACHE AGRESSIVO
  
  // Desabilitar cache em desenvolvimento
  generateEtags: false,
  
  // Otimizações mínimas para dev
  swcMinify: false, // Desabilitado para dev mais rápido
  
  // Configurações experimentais
  experimental: {
    typedRoutes: false,
    // Remover otimizações que podem causar cache
  },
  
  // Compressão desabilitada em dev
  compress: false,
  
  // Otimização de imagens com cache mínimo
  images: {
    domains: ['arquivos.mercos.com'],
    formats: ['image/webp'], // Apenas WebP para dev
    minimumCacheTTL: 0, // SEM CACHE em desenvolvimento
    unoptimized: true, // Imagens não otimizadas em dev
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arquivos.mercos.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  
  // Headers SEM CACHE para desenvolvimento
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
  
  async redirects() {
    return [
      {
        source: '/banca/:id',
        destination: '/banca/sp/:id',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig
