import Link from "next/link";
import { IconArrowRight, IconBolt, IconCheck } from "@tabler/icons-react";
import type { JournaleiroPartnerPromoStrip as PromoStripContent } from "@/lib/jornaleiro-partner-landing";
import {
  JOURNALEIRO_MARKETING_PATH,
  JOURNALEIRO_SIGNUP_PATH,
} from "@/lib/jornaleiro-marketing";

export default function JornaleiroPartnerPromoStrip({
  content,
}: {
  content: PromoStripContent;
}) {
  return (
    <section className="container-max py-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] p-[1px] shadow-xl">
        <div className="rounded-[31px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#0f172a,#111827)] px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5c00]/20 bg-[#ff5c00]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
                <IconBolt className="h-4 w-4" />
                {content.eyebrow}
              </div>
              <div className="space-y-3">
                <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {content.title}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-200">
                  {content.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={JOURNALEIRO_MARKETING_PATH}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff5c00] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e65300] sm:w-auto"
                >
                  {content.primaryCtaText}
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={JOURNALEIRO_SIGNUP_PATH}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
                >
                  {content.secondaryCtaText}
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {content.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-400/30 hover:bg-white/10"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <IconCheck className="h-4 w-4" />
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
