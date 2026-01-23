import type { Metadata } from "next";
import ProductPageClient from "@/components/ProductPageClient";
import type { Produto } from "@/types/admin";

function parseSlugId(slugId: string) {
  // Formato esperado: "nome-do-produto-UUID" onde UUID tem padrão xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  // Regex para UUID v4
  const uuidPattern = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i;
  const match = slugId.match(uuidPattern);
  
  if (match) {
    // Encontrou UUID no final
    const id = match[1];
    const nameSlug = slugId.substring(0, slugId.lastIndexOf(id) - 1); // -1 para remover o hífen antes do UUID
    return { nameSlug, id };
  }
  
  // Fallback: tenta padrão antigo "prod-123456789"
  const oldPattern = /^(.*)-(prod-\d+)$/;
  const oldMatch = slugId.match(oldPattern);
  if (oldMatch) {
    return { nameSlug: oldMatch[1], id: oldMatch[2] };
  }
  
  // Último fallback: assume que tudo é o ID (para URLs diretas tipo /produto/uuid)
  return { nameSlug: '', id: slugId };
}

function deslugify(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

async function getProductData(productId: string): Promise<Produto | null> {
  try {
    // Primeiro tenta buscar do Supabase
    const { supabaseAdmin } = await import("@/lib/supabase");
    const { data } = await supabaseAdmin
      .from('products')
      .select('*, bancas(id, is_cotista, cotista_id, active)')
      .eq('id', productId)
      .single();
    
    if (data) {
      // Produtos de distribuidor são públicos
      if ((data as any).distribuidor_id) {
        return data as Produto;
      }
      // Produtos próprios só são públicos se a banca for cotista ativa
      const banca = (data as any)?.bancas;
      const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);
      if (!isActiveCotistaBanca(banca)) {
        return null;
      }
      return data as Produto;
    }

    return null;
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
  const productImage = product?.images?.[0] || "/placeholder/product.svg";
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

export default function ProdutoPage({ params, searchParams }: { params: { id: string }, searchParams: { banca?: string } }) {
  const { id } = parseSlugId(params.id);
  const bancaId = searchParams?.banca || undefined;
  console.log("URL param:", params.id);
  console.log("Parsed ID:", id);
  console.log("Banca ID from query:", bancaId);
  return (
    <div className="">
      <ProductPageClient productId={id} bancaIdOverride={bancaId} />
    </div>
  );
}
