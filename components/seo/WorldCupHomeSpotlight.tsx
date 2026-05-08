import Link from "next/link";

export default function WorldCupHomeSpotlight() {
  return (
    <section className="container-max py-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] p-[1px] shadow-xl">
        <div className="rounded-[31px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#0f172a,#111827)] px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                ESPECIAL COPA 2026
              </span>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                  Encontre figurinhas da Copa 2026 perto de você
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-200">
                  Descubra bancas com figurinhas disponíveis e fale direto antes de sair de casa
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/figurinhas-copa-2026#bancas-da-copa"
                  className="inline-flex w-full justify-center rounded-full bg-[#ff5c00] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e65300] sm:w-auto"
                >
                  Ver bancas com figurinhas agora
                </Link>
                <Link
                  href="/figurinhas-copa-2026#bancas-da-copa"
                  className="inline-flex w-full justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
                >
                  Buscar perto de mim
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Bancas ativas na sua região</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-1">
                <Link
                  href="/figurinhas-copa-2026#bancas-da-copa"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-emerald-400/30 hover:bg-white/10"
                >
                  <p className="text-sm leading-6 text-slate-300">
                    Já existem bancas com figurinhas disponíveis perto de você
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    <li>Atualizado em tempo real</li>
                    <li>Contato direto com a banca</li>
                    <li>Consulte antes de ir</li>
                  </ul>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
