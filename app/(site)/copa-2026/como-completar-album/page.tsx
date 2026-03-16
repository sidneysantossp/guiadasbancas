import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_EDITORIAL_LINKS,
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCategoryLinks,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Como completar o álbum da Copa 2026 | Guia das Bancas",
  description:
    "Veja a página estratégica para captar buscas sobre completar o álbum da Copa 2026 com menos custo, mais trocas e melhor uso das bancas.",
  path: "/copa-2026/como-completar-album",
  keywords: ["como completar album da copa 2026", "completar figurinhas copa 2026", "faltantes copa 2026"],
});

export const revalidate = 3600;

export default async function ComoCompletarAlbumPage() {
  const categoryLinks = await getWorldCupCategoryLinks();

  return (
    <WorldCupSeoPage
      title="Como completar o álbum da Copa 2026"
      description="Esta página captura a intenção de quem já começou a coleção e agora quer reduzir custo, repetir menos e encontrar bancas, kits e oportunidades de troca."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Como completar o álbum", href: buildAbsoluteSiteUrl("/copa-2026/como-completar-album") },
      ]}
      primaryCta={{ href: "/copa-2026/troca-de-figurinhas", label: "Ver página de troca" }}
      secondaryCta={{ href: "/copa-2026/onde-comprar", label: "Buscar bancas" }}
      sectionBlocks={[
        {
          title: "Por que essa intenção é valiosa",
          body: "Quem quer completar o álbum volta várias vezes à busca. Isso cria uma boa oportunidade de retenção orgânica: a plataforma pode servir tanto para compra recorrente quanto para apoio local em trocas e reposição.",
        },
        {
          title: "Como esta página se conecta ao marketplace",
          body: "Ela deve distribuir o usuário para bancas, categorias e páginas locais onde a intenção pode ser resolvida. Também pode empurrar a newsletter temática para alertas de abastecimento e movimentação de colecionáveis.",
          bullets: [
            "Ligar com páginas de raras e troca.",
            "Reforçar bancas como ponto físico de encontro e recompra.",
            "Usar FAQs para capturar rich results úteis para colecionadores.",
          ],
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/como-completar-album"),
        ...categoryLinks,
      ]}
      editorialLinks={[
        WORLD_CUP_EDITORIAL_LINKS[1],
        WORLD_CUP_EDITORIAL_LINKS[3],
        WORLD_CUP_EDITORIAL_LINKS[0],
      ].filter(Boolean)}
      faqs={[
        {
          question: "Esta página deve focar em compra ou em troca?",
          answer: "Nos dois. O valor dela está justamente em capturar a busca de quem quer completar a coleção e direcionar para o melhor caminho disponível na plataforma.",
        },
      ]}
    />
  );
}
