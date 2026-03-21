"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarBancaPage() {
  const params = useParams();
  const router = useRouter();
  const bancaId = params.id as string;

  useEffect(() => {
    if (!bancaId) return;
    const query = new URLSearchParams({
      banca: bancaId,
      tab: "banca",
    });
    router.replace(`/jornaleiro/banca-v2?${query.toString()}`);
  }, [bancaId, router]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff5c00]" />
        <p className="mt-4 text-sm text-gray-600">Abrindo edição da banca...</p>
      </div>
    </div>
  );
}
