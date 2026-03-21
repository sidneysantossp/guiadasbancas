import { redirect } from "next/navigation";

export default function JornaleiroBancaLegacyPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const query = new URLSearchParams();

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry) query.append(key, entry);
      });
      return;
    }

    if (value) {
      query.set(key, value);
    }
  });

  const target = query.size > 0
    ? `/jornaleiro/banca-v2?${query.toString()}`
    : "/jornaleiro/banca-v2";

  redirect(target);
}
