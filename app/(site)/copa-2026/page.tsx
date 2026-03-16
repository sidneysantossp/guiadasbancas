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
  title: "Copa 2026: álbum, figurinhas, bancas e preços | Guia das Bancas",
  description:
    "Acompanhe o hub da Copa 2026 para encontrar álbum, figurinhas, preços, dicas para completar a coleção e bancas perto de você.",
  path: "/copa-2026",
  keywords: [
    "copa 2026",
    "album da copa 2026",
    "figurinhas da copa 2026",
    "onde comprar figurinhas da copa",
    "banca de jornal copa 2026",
  ],
});

export const revalidate = 3600;

export default async function Copa2026HubPage() {
  const [bancas, categoryLinks, products] = await Promise.all([
    getFeaturedWorldCupBancas(6),
    getWorldCupCategoryLinks(),
    getWorldCupRelevantProducts(6),
  ]);
  const productsSchema = buildWorldCupProductsItemListSchema(
    "Coleções esportivas e álbuns relacionados à jornada da Copa 2026",
    products
  );

  return (
    <WorldCupSeoPage
      title="Copa 2026: álbum, figurinhas, bancas e próximos passos"
      description="Este hub organiza a jornada inteira do colecionador: onde comprar, quanto custa, como completar o álbum, onde trocar repetidas e como encontrar bancas com oferta local."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
      ]}
      quickFacts={[
        {
          label: "Foco do cluster",
          value: "Compra + troca + reposição",
          detail: "A arquitetura foi desenhada para capturar intenção comercial e local, não só tráfego informacional.",
        },
        {
          label: "Entrada principal",
          value: "Bancas perto de você",
          detail: "O diferencial do marketplace está em conectar intenção de busca com disponibilidade e proximidade.",
        },
        {
          label: "Próxima ação",
          value: "Assinar alertas",
          detail: "Newsletter e páginas locais ajudam a capturar demanda antes e durante o pico de busca.",
        },
      ]}
      primaryCta={{ href: "/copa-2026/onde-comprar", label: "Ver onde comprar" }}
      secondaryCta={{ href: "/categorias/panini?sub=figurinhas", label: "Explorar figurinhas" }}
      sectionBlocks={[
        {
          title: "O papel deste hub na estratégia de SEO",
          body: "Esta página funciona como a mãe do cluster. Ela concentra autoridade tópica e distribui links internos para todas as intenções importantes ligadas à Copa 2026: álbum, figurinhas, preço, troca, raras e compra local.",
          bullets: [
            "Liga a intenção editorial à intenção transacional.",
            "Conecta conteúdo nacional com páginas locais por cidade.",
            "Entrega caminho direto para categorias, bancas e alertas de estoque.",
          ],
        },
        {
          title: "Como o marketplace vence nessa disputa",
          body: "O Guia das Bancas não precisa competir como uma loja oficial. A oportunidade maior está em se posicionar como plataforma de descoberta local: onde tem estoque, quem vende perto, quais bancas aparecem primeiro e como reduzir o atrito para completar o álbum.",
          bullets: [
            "Rankear por 'onde comprar' e 'perto de mim' tende a converter melhor.",
            "Páginas de banca e categoria dão prova local e cobertura de produto.",
            "O blog sustenta autoridade e alimenta o cluster principal com links internos.",
          ],
        },
        {
          title: "O que deve crescer depois desta primeira camada",
          body: "Depois do hub e dos sub-hubs, o próximo estágio é aumentar a profundidade local e programática: mais cidades, mais FAQs por intenção, mais schema e interligação entre bancas, produtos e coleções da Copa 2026.",
        },
      ]}
      relatedLinks={[...WORLD_CUP_SUBHUBS, ...categoryLinks]}
      editorialLinks={WORLD_CUP_EDITORIAL_LINKS}
      cityLinks={WORLD_CUP_CITY_PAGES.map((city) => ({
        href: `/copa-2026/onde-comprar/${city.slug}`,
        title: `Onde comprar em ${city.label}`,
        description: `Landing page local para intenção transacional de ${city.label}.`,
      }))}
      bancas={bancas}
      products={products}
      extraSchemas={productsSchema ? [productsSchema] : []}
      faqs={[
        {
          question: "Qual é a função da página Copa 2026 dentro do site?",
          answer: "Ela concentra autoridade temática e distribui links internos para as principais intenções de busca ligadas ao álbum, às figurinhas e à compra local nas bancas.",
        },
        {
          question: "Vale mais investir em páginas genéricas ou páginas locais?",
          answer: "As duas são necessárias, mas as páginas locais tendem a converter melhor porque conectam a intenção do usuário à disponibilidade real do marketplace.",
        },
        {
          question: "Este hub substitui as páginas de categoria?",
          answer: "Não. O hub organiza a intenção da Copa 2026, enquanto as páginas de categoria e de banca sustentam a parte transacional e local da jornada.",
        },
      ]}
    />
  );
}
