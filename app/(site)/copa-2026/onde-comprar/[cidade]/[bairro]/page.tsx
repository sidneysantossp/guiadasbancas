import { notFound } from "next/navigation";
import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCategoryLinks,
  getWorldCupCityBySlug,
  getWorldCupNeighborhoodBancas,
  getWorldCupNeighborhoodBySlug,
  getWorldCupNeighborhoodsByCity,
} from "@/lib/seo/world-cup-2026";

export const revalidate = 3600;

export function generateStaticParams() {
  return ["sao-paulo-sp", "rio-de-janeiro-rj", "curitiba-pr"].flatMap((cidade) =>
    getWorldCupNeighborhoodsByCity(cidade).map((bairro) => ({
      cidade,
      bairro: bairro.slug,
    }))
  );
}

export function generateMetadata({ params }: { params: { cidade: string; bairro: string } }) {
  const city = getWorldCupCityBySlug(params.cidade);
  const neighborhood = getWorldCupNeighborhoodBySlug(params.cidade, params.bairro);

  if (!city || !neighborhood) {
    return buildWorldCupMetadata({
      title: "Onde comprar figurinhas da Copa 2026 por bairro | Guia das Bancas",
      description: "Veja bancas e caminhos para encontrar álbum e figurinhas da Copa 2026 em bairros estratégicos.",
      path: `/copa-2026/onde-comprar/${params.cidade}/${params.bairro}`,
    });
  }

  return buildWorldCupMetadata({
    title: `Onde comprar figurinhas da Copa 2026 em ${neighborhood.label}, ${city.city} | Guia das Bancas`,
    description: `Página local para buscas por álbum e figurinhas da Copa 2026 em ${neighborhood.label}, ${city.label}, conectando intenção de bairro a bancas e categorias reais.`,
    path: `/copa-2026/onde-comprar/${city.slug}/${neighborhood.slug}`,
    keywords: [
      `figurinhas da copa 2026 ${neighborhood.label.toLowerCase()}`,
      `album da copa 2026 ${neighborhood.label.toLowerCase()}`,
      `onde comprar figurinhas da copa 2026 em ${neighborhood.label.toLowerCase()}`,
    ],
  });
}

export default async function OndeComprarCopaBairroPage({
  params,
}: {
  params: { cidade: string; bairro: string };
}) {
  const city = getWorldCupCityBySlug(params.cidade);
  const neighborhood = getWorldCupNeighborhoodBySlug(params.cidade, params.bairro);
  if (!city || !neighborhood) notFound();

  const [bancas, categoryLinks] = await Promise.all([
    getWorldCupNeighborhoodBancas(city.slug, neighborhood.slug, 8),
    getWorldCupCategoryLinks(),
  ]);

  const siblingNeighborhoods = getWorldCupNeighborhoodsByCity(city.slug)
    .filter((item) => item.slug !== neighborhood.slug)
    .map((item) => ({
      href: `/copa-2026/onde-comprar/${city.slug}/${item.slug}`,
      title: `Figurinhas da Copa 2026 em ${item.label}`,
      description: `Página de bairro para busca local em ${item.label}, ${city.city}.`,
    }));

  const itemListSchema =
    bancas.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Bancas com potencial para figurinhas da Copa 2026 em ${neighborhood.label}, ${city.label}`,
          itemListElement: bancas.map((banca, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: buildAbsoluteSiteUrl(banca.href),
            name: banca.name,
          })),
        }
      : null;

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${neighborhood.label}, ${city.label}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.state,
      addressCountry: "BR",
    },
  };

  return (
    <WorldCupSeoPage
      title={`Onde comprar figurinhas da Copa 2026 em ${neighborhood.label}, ${city.city}`}
      description={`Esta landing de bairro captura intenção hiperlocal e empurra o usuário para bancas reais, categorias ligadas à coleção e rotas comerciais do cluster da Copa 2026.`}
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Onde comprar", href: buildAbsoluteSiteUrl("/copa-2026/onde-comprar") },
        { name: city.label, href: buildAbsoluteSiteUrl(`/copa-2026/onde-comprar/${city.slug}`) },
        {
          name: neighborhood.label,
          href: buildAbsoluteSiteUrl(`/copa-2026/onde-comprar/${city.slug}/${neighborhood.slug}`),
        },
      ]}
      quickFacts={[
        {
          label: "Bairro alvo",
          value: `${neighborhood.label}, ${city.city}`,
          detail: "Camada hiperlocal desenhada para capturar variações de bairro e converter em descoberta de bancas.",
        },
        {
          label: "Tipo de intenção",
          value: "Geo + compra recorrente",
          detail: "Busca de bairro tende a ter intenção forte de visita, recompra e organização da coleção.",
        },
      ]}
      primaryCta={{ href: `/copa-2026/onde-comprar/${city.slug}`, label: `Voltar para ${city.city}` }}
      secondaryCta={{ href: "/bancas-perto-de-mim", label: "Buscar bancas perto de mim" }}
      sectionBlocks={[
        {
          title: `Como rankear ${neighborhood.label} dentro de ${city.city}`,
          body: `A busca por bairro é mais específica do que a busca por cidade. Nesta camada, o conteúdo deixa claro o contexto local, aponta para bancas reais e mantém conexão com categorias e páginas da Copa 2026 que já carregam intenção transacional.`,
        },
        {
          title: "O que faz esta página ter valor para SEO",
          body: "Ela aproxima o cluster do comportamento real do colecionador. Em vez de uma página genérica, o usuário encontra uma entrada local que pode ser reforçada com bancas, eventos de troca, categorias e páginas comerciais.",
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/onde-comprar"),
        ...categoryLinks,
      ]}
      cityLinks={siblingNeighborhoods}
      bancas={bancas}
      extraSchemas={[placeSchema, ...(itemListSchema ? [itemListSchema] : [])]}
      faqs={[
        {
          question: `Por que vale ter uma página para ${neighborhood.label}?`,
          answer: `Porque a intenção de bairro é mais próxima da ação. Quem busca por ${neighborhood.label} normalmente quer uma opção acessível e recorrente para comprar e voltar ao longo da coleção.`,
        },
        {
          question: "Estas páginas podem receber eventos de troca depois?",
          answer: "Sim. Essa é justamente a camada ideal para evoluir o cluster com encontros locais, dias de troca e sinais de abastecimento por região.",
        },
      ]}
    />
  );
}
