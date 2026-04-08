import BancasPertoDeMimPageClient from "@/components/BancasPertoDeMimPageClient";
import { getMergedCategories } from "@/lib/data/categories";

type CategoryItem = { id: string; name: string };

export default async function BancasPertoDeMimPage() {
  const mergedCategories = await getMergedCategories();
  const initialCategories: CategoryItem[] = mergedCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <BancasPertoDeMimPageClient initialCategories={initialCategories} />
  );
}
