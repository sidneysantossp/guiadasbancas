import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_CITY_PAGES,
  WORLD_CUP_EDITORIAL_LINKS,
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupProductsItemListSchema,
  buildWorldCupMetadata,
  getFeaturedWorldCupBancas,
  getWorldCupCategoryLinks,
  getWorldCupRelevantProducts,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Onde comprar figurinhas da Copa 2026 em São Paulo | Guia das Bancas",
  description:
    "Encontre a principal porta de entrada para comprar álbum e figurinhas da Copa 2026 em São Paulo, com foco nas bancas cadastradas da plataforma.",
  path: "/copa-2026/onde-comprar",
  keywords: ["onde comprar figurinhas da copa 2026 em sao paulo", "banca com figurinhas da copa em sao paulo", "onde comprar album da copa 2026 em sao paulo"],
});

export const revalidate = 3600;

export default async function OndeComprarCopa2026Page() {
  const [bancas, categoryLinks, products] = await Promise.all([
    getFeaturedWorldCupBancas(8),
    getWorldCupCategoryLinks(),
    getWorldCupRelevantProducts(6),
  ]);
  const productsSchema = buildWorldCupProductsItemListSchema(
    "Produtos esportivos e coleções relacionados à intenção de compra local da Copa 2026",
    products
  );

  return (
    <WorldCupSeoPage
      title="Onde comprar figurinhas da Copa 2026 em São Paulo"
      description="Esta é a página comercial central da campanha em São Paulo. Ela existe para levar o usuário das buscas por figurinhas e álbum até bancas paulistas reais, perfis publicados e rotas claras de descoberta local."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Onde comprar", href: buildAbsoluteSiteUrl("/copa-2026/onde-comprar") },
      ]}
      quickFacts={[
        {
          label: "Tipo de busca",
          value: "Transacional local",
          detail: "É a camada que tende a ter melhor taxa de clique e melhor intenção de compra.",
        },
        {
          label: "Destino ideal",
          value: "Cidade + banca + categoria",
          detail: "O ganho acontece quando a página local empurra para um ativo comercial concreto.",
        },
      ]}
      primaryCta={{ href: "/bancas-perto-de-mim", label: "Ver bancas perto de mim" }}
      secondaryCta={{ href: "/categorias/panini", label: "Ver categoria Panini" }}
      sectionBlocks={[
        {
          title: "Como esta página deve funcionar agora",
          body: "Ela precisa ser a ponte entre a busca por figurinhas da Copa 2026 e a camada local da plataforma em São Paulo. Por isso, a prioridade é concentrar a jornada paulista, mostrar bancas reais e levar o usuário para páginas onde a ação de encontrar ou reservar faz sentido.",
        },
        {
          title: "O que faz esta URL ganhar relevância",
          body: "Diferente de um blog informativo, esta página tem intenção de compra explícita. Para performar, ela precisa manter ligação forte com páginas de São Paulo, categorias relacionadas e perfis de banca que sustentem a promessa local da plataforma.",
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/onde-comprar"),
        ...categoryLinks,
      ]}
      editorialLinks={[
        WORLD_CUP_EDITORIAL_LINKS[2],
        WORLD_CUP_EDITORIAL_LINKS[0],
        WORLD_CUP_EDITORIAL_LINKS[1],
      ].filter(Boolean)}
      cityLinks={WORLD_CUP_CITY_PAGES.map((city) => ({
        href: `/copa-2026/onde-comprar/${city.slug}`,
        title: city.label,
        description: `Página local da operação paulista para quem busca álbum e figurinhas da Copa 2026 em ${city.label}.`,
      }))}
      cityLinksTitle="Cidade ativa da campanha"
      bancas={bancas}
      products={products}
      extraSchemas={productsSchema ? [productsSchema] : []}
      faqs={[
        {
          question: "Qual é a melhor estrutura para rankear 'onde comprar figurinhas da Copa 2026'?",
          answer: "Uma página nacional ligada a páginas locais por cidade costuma ser mais forte do que tentar fazer a busca interna responder sozinha por essa intenção.",
        },
        {
          question: "Vale linkar bancas públicas nesta página?",
          answer: "Sim. Isso reforça a camada local do marketplace e ajuda o usuário a avançar da busca para a descoberta de oferta real.",
        },
      ]}
    />
  );
}
