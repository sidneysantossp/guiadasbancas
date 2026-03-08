"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readDistribuidorClientAuth } from "@/lib/distribuidor-client-auth";

export default function DistribuidorIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const { distribuidor, sessionToken } = readDistribuidorClientAuth();

    if (distribuidor?.id && sessionToken) {
      router.replace("/distribuidor/dashboard");
    } else {
      router.replace("/distribuidor/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}
