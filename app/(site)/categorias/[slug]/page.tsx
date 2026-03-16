import type { Metadata } from "next";
import CategoryResultsClient from "@/components/CategoryResultsClient";
import WorldCupClusterLinks from "@/components/seo/WorldCupClusterLinks";
import { getPublicCategories } from "@/lib/data/categories";
import { isWorldCupRelevantText } from "@/lib/seo/world-cup-2026";

function matchesCategorySlug(link?: string | null, slug?: string) {
  const safeLink = String(link || "");
  const safeSlug = String(slug || "");
  return (
    safeLink.endsWith(`/categorias/${safeSlug}`) ||
    safeLink.endsWith(`/categoria/${safeSlug}`) ||
    safeLink.includes(`cat=${safeSlug}`)
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cats = await getPublicCategories();
  const match = cats.find((c) => matchesCategorySlug(c.link, params.slug));
  const titleText = match?.name || params.slug;
  const title = `${titleText} | Guia das Bancas`;
  const description = `Veja produtos e bancas da categoria ${titleText}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/categorias/${params.slug}`,
    },
  };
}

export default async function CategoriaSelecionadaPage({ params, searchParams }: { params: { slug: string }; searchParams: { sub?: string } }) {
  const cats = await getPublicCategories();
  const match = cats.find((c) => matchesCategorySlug(c.link, params.slug));
  const title = match?.name ?? params.slug;
  const sub = searchParams?.sub || '';
  const pageTopic = sub ? sub.replace(/-/g, " ") : title;
  const showWorldCupCluster = isWorldCupRelevantText(`${title} ${pageTopic}`);

  return (
    <div className="">
      <div className="container-max pt-12 md:pt-14 lg:pt-16">
        <h1 className="text-center text-lg sm:text-xl font-semibold">Resultado para "{pageTopic}"</h1>
      </div>
      {showWorldCupCluster ? (
        <div className="container-max pt-4">
          <WorldCupClusterLinks
            variant="compact"
            title={`Quem busca ${pageTopic} também procura álbum, figurinhas e bancas da Copa 2026`}
            description="Este bloco conecta a categoria atual com as páginas de maior intenção comercial e local do cluster da Copa 2026, sem depender apenas da busca interna."
          />
        </div>
      ) : null}
      <CategoryResultsClient slug={params.slug} sub={sub} title={title} initialCategories={cats} />
    </div>
  );
}
