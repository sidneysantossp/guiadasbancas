"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDistribuidorSession } from "@/lib/distribuidor-client-session";

export default function DistribuidorIndexPage() {
  const router = useRouter();
  const { distribuidor, loading } = useDistribuidorSession();

  useEffect(() => {
    if (loading) return;

    router.replace(distribuidor?.id ? "/distribuidor/dashboard" : "/distribuidor/login");
  }, [distribuidor?.id, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}
