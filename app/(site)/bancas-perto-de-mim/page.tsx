import BancasPertoDeMimPageClient from "@/components/BancasPertoDeMimPageClient";
import WorldCupClusterLinks from "@/components/seo/WorldCupClusterLinks";
import { getMergedCategories } from "@/lib/data/categories";
import { getAdminBancas } from "@/lib/data/bancas";

type CategoryItem = { id: string; name: string };

async function fetchBancas(): Promise<any[] | null> {
  try {
    return await getAdminBancas();
  } catch {
    return null;
  }
}

export default async function BancasPertoDeMimPage() {
  const [mergedCategories, initialBancas] = await Promise.all([
    getMergedCategories(),
    fetchBancas(),
  ]);
  const initialCategories: CategoryItem[] = mergedCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <>
      <div className="container-max pt-10 md:pt-12">
        <WorldCupClusterLinks
          variant="compact"
          title="Use a busca local para encontrar bancas com potencial para a Copa 2026"
          description="Esta é uma das URLs mais fortes para intenção geográfica. Ela conecta descoberta por proximidade com álbum, figurinhas, troca e recompra da coleção."
        />
      </div>
      <BancasPertoDeMimPageClient
        initialBancas={initialBancas ?? undefined}
        initialCategories={initialCategories}
      />
    </>
  );
}
