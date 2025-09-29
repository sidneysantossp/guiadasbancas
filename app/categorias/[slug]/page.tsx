import type { Metadata } from "next";
import CategoryResultsClient from "@/components/CategoryResultsClient";

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('failed');
    const j = await res.json();
    return Array.isArray(j?.data) ? j.data as Array<{ id:string; name:string; image:string; link:string; }> : [];
  } catch {
    return [] as Array<{ id:string; name:string; image:string; link:string; }>;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cats = await fetchCategories();
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

export default async function CategoriaSelecionadaPage({ params }: { params: { slug: string } }) {
  const cats = await fetchCategories();
  const match = cats.find((c) => c.link?.endsWith(`/categorias/${params.slug}`) || c.link?.includes(`cat=${params.slug}`));
  const title = match?.name ?? params.slug;
  return (
    <div className="">
      <div className="container-max pt-8">
        <h1 className="text-center text-lg sm:text-xl font-semibold">Resultado para “{title}”</h1>
      </div>
      <CategoryResultsClient slug={params.slug} title={title} />
    </div>
  );
}
