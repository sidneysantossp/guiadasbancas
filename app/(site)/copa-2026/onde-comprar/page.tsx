import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_CITY_PAGES,
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getFeaturedWorldCupBancas,
  getWorldCupCategoryLinks,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Onde comprar figurinhas da Copa 2026 | Guia das Bancas",
  description:
    "Encontre a melhor porta de entrada para comprar álbum e figurinhas da Copa 2026: páginas por cidade, categorias e bancas públicas do marketplace.",
  path: "/copa-2026/onde-comprar",
  keywords: ["onde comprar figurinhas da copa 2026", "banca com figurinhas da copa", "onde comprar album da copa 2026"],
});

export const revalidate = 3600;

export default async function OndeComprarCopa2026Page() {
  const bancas = await getFeaturedWorldCupBancas(8);

  return (
    <WorldCupSeoPage
      title="Onde comprar figurinhas da Copa 2026"
      description="Esta é a página de intenção comercial mais importante do cluster. Ela concentra a busca por compra local e distribui o tráfego para cidades, categorias e bancas já indexáveis da plataforma."
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
          title: "Como esta página deve funcionar",
          body: "Ela precisa ser a ponte entre o termo genérico 'onde comprar' e a camada local da plataforma. Por isso, a prioridade é listar cidades estratégicas, categorias relacionadas e bancas públicas que já ajudam o Google a entender o papel local do marketplace.",
        },
        {
          title: "O que faz esta URL ganhar relevância",
          body: "Diferente de um blog informativo, esta página tem intenção de compra explícita. Para performar, ela precisa manter ligação forte com páginas de cidade, categoria e banca, além de atualização contínua de links internos vindos do blog e das páginas de coleção.",
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/onde-comprar"),
        ...getWorldCupCategoryLinks(),
      ]}
      cityLinks={WORLD_CUP_CITY_PAGES.map((city) => ({
        href: `/copa-2026/onde-comprar/${city.slug}`,
        title: city.label,
        description: `Página local para quem busca álbum e figurinhas da Copa 2026 em ${city.label}.`,
      }))}
      bancas={bancas}
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
