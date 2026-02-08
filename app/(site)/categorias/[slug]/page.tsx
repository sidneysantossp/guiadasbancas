import type { Metadata } from "next";
import CategoryResultsClient from "@/components/CategoryResultsClient";
import { getPublicCategories } from "@/lib/data/categories";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cats = await getPublicCategories();
  const match = cats.find((c) => c.link?.endsWith(`/categorias/${params.slug}`) || c.link?.includes(`cat=${params.slug}`));
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
  const match = cats.find((c) => c.link?.endsWith(`/categorias/${params.slug}`) || c.link?.includes(`cat=${params.slug}`));
  const title = match?.name ?? params.slug;
  const sub = searchParams?.sub || '';
  return (
    <div className="">
      <div className="container-max pt-8">
        <h1 className="text-center text-lg sm:text-xl font-semibold">Resultado para "{sub ? sub.replace(/-/g, ' ') : title}"</h1>
      </div>
      <CategoryResultsClient slug={params.slug} sub={sub} title={title} initialCategories={cats} />
    </div>
  );
}
