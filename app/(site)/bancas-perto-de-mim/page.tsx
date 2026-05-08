import BancasPertoDeMimPageClient from "@/components/BancasPertoDeMimPageClient";
import { getPublicCategories } from "@/lib/data/categories";

type CategoryItem = { id: string; name: string };

export default async function BancasPertoDeMimPage() {
  const publicCategories = await getPublicCategories();
  const initialCategories: CategoryItem[] = publicCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <BancasPertoDeMimPageClient initialCategories={initialCategories} />
  );
}
