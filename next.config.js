/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações de Performance
  swcMinify: true,
  
  // Configurações experimentais
  experimental: {
    typedRoutes: false,
    optimizePackageImports: ['lucide-react', '@/components'], // Tree-shaking
  },
  
  // Compressão
  compress: true,
  
  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'], // Formatos modernos
    minimumCacheTTL: 60, // Cache de 60 segundos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Breakpoints otimizados
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tamanhos de thumbnails
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'stackfood-react.6amtech.com',
      },
      {
        protocol: 'https',
        hostname: 'stackfood-admin.6amtech.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'storage.caosplanejado.com',
      },
      {
        protocol: 'https',
        hostname: 'videos.openai.com',
      },
      {
        protocol: 'https',
        hostname: 'mid-noticias.curitiba.pr.gov.br',
      },
      {
        protocol: 'https',
        hostname: 'cirandadoslivros.com.br',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn1.staticpanvel.com.br',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'rgqlncxrzwgjreggrjcq.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'arquivos.mercos.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Headers de performance e segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
