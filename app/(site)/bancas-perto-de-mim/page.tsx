import BancasPertoDeMimPageClient from "@/components/BancasPertoDeMimPageClient";
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
    <BancasPertoDeMimPageClient
      initialBancas={initialBancas ?? undefined}
      initialCategories={initialCategories}
    />
  );
}
