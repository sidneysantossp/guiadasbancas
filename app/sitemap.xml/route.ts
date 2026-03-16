import { NextResponse } from "next/server";
import { getAllPosts } from "../(site)/blog/posts";
import { buildBancaHref } from "@/lib/slug";
import {
  WORLD_CUP_CITY_PAGES,
  getWorldCupNeighborhoodsByCity,
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
} from "@/lib/seo/world-cup-2026";
import { supabaseAdmin } from "@/lib/supabase";

function normalizeCategoryUrl(link: string, fallbackId?: string, fallbackName?: string) {
  const raw = String(link || "").trim();
  if (raw.startsWith("http")) return raw;
  if (raw.includes("/categorias/")) return buildAbsoluteSiteUrl(raw);

  const catMatch = raw.match(/[?&]cat=([^&]+)/i);
  if (catMatch?.[1]) {
    return buildAbsoluteSiteUrl(`/categorias/${decodeURIComponent(catMatch[1])}`);
  }

  const singularMatch = raw.match(/\/categoria\/([^/?#]+)/i);
  if (singularMatch?.[1]) {
    return buildAbsoluteSiteUrl(`/categorias/${decodeURIComponent(singularMatch[1])}`);
  }

  const fallbackSlug = String(fallbackId || fallbackName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!fallbackSlug) return null;
  return buildAbsoluteSiteUrl(`/categorias/${fallbackSlug}`);
}

export async function GET() {
  const baseUrl = "https://www.guiadasbancas.com.br";
  const posts = getAllPosts();

  const staticPages = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categorias`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bancas`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/bancas-perto-de-mim`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/copa-2026`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/faq`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.7,
    },
  ];

  const blogPosts = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: "weekly",
    priority: 0.8,
  }));

  const worldCupPages = [
    ...WORLD_CUP_SUBHUBS.map((item) => ({
      url: buildAbsoluteSiteUrl(item.href),
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9,
    })),
    ...WORLD_CUP_CITY_PAGES.map((city) => ({
      url: buildAbsoluteSiteUrl(`/copa-2026/onde-comprar/${city.slug}`),
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.85,
    })),
    ...WORLD_CUP_CITY_PAGES.flatMap((city) =>
      getWorldCupNeighborhoodsByCity(city.slug).map((neighborhood) => ({
        url: buildAbsoluteSiteUrl(`/copa-2026/onde-comprar/${city.slug}/${neighborhood.slug}`),
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.8,
      }))
    ),
  ];

  const [categoriesResult, bancasResult] = await Promise.all([
    supabaseAdmin
      .from("categories")
      .select("id,name,link,updated_at,active")
      .eq("active", true)
      .order("order", { ascending: true }),
    supabaseAdmin
      .from("bancas")
      .select("id,name,address,updated_at,active")
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);

  const categoryPages = Array.isArray(categoriesResult.data)
    ? categoriesResult.data
        .map((item: any) => ({
          url: normalizeCategoryUrl(item?.link, item?.id, item?.name),
          lastmod: item.updated_at || new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.8,
        }))
        .filter((item) => item.url)
    : [];

  const bancaPages = Array.isArray(bancasResult.data)
    ? bancasResult.data.map((item: any) => ({
        url: buildAbsoluteSiteUrl(buildBancaHref(String(item.name || "banca"), String(item.id), item.address)),
        lastmod: item.updated_at || new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.8,
      }))
    : [];

  const allUrls = [...staticPages, ...worldCupPages, ...categoryPages, ...bancaPages, ...blogPosts]
    .filter((page) => page?.url)
    .filter((page, index, arr) => arr.findIndex((candidate) => candidate.url === page.url) === index);

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
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
