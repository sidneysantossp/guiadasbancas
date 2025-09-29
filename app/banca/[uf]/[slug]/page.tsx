import type { Metadata } from "next";
import BancaPageClient from "@/components/BancaPageClient";

function unslugify(s: string) {
  try {
    return decodeURIComponent(s)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return s;
  }
}

export async function generateMetadata({ params }: { params: { uf: string; slug: string } }): Promise<Metadata> {
  const uf = (params.uf || "").toUpperCase();
  const slug = params.slug || "Banca";
  const parts = slug.split('-');
  const possibleId = parts.length > 1 ? parts[parts.length - 1] : '';
  const namePart = possibleId && /\d/.test(possibleId) ? slug.slice(0, slug.lastIndexOf('-' + possibleId)) : slug;
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
  const { uf, slug } = params;
  const parts = slug.split('-');
  const possibleId = parts.length > 1 ? parts[parts.length - 1] : '';
  const namePart = possibleId && /\d/.test(possibleId) ? slug.slice(0, slug.lastIndexOf('-' + possibleId)) : slug;
  const name = unslugify(namePart);
  const url = `https://guiadasbancas.com.br/banca/${uf}/${slug}`;

  // Tenta buscar dados reais da banca para JSON-LD
  let ld: any = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/admin/bancas?id=${encodeURIComponent(possibleId || slug)}`, { cache: 'no-store' });
    if (res.ok) {
      const j = await res.json();
      const b = j?.data;
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
      image: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60"
      ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BancaPageClient bancaId={possibleId || slug} />
    </>
  );
}
