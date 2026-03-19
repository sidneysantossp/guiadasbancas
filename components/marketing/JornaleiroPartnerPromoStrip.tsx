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
    <section className="container-max py-6">
      <div className="overflow-hidden rounded-[2rem] border border-[#ffd8c4] bg-[linear-gradient(135deg,#fff6ef,#ffffff)] p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5c00] shadow-sm">
              <IconBolt className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {content.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={JOURNALEIRO_MARKETING_PATH}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {content.primaryCtaText}
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={JOURNALEIRO_SIGNUP_PATH}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[#ff5c00] hover:text-[#ff5c00]"
              >
                {content.secondaryCtaText}
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {content.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <IconCheck className="h-4 w-4" />
                </span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
