import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCategoryLinks,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Figurinhas da Copa 2026: onde comprar e como encontrar | Guia das Bancas",
  description:
    "Veja como estruturar a busca por figurinhas da Copa 2026 com foco em compra local, repetição de recompra e categorias do marketplace.",
  path: "/copa-2026/figurinhas-da-copa-2026",
  keywords: ["figurinhas da copa 2026", "pacotes copa 2026", "onde comprar figurinhas da copa"],
});

export default function FigurinhasDaCopa2026Page() {
  return (
    <WorldCupSeoPage
      title="Figurinhas da Copa 2026: intenção comercial e recorrência"
      description="A demanda por figurinhas costuma ser recorrente e fragmentada. O objetivo desta página é capturar essa busca e enviar o usuário para categorias, bancas e cidades com maior chance de conversão."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Figurinhas da Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026/figurinhas-da-copa-2026") },
      ]}
      quickFacts={[
        {
          label: "Padrão de demanda",
          value: "Recompra frequente",
          detail: "O mesmo usuário volta várias vezes até completar a coleção.",
        },
        {
          label: "Ponte principal",
          value: "Categoria + banca",
          detail: "A arquitetura deve reduzir o caminho entre busca, estoque percebido e contato local.",
        },
      ]}
      primaryCta={{ href: "/categorias/panini?sub=figurinhas", label: "Ver figurinhas" }}
      secondaryCta={{ href: "/copa-2026/onde-comprar", label: "Buscar bancas" }}
      sectionBlocks={[
        {
          title: "Por que figurinhas merecem uma página própria",
          body: "A palavra 'figurinhas' costuma carregar intenção mais quente do que 'álbum'. Ela pode significar compra imediata, reposição de pacotes ou busca por bancas com oferta ativa. Por isso, merece uma página própria dentro do cluster.",
        },
        {
          title: "Como transformar tráfego em repetição",
          body: "A jornada não termina numa compra. A plataforma precisa estimular retorno do usuário com páginas locais, newsletter temática e descoberta de bancas que trabalham forte com Panini e colecionáveis.",
          bullets: [
            "Interligar esta página com preço, troca e raras.",
            "Usar categorias como camada transacional principal.",
            "Empurrar o usuário para bancas perto de mim quando houver intenção local.",
          ],
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/figurinhas-da-copa-2026"),
        ...getWorldCupCategoryLinks(),
      ]}
      faqs={[
        {
          question: "É melhor usar a categoria Panini ou uma página nova de figurinhas?",
          answer: "Os dois papéis são diferentes. A página nova captura a intenção do evento Copa 2026; a categoria é a camada de produto e conversão do marketplace.",
        },
        {
          question: "A busca interna substitui esta landing page?",
          answer: "Não. Landing page estável com metadata, FAQ e links internos costuma ser melhor ativo SEO do que resultados de busca internos com query string.",
        },
      ]}
    />
  );
}
