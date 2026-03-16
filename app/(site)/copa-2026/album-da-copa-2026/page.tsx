import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCategoryLinks,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Álbum da Copa 2026: onde encontrar e como acompanhar | Guia das Bancas",
  description:
    "Entenda como acompanhar o lançamento, onde encontrar o álbum da Copa 2026 e como ligar essa busca às bancas e categorias da plataforma.",
  path: "/copa-2026/album-da-copa-2026",
  keywords: ["album da copa 2026", "album panini copa 2026", "onde comprar album da copa 2026"],
});

export default function AlbumDaCopa2026Page() {
  return (
    <WorldCupSeoPage
      title="Álbum da Copa 2026: como transformar essa busca em aquisição"
      description="A busca pelo álbum é uma das portas de entrada mais fortes do cluster. Esta página organiza a intenção do usuário e empurra a navegação para compra local, categorias relacionadas e sinais de disponibilidade."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Álbum da Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026/album-da-copa-2026") },
      ]}
      quickFacts={[
        {
          label: "Intenção",
          value: "Compra do álbum",
          detail: "Usuário ainda está no começo da jornada e precisa ser levado para a vitrine correta.",
        },
        {
          label: "Objetivo SEO",
          value: "Rankear + converter",
          detail: "É uma página de meio de funil com forte ponte para compra local.",
        },
      ]}
      primaryCta={{ href: "/copa-2026/onde-comprar", label: "Encontrar bancas" }}
      secondaryCta={{ href: "/categorias/panini?sub=albuns", label: "Ver álbuns" }}
      sectionBlocks={[
        {
          title: "Por que esta página existe",
          body: "Quem busca pelo álbum quer uma resposta rápida: onde está, quanto custa e como começar. A página precisa responder isso sem virar só texto informativo. O ideal é orientar a pessoa para a categoria certa e para bancas que já estão no ecossistema.",
        },
        {
          title: "O que deve aparecer aqui ao longo da operação",
          body: "Com o cluster maduro, esta página deve ser atualizada com sinais reais do marketplace, como oferta de álbuns, kits, categorias ativas e links para bancas que trabalham forte com colecionáveis e Panini.",
          bullets: [
            "Link para a vitrine de álbuns.",
            "Entrada para páginas locais por cidade.",
            "FAQ para reduzir dúvida e aumentar rich results.",
          ],
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/album-da-copa-2026"),
        ...getWorldCupCategoryLinks(),
      ]}
      faqs={[
        {
          question: "Qual é a melhor URL para intenção de álbum da Copa 2026?",
          answer: "Uma URL dedicada e estável, com copy própria e links para categoria, compra local e páginas da Copa, tende a performar melhor do que uma busca interna genérica.",
        },
        {
          question: "Esta página deve falar só do produto?",
          answer: "Não. Ela precisa orientar a jornada inteira do usuário até a compra, conectando álbum, figurinhas, bancas e cidades.",
        },
      ]}
    />
  );
}
