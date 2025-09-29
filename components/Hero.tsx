"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStoredLocation, UserLocation } from "@/lib/location";

export default function Hero() {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  useEffect(() => { setLoc(loadStoredLocation()); }, []);
  const uf = (loc?.state || "sp").toLowerCase();
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-[#fff3ec]">
      <div className="container-max py-12 sm:py-16">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Encontre produtos nas bancas perto de você
          </h1>
          <p className="text-gray-700 text-base sm:text-lg">
            Descubra revistas, jornais, papelaria, snacks, recargas e muito mais nas bancas da sua região.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={{ pathname: "/bancas-perto-de-mim", query: { uf } }}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
            >
              Explorar bancas perto de mim
            </Link>
            <Link
              href="/jornaleiro"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-black shadow-sm hover:bg-gray-50"
            >
              Sou Jornaleiro
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl" />
    </section>
  );
}
