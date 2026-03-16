import { notFound } from "next/navigation";
import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCityBancas,
  getWorldCupCityBySlug,
  getWorldCupCategoryLinks,
} from "@/lib/seo/world-cup-2026";

export const revalidate = 3600;

export function generateStaticParams() {
  return [
    { cidade: "sao-paulo-sp" },
    { cidade: "rio-de-janeiro-rj" },
    { cidade: "belo-horizonte-mg" },
    { cidade: "curitiba-pr" },
    { cidade: "porto-alegre-rs" },
    { cidade: "brasilia-df" },
  ];
}

export function generateMetadata({ params }: { params: { cidade: string } }) {
  const city = getWorldCupCityBySlug(params.cidade);
  if (!city) {
    return buildWorldCupMetadata({
      title: "Onde comprar figurinhas da Copa 2026 | Guia das Bancas",
      description: "Veja bancas e caminhos para encontrar álbum e figurinhas da Copa 2026.",
      path: `/copa-2026/onde-comprar/${params.cidade}`,
    });
  }

  return buildWorldCupMetadata({
    title: `Onde comprar figurinhas da Copa 2026 em ${city.label} | Guia das Bancas`,
    description: `Veja como estruturar a busca por álbum e figurinhas da Copa 2026 em ${city.label}, com páginas de banca, categorias e intenção local.`,
    path: `/copa-2026/onde-comprar/${city.slug}`,
    keywords: [
      `figurinhas da copa 2026 ${city.city.toLowerCase()}`,
      `album da copa 2026 ${city.city.toLowerCase()}`,
      `onde comprar figurinhas da copa 2026 em ${city.city.toLowerCase()}`,
    ],
  });
}

export default async function OndeComprarCopaCidadePage({ params }: { params: { cidade: string } }) {
  const city = getWorldCupCityBySlug(params.cidade);
  if (!city) notFound();

  const bancas = await getWorldCupCityBancas(city.slug, 8);
  const itemListSchema =
    bancas.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Bancas com potencial para figurinhas da Copa 2026 em ${city.label}`,
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
    name: city.label,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.state,
      addressCountry: "BR",
    },
  };

  return (
    <WorldCupSeoPage
      title={`Onde comprar figurinhas da Copa 2026 em ${city.label}`}
      description={`Landing page local para capturar buscas de ${city.label} e ligar essa intenção a bancas públicas, categorias relevantes e navegação transacional do Guia das Bancas.`}
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Onde comprar", href: buildAbsoluteSiteUrl("/copa-2026/onde-comprar") },
        {
          name: city.label,
          href: buildAbsoluteSiteUrl(`/copa-2026/onde-comprar/${city.slug}`),
        },
      ]}
      quickFacts={[
        {
          label: "Cidade alvo",
          value: city.label,
          detail: "Esta página organiza a intenção local e empurra o usuário para bancas e categorias indexáveis.",
        },
        {
          label: "Objetivo",
          value: "Rankear busca geo + converter",
          detail: "É uma camada programática do cluster, focada em variações locais do termo principal.",
        },
      ]}
      primaryCta={{ href: "/bancas-perto-de-mim", label: "Buscar bancas perto de mim" }}
      secondaryCta={{ href: "/categorias/panini?sub=figurinhas", label: "Ver figurinhas" }}
      sectionBlocks={[
        {
          title: `Como capturar a demanda de ${city.label}`,
          body: `Quem busca por álbum e figurinhas da Copa 2026 em ${city.label} costuma já ter intenção local. A melhor forma de atender essa SERP é conectar a busca da cidade a bancas reais, categorias relevantes e à navegação comercial do marketplace.`,
        },
        {
          title: "Próximos ganhos desta página",
          body: "Com mais profundidade, esta URL pode receber FAQs por cidade, links de bairro, eventos de troca e sinais de abastecimento. Nesta primeira camada, ela já cria um ativo indexável forte e sem depender da busca interna.",
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/onde-comprar"),
        ...getWorldCupCategoryLinks(),
      ]}
      bancas={bancas}
      extraSchemas={[placeSchema, ...(itemListSchema ? [itemListSchema] : [])]}
      faqs={[
        {
          question: `Por que criar uma página para ${city.label}?`,
          answer: `Porque as buscas locais têm intenção diferente das nacionais. Uma landing dedicada ajuda a rankear termos como 'onde comprar figurinhas da Copa 2026 em ${city.city}' com mais clareza semântica.`,
        },
        {
          question: "Essa página precisa listar bancas reais para funcionar bem?",
          answer: "Idealmente sim, porque isso aproxima a URL da proposta de valor do marketplace. Mesmo assim, a página já ganha relevância por ligar a intenção local a categorias e navegação comercial.",
        },
      ]}
    />
  );
}
