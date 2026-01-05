import { NextResponse } from 'next/server';
import { getAllPosts } from '../(site)/blog/posts';

export async function GET() {
  const baseUrl = 'https://www.guiadasbancas.com.br';
  const posts = getAllPosts();
  
  // URLs principais do site
  const staticPages = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/faq`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/sobre`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/contato`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    }
  ];

  // URLs dos posts do blog
  const blogPosts = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'weekly',
    priority: 0.8
  }));

  // Combinar todas as URLs
  const allUrls = [...staticPages, ...blogPosts];

  // Gerar XML do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
