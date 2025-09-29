import type { Metadata } from "next";
import ProductPageClient from "@/components/ProductPageClient";
import { readProducts, type ProdutoItem } from "@/lib/server/productsStore";

function parseSlugId(slugId: string) {
  // espera algo como "nome-do-produto-prod-123456789"; busca por "prod-" seguido de números
  const m = slugId.match(/^(.*)-(prod-\d+)$/);
  if (!m) {
    // Se não encontrar o padrão "prod-", tenta pegar a última parte como ID
    const parts = slugId.split('-');
    const lastPart = parts[parts.length - 1];
    const nameSlug = parts.slice(0, -1).join('-');
    return { nameSlug, id: lastPart };
  }
  return { nameSlug: m[1], id: m[2] };
}

function deslugify(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

async function getProductData(productId: string): Promise<ProdutoItem | null> {
  try {
    let items = await readProducts();
    if (!items.length) {
      const legacy = (globalThis as any).__PRODUCTS_STORE__ as ProdutoItem[] | undefined;
      if (Array.isArray(legacy) && legacy.length) items = legacy;
    }
    const product = items.find((p: ProdutoItem) => p.id === productId);
    return product || null;
  } catch (error) {
    console.error("Erro ao buscar produto para SEO:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { nameSlug, id } = parseSlugId(params.id);
  const product = await getProductData(id);
  
  // Usar dados reais do produto se disponível, senão fallback para slug
  const productName = product?.name || deslugify(nameSlug);
  const productDescription = product?.description || `Compre ${productName} com segurança nas bancas próximas de você.`;
  const productImage = product?.images?.[0] || "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop";
  const productPrice = product?.price || 0;
  
  // Limpar descrição HTML para meta description
  const cleanDescription = productDescription.replace(/<[^>]*>/g, '').substring(0, 160);
  
  return {
    title: `${productName} | Guia das Bancas`,
    description: cleanDescription,
    keywords: [
      productName,
      "banca de jornal",
      "revistas",
      "jornais",
      "bancas próximas",
      "comprar revista",
      "guia das bancas"
    ].join(", "),
    authors: [{ name: "Guia das Bancas" }],
    creator: "Guia das Bancas",
    publisher: "Guia das Bancas",
    alternates: {
      canonical: `/produto/${params.id}`,
    },
    openGraph: {
      title: `${productName} | Guia das Bancas`,
      description: cleanDescription,
      url: `/produto/${params.id}`,
      siteName: "Guia das Bancas",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: productName,
        }
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Guia das Bancas`,
      description: cleanDescription,
      images: [productImage],
      creator: "@guiadasbancas",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code", // Substituir pelo código real
    },
  };
}

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const { id } = parseSlugId(params.id);
  console.log("URL param:", params.id);
  console.log("Parsed ID:", id);
  return (
    <div className="">
      <ProductPageClient productId={id} />
    </div>
  );
}
