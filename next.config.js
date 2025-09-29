/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
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
        hostname: 'admin.guiadasbancas.com.br',
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
    ],
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
