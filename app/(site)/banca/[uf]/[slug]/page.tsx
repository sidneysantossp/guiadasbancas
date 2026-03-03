import type { Metadata } from "next";
import BancaPageClient from "@/components/BancaPageClient";
import { toBancaSlug } from "@/lib/slug";
import { getAdminBancaById, getAdminBancasAll } from "@/lib/data/bancas";

function unslugify(s: string) {
  try {
    return decodeURIComponent(s)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return s;
  }
}

function decodeSegment(value: string) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return value || "";
  }
}

function toSafeJsonLd(value: unknown) {
  // Evita quebra de HTML/hydration quando há "<", ">" ou "&" em dados dinâmicos.
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export async function generateMetadata({ params }: { params: { uf: string; slug: string } }): Promise<Metadata> {
  const ufDecoded = decodeSegment(params.uf);
  const slugDecoded = decodeSegment(params.slug);
  const uf = (ufDecoded || "").toUpperCase();
  const slug = slugDecoded || "Banca";
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  const possibleId = uuidMatch ? uuidMatch[0] : '';
  const namePart = possibleId ? slug.slice(0, Math.max(0, slug.length - possibleId.length - 1)) : slug;
  const name = unslugify(namePart);
  const title = `${name} em ${uf} — Guia das Bancas`;
  const description = `Descubra a ${name} em ${uf}. Veja endereço, horário de funcionamento, avaliações, produtos e como chegar. Encontre bancas perto de você no Guia das Bancas.`;
  const url = `https://guiadasbancas.com.br/banca/${params.uf}/${params.slug}`;
  const keywords = [
    name,
    "banca de jornal",
    "banca perto de mim",
    `banca ${uf}`,
    "jornais",
    "revistas",
    "conveniência",
  ];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Guia das Bancas",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BancaSlugPage({ params }: { params: { uf: string; slug: string } }) {
  const slug = decodeSegment(params.slug);
  const uf = decodeSegment(params.uf);
  // 1) Resolver ID de forma robusta: buscar todas e casar pelo padrão slug(name)+'-'+id
  let resolvedId: string | null = null;
  try {
    const list: Array<{ id: string; name: string }> = await getAdminBancasAll();
    for (const b of list) {
      const s = `${toBancaSlug(b.name)}-${b.id}`;
      if (s === slug) { resolvedId = b.id; break; }
    }
  } catch {}

  // 2) Heurística antiga: tentar pegar último token se parecer com id numérico
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  const heuristicId = uuidMatch ? uuidMatch[0] : '';
  const namePart = heuristicId ? slug.slice(0, Math.max(0, slug.length - heuristicId.length - 1)) : slug;
  const name = unslugify(namePart);
  const url = `https://guiadasbancas.com.br/banca/${uf}/${slug}`;

  // Tenta buscar dados reais da banca para JSON-LD
  let ld: any = null;
  try {
    const targetId = resolvedId || heuristicId || slug;
    const b = await getAdminBancaById(targetId);
    if (b) {
      const sameAs: string[] = [];
      if (b.socials?.facebook) sameAs.push(b.socials.facebook);
      if (b.socials?.instagram) sameAs.push(b.socials.instagram);
      if (b.socials?.gmb) sameAs.push(b.socials.gmb);
      const hs = Array.isArray(b.hours) ? b.hours : [];
      const daysMap: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
      const openingHoursSpecification = hs.map((h: any) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [daysMap[h.key] || 'Monday'],
        opens: h.open ? h.start : undefined,
        closes: h.open ? h.end : undefined,
      }));
      ld = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: b.name || name,
        address: {
          "@type": "PostalAddress",
          streetAddress: [b.addressObj?.street, b.addressObj?.number].filter(Boolean).join(', '),
          addressLocality: b.addressObj?.city,
          addressRegion: (b.addressObj?.uf || uf).toUpperCase(),
          postalCode: b.addressObj?.cep,
          addressCountry: "BR",
        },
        url,
        image: [b.cover || b.images?.cover].filter(Boolean),
        geo: (b.lat || b.location?.lat) && (b.lng || b.location?.lng) ? {
          "@type": "GeoCoordinates",
          latitude: b.lat || b.location?.lat,
          longitude: b.lng || b.location?.lng,
        } : undefined,
        openingHoursSpecification,
        sameAs,
        aggregateRating: typeof b.rating === 'number' && typeof b.reviews === 'number' ? { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.reviews } : undefined,
      };
    }
  } catch {}

  if (!ld) {
    ld = {
      "@context": "https://schema.org",
      "@type": "Store",
      name,
      address: {
        "@type": "PostalAddress",
        addressRegion: uf.toUpperCase(),
        addressCountry: "BR",
      },
      url,
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:00", closes: "13:00" }
      ],
      sameAs: [] as string[],
    };
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://guiadasbancas.com.br/" },
      { "@type": "ListItem", position: 2, name: "Bancas", item: "https://guiadasbancas.com.br/bancas-perto-de-mim" },
      { "@type": "ListItem", position: 3, name: uf.toUpperCase(), item: `https://guiadasbancas.com.br/banca/${uf}` },
      { "@type": "ListItem", position: 4, name: name, item: url },
    ],
  };
  // Por hora usamos o slug como identificador mock da banca.
  // Quando integrarmos com o backend, buscaremos por (uf, slug) -> bancaId e preencheremos JSON-LD real.
  return (
    <>
      <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(ld) }} />
      <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(breadcrumbLd) }} />
      <BancaPageClient bancaId={resolvedId || heuristicId || slug} />
    </>
  );
}
