import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  WORLD_CUP_CITY_PAGES,
  WORLD_CUP_SUBHUBS,
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getFeaturedWorldCupBancas,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Troca de figurinhas da Copa 2026 | Guia das Bancas",
  description:
    "Veja a página estratégica para capturar buscas sobre troca de figurinhas da Copa 2026 e conectar o usuário a bancas, cidades e rotina de coleção.",
  path: "/copa-2026/troca-de-figurinhas",
  keywords: ["troca de figurinhas copa 2026", "onde trocar figurinhas da copa 2026", "repetidas copa 2026"],
});

export default async function TrocaDeFigurinhasPage() {
  const bancas = await getFeaturedWorldCupBancas(6);

  return (
    <WorldCupSeoPage
      title="Troca de figurinhas da Copa 2026"
      description="Troca é uma intenção comunitária, mas também ajuda a reativar demanda por bancas, kits e faltantes. Esta página serve para capturar esse comportamento e amarrar o usuário ao ecossistema local."
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
        { name: "Troca de figurinhas", href: buildAbsoluteSiteUrl("/copa-2026/troca-de-figurinhas") },
      ]}
      primaryCta={{ href: "/copa-2026/como-completar-album", label: "Ver como completar" }}
      secondaryCta={{ href: "/bancas-perto-de-mim", label: "Buscar bancas" }}
      sectionBlocks={[
        {
          title: "Por que a troca entra no cluster principal",
          body: "Durante a Copa, muita gente alterna entre compra e troca. Se a plataforma capturar só a ponta comercial, perde parte importante do tráfego. A página de troca amplia a cobertura do tema e reforça a relevância das bancas como ponto de encontro.",
        },
        {
          title: "Como esta página ajuda o marketplace",
          body: "Ela cria uma camada de comunidade e reduz o risco de o usuário sair do ecossistema quando entra na fase de repetidas. Ao mesmo tempo, segue empurrando para bancas e colecionáveis locais.",
        },
      ]}
      relatedLinks={WORLD_CUP_SUBHUBS.filter((item) => item.href !== "/copa-2026/troca-de-figurinhas")}
      cityLinks={WORLD_CUP_CITY_PAGES.map((city) => ({
        href: `/copa-2026/onde-comprar/${city.slug}`,
        title: `Bancas e troca em ${city.label}`,
        description: `Use a landing local para buscar bancas relacionadas à jornada de coleção em ${city.label}.`,
      }))}
      bancas={bancas}
      faqs={[
        {
          question: "Uma página de troca ajuda a SEO comercial?",
          answer: "Sim, porque ela amplia o topical authority do cluster e mantém o usuário no ecossistema quando a busca deixa de ser só compra direta.",
        },
      ]}
    />
  );
}
