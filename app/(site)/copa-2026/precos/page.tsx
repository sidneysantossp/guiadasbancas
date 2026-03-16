import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupProductsItemListSchema,
  buildWorldCupMetadata,
  getWorldCupCategoryLinks,
  getWorldCupRelevantProducts,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Preços do álbum e das figurinhas da Copa 2026 | Guia das Bancas",
  description:
    "Página do cluster voltada para intenção de preço, comparação de custos e planejamento de compra do álbum e das figurinhas da Copa 2026.",
  path: "/copa-2026/precos",
  keywords: ["preço album copa 2026", "preço figurinhas copa 2026", "quanto custa album da copa 2026"],
});

export const revalidate = 3600;

export default async function PrecosCopa2026Page() {
  const [categoryLinks, products] = await Promise.all([
    getWorldCupCategoryLinks(),
    getWorldCupRelevantProducts(6),
  ]);
  const productsSchema = buildWorldCupProductsItemListSchema(
    "Produtos esportivos usados como referência de preço para a jornada da Copa 2026",
    products
  );

  return (
    <WorldCupSeoPage
      title="Preços do álbum e das figurinhas da Copa 2026"
      description="Quem chega aqui quer orçamento e previsibilidade. A função desta página é responder à intenção de preço e direcionar o usuário para as páginas de compra e categoria que sustentam a conversão."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Preços", href: buildAbsoluteSiteUrl("/copa-2026/precos") },
      ]}
      primaryCta={{ href: "/copa-2026/onde-comprar", label: "Ver onde comprar" }}
      secondaryCta={{ href: "/categorias/panini", label: "Explorar categoria" }}
      sectionBlocks={[
        {
          title: "Como posicionar esta página sem depender de preço fixo",
          body: "A SERP de preço muda rápido. Em vez de travar a página em um número estático, o melhor caminho é explicar a lógica de custo da coleção, orientar a comparação e conectar a pessoa com bancas e categorias que podem refletir o mercado em tempo real.",
        },
        {
          title: "O que esta intenção revela",
          body: "Quem busca preço já avançou no funil. Normalmente está comparando compra do álbum, compra recorrente de figurinhas ou custo de completar faltantes. Por isso, essa página precisa estar fortemente interligada a onde comprar, como completar e troca de figurinhas.",
          bullets: [
            "Preço do álbum.",
            "Preço de pacotes e kits.",
            "Custo total estimado da coleção.",
          ],
        },
      ]}
      relatedLinks={[
        ...WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/precos"),
        ...categoryLinks,
      ]}
      products={products}
      extraSchemas={productsSchema ? [productsSchema] : []}
      faqs={[
        {
          question: "Preciso publicar números exatos nesta página?",
          answer: "Não necessariamente. O principal é capturar a intenção de preço e levar o usuário para os ativos mais próximos da compra real, como categorias, bancas e páginas locais.",
        },
      ]}
    />
  );
}
