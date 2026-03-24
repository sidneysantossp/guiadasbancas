import Link from "next/link";
import { WORLD_CUP_CITY_PAGES } from "@/lib/seo/world-cup-2026";

export default function WorldCupHomeSpotlight() {
  const cities = WORLD_CUP_CITY_PAGES.slice(0, 1);

  return (
    <section className="container-max py-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] p-[1px] shadow-xl">
        <div className="rounded-[31px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#0f172a,#111827)] px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Especial Copa 2026
              </span>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                  Figurinhas da Copa 2026 com foco nas bancas de São Paulo
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-200">
                  A campanha da Copa 2026 está concentrada em São Paulo. Use a plataforma para descobrir bancas paulistas perto de você e chegar mais rápido ao álbum ou às figurinhas que está procurando.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/copa-2026"
                  className="inline-flex rounded-full bg-[#ff5c00] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e65300]"
                >
                  Ver hub da Copa 2026
                </Link>
                <Link
                  href="/copa-2026/onde-comprar"
                  className="inline-flex rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Onde comprar
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Cidade ativa da campanha</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-1">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/copa-2026/onde-comprar/${city.slug}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-emerald-400/30 hover:bg-white/10"
                  >
                    <div className="font-semibold text-white">{city.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Operação local ativa para encontrar bancas, álbum e figurinhas da Copa 2026.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
