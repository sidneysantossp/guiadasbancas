import { notFound } from "next/navigation";
import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_CITY_PAGES,
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCityBancas,
  getWorldCupCityBySlug,
  getWorldCupCategoryLinks,
  getWorldCupNeighborhoodsByCity,
} from "@/lib/seo/world-cup-2026";

export const revalidate = 3600;

export function generateStaticParams() {
  return WORLD_CUP_CITY_PAGES.map((city) => ({ cidade: city.slug }));
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

  const [bancas, categoryLinks] = await Promise.all([
    getWorldCupCityBancas(city.slug, 8),
    getWorldCupCategoryLinks(),
  ]);
  const neighborhoodLinks = getWorldCupNeighborhoodsByCity(city.slug).map((item) => ({
    href: `/copa-2026/onde-comprar/${city.slug}/${item.slug}`,
    title: `Figurinhas da Copa 2026 em ${item.label}`,
    description: `Long-tail local para busca por álbum, figurinhas e bancas em ${item.label}, ${city.city}.`,
  }));
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
      description={`Landing page local para quem procura figurinhas da Copa 2026 em ${city.label}. Aqui a busca é direcionada para bancas paulistas reais, perfis publicados e rotas de compra local.`}
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
          body: `Quem busca por álbum e figurinhas da Copa 2026 em ${city.label} já está em modo de ação. Esta página existe para levar essa pessoa até bancas paulistas reais, com caminho claro para encontrar, reservar ou seguir para a compra local.`,
        },
        {
          title: "Por que esta URL é decisiva na campanha",
          body: "A operação da Copa 2026 está concentrada em São Paulo. Por isso, esta URL não existe para cobrir o Brasil inteiro, mas para transformar busca local em visita qualificada à banca certa, com menos atrito e mais clareza para o usuário.",
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/onde-comprar"),
        ...categoryLinks,
      ]}
      cityLinks={neighborhoodLinks.map((item) => ({
        href: item.href,
        title: item.title,
        description: item.description,
      }))}
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
