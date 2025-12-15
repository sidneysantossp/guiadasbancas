import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { categories as fallbackCategories } from "@/components/categoriesData";

export const metadata: Metadata = {
  title: "Categorias | Guia das Bancas",
  description: "Explore as categorias do Guia das Bancas e encontre produtos por departamento.",
  alternates: {
    canonical: "/categorias",
  },
};

async function fetchCategories() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`;
    // Debug removido para produção
    
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      // Erro silenciado em produção
      throw new Error('failed');
    }
    
    const j = await res.json();
        
    const list = Array.isArray(j?.data) ? j.data as Array<{ id:string; name:string; image:string; link:string; }> : [];
    
        return list.length ? list : null;
  } catch (err) {
    // Erro silenciado em produção
    return null as any;
  }
}

export default async function CategoriasPage() {
  const api = await fetchCategories();
  const list = api ?? fallbackCategories.map((c)=> ({ id: c.slug, name: c.name, image: c.image || '', link: `/categorias/${c.slug}` }));
  return (
    <div className="container-max py-8 pb-32">
      <h1 className="text-center text-lg sm:text-xl font-semibold">
        O produto que você busca, <span className="text-[var(--color-primary)]">na banca tem!</span>
      </h1>

      <div className="mt-8 mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {list.map((c: any) => (
          <Link
            key={c.id}
            href={(c.link as Route)}
            className="group flex flex-col items-center gap-2"
          >
            <div className={`h-24 w-24 sm:h-28 sm:w-28 rounded-[24px] sm:rounded-[28px] grid place-items-center shadow transition-transform group-hover:scale-[1.02] group-hover:shadow-md bg-white overflow-hidden`}>
              {c.image ? (
                <Image src={c.image} alt={c.name} width={112} height={112} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-[#ff5c00] font-semibold">{c.name[0]}</span>
              )}
            </div>
            <div className="text-sm font-medium text-gray-800 text-center line-clamp-1">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
