import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";
import {
  buildCanonicalProductPath,
  isDistribuidorProductEnabledForBanca,
  resolveBancaBySlug,
  resolveProductBySlug,
} from "@/lib/server/public-product-route";

type FriendlyProductParams = {
  bancaSlug: string;
  productSlug: string;
};

type FriendlySearchParams = Record<string, string | string[] | undefined>;

function decodeSegment(value: string): string {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return value || "";
  }
}

function sanitizeDescription(value: string): string {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 160);
}

function currentPathFromParams(params: FriendlyProductParams): string {
  return `/${params.bancaSlug}/${params.productSlug}`;
}

function buildQueryString(searchParams?: FriendlySearchParams): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams || {})) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (typeof value === "string" && value.length > 0) {
      query.set(key, value);
    }
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

async function resolveFriendlyPageData(params: FriendlyProductParams) {
  const bancaSlug = decodeSegment(params.bancaSlug);
  const productSlug = decodeSegment(params.productSlug);

  const banca = await resolveBancaBySlug(bancaSlug);
  if (!banca) return null;

  const product = await resolveProductBySlug(productSlug, banca.id);
  if (!product) return null;

  if (product.distribuidor_id) {
    const enabled = await isDistribuidorProductEnabledForBanca(product.id, banca.id);
    if (!enabled) return null;
  }

  return { banca, product };
}

export async function generateMetadata({
  params,
}: {
  params: FriendlyProductParams;
}): Promise<Metadata> {
  const resolved = await resolveFriendlyPageData(params);

  if (!resolved) {
    const fallbackName = decodeSegment(params.productSlug).replace(/-/g, " ");
    const title = `${fallbackName} | Guia das Bancas`;
    const description = `Compre ${fallbackName} com segurança nas bancas próximas de você.`;
    const fallbackPath = currentPathFromParams(params);
    return {
      title,
      description,
      alternates: { canonical: fallbackPath },
      openGraph: {
        title,
        description,
        url: fallbackPath,
        siteName: "Guia das Bancas",
        type: "website",
        locale: "pt_BR",
      },
    };
  }

  const canonicalPath = buildCanonicalProductPath(resolved.banca.name, resolved.product.name);
  const productName = resolved.product.name;
  const productDescription = sanitizeDescription(
    resolved.product.description || `Compre ${productName} com segurança nas bancas próximas de você.`
  );
  const productImage =
    Array.isArray(resolved.product.images) && resolved.product.images.length > 0
      ? resolved.product.images[0]
      : "/placeholder/product.svg";

  return {
    title: `${productName} | Guia das Bancas`,
    description: productDescription,
    keywords: [
      productName,
      "banca de jornal",
      "revistas",
      "jornais",
      "bancas próximas",
      "comprar revista",
      "guia das bancas",
    ].join(", "),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${productName} | Guia das Bancas`,
      description: productDescription,
      url: canonicalPath,
      siteName: "Guia das Bancas",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Guia das Bancas`,
      description: productDescription,
      images: [productImage],
      creator: "@guiadasbancas",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function FriendlyProductPage({
  params,
  searchParams,
}: {
  params: FriendlyProductParams;
  searchParams: FriendlySearchParams;
}) {
  const resolved = await resolveFriendlyPageData(params);
  if (!resolved) {
    notFound();
  }

  const canonicalPath = buildCanonicalProductPath(resolved.banca.name, resolved.product.name);
  const currentPath = currentPathFromParams(params);
  if (canonicalPath !== currentPath) {
    permanentRedirect(`${canonicalPath}${buildQueryString(searchParams)}`);
  }

  return <ProductPageClient productId={resolved.product.id} bancaIdOverride={resolved.banca.id} />;
}
