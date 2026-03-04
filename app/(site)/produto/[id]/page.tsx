import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";
import {
  buildCanonicalProductPath,
  resolveBancaForProduct,
  resolveProductByRawParam,
} from "@/lib/server/public-product-route";

type ProductPageParams = {
  id: string;
};

type ProductSearchParams = Record<string, string | string[] | undefined>;

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function deslugify(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

export async function generateMetadata({ params }: { params: ProductPageParams }): Promise<Metadata> {
  const product = await resolveProductByRawParam(params.id);
  const productName = product?.name || deslugify(params.id);
  const productDescription = product?.description || `Compre ${productName} com segurança nas bancas próximas de você.`;
  const productImage = product?.images?.[0] || "/placeholder/product.svg";
  const banca = product ? await resolveBancaForProduct(product, undefined) : null;
  const canonicalPath =
    product && banca ? buildCanonicalProductPath(banca.name, product.name) : `/produto/${params.id}`;
  
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
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${productName} | Guia das Bancas`,
      description: cleanDescription,
      url: canonicalPath,
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

export default async function ProdutoPage({
  params,
  searchParams,
}: {
  params: ProductPageParams;
  searchParams: ProductSearchParams;
}) {
  const bancaId = getSingleParam(searchParams?.banca);
  const product = await resolveProductByRawParam(params.id);

  if (!product) {
    notFound();
  }

  const banca = await resolveBancaForProduct(product, bancaId);
  if (banca) {
    const canonicalPath = buildCanonicalProductPath(banca.name, product.name);
    const redirectParams = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams || {})) {
      if (key === "banca") continue;
      if (Array.isArray(value)) {
        value.forEach((item) => redirectParams.append(key, item));
      } else if (typeof value === "string" && value.length > 0) {
        redirectParams.set(key, value);
      }
    }
    const qs = redirectParams.toString();
    permanentRedirect(qs ? `${canonicalPath}?${qs}` : canonicalPath);
  }

  return (
    <div className="">
      <ProductPageClient productId={product.id} bancaIdOverride={bancaId} />
    </div>
  );
}
