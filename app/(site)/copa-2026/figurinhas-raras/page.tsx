import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCategoryLinks,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Figurinhas raras da Copa 2026 | Guia das Bancas",
  description:
    "Página dedicada às buscas por figurinhas raras, especiais e valiosas da Copa 2026, conectando intenção de descoberta com bancas e categorias do marketplace.",
  path: "/copa-2026/figurinhas-raras",
  keywords: ["figurinhas raras copa 2026", "figurinhas especiais copa 2026", "figurinhas valiosas copa 2026"],
});

export default function FigurinhasRarasPage() {
  return (
    <WorldCupSeoPage
      title="Figurinhas raras da Copa 2026"
      description="A busca por raras costuma misturar curiosidade, colecionismo e intenção de compra. Esta página organiza essa intenção e reforça a camada de bancas e colecionáveis do marketplace."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Figurinhas raras", href: buildAbsoluteSiteUrl("/copa-2026/figurinhas-raras") },
      ]}
      primaryCta={{ href: "/categorias/panini?sub=figurinhas", label: "Explorar figurinhas" }}
      secondaryCta={{ href: "/copa-2026/troca-de-figurinhas", label: "Ir para trocas" }}
      sectionBlocks={[
        {
          title: "O valor SEO desta busca",
          body: "Mesmo quando o usuário ainda não está pronto para comprar, a intenção de descobrir raras tem alto engajamento e tende a gerar compartilhamento, retorno e busca complementar por bancas e trocas.",
        },
        {
          title: "Como o marketplace deve capturar essa atenção",
          body: "A melhor saída é usar a página como ponte: ela educa, cria autoridade e encaminha o visitante para categorias, bancas e encontros locais onde o universo de colecionáveis ganha força.",
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/figurinhas-raras"),
        ...getWorldCupCategoryLinks(),
      ]}
      faqs={[
        {
          question: "Figurinhas raras servem para trazer tráfego qualificado?",
          answer: "Sim. Elas ajudam a capturar atenção no topo e no meio do funil, especialmente quando a página leva o usuário para categorias, trocas e bancas do ecossistema.",
        },
      ]}
    />
  );
}
