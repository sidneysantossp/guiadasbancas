import type { Metadata } from "next";
import OfertasPageClient from "@/components/OfertasPageClient";

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
  const name = unslugify(params.slug || "Banca");
  const title = `Ofertas e Promoções — ${name} em ${uf} — Guia das Bancas`;
  const description = `Veja as ofertas e promoções da ${name} em ${uf}. Filtre por preço, avaliação e ordene pelos maiores descontos. Encontre os melhores preços no Guia das Bancas.`;
  const url = `https://guiadasbancas.com.br/banca/${params.uf}/${params.slug}/ofertas`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "Guia das Bancas", locale: "pt_BR" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function OfertasPage({ params }: { params: { uf: string; slug: string } }) {
  const url = `https://guiadasbancas.com.br/banca/${params.uf}/${params.slug}/ofertas`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://guiadasbancas.com.br/" },
      { "@type": "ListItem", position: 2, name: "Bancas", item: "https://guiadasbancas.com.br/bancas-perto-de-mim" },
      { "@type": "ListItem", position: 3, name: (params.uf || '').toUpperCase(), item: `https://guiadasbancas.com.br/banca/${params.uf}` },
      { "@type": "ListItem", position: 4, name: "Ofertas", item: url },
    ],
  };
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ofertas e Promoções",
    url,
    isPartOf: `https://guiadasbancas.com.br/banca/${params.uf}/${params.slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <OfertasPageClient params={params} />
    </>
  );
}
