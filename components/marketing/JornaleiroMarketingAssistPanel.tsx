"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconArrowRight, IconBrandWhatsapp } from "@tabler/icons-react";
import type { JournaleiroPartnerLandingDocument } from "@/lib/jornaleiro-partner-landing";
import {
  JOURNALEIRO_MARKETING_PATH,
  buildGuideSupportWhatsAppUrl,
} from "@/lib/jornaleiro-marketing";

type Variant = "login" | "signup";

const supportUrl = buildGuideSupportWhatsAppUrl(
  "Olá! Quero entender como o Guia das Bancas pode ajudar minha banca."
);

export default function JornaleiroMarketingAssistPanel({
  variant,
  className = "",
}: {
  variant: Variant;
  className?: string;
}) {
  const [document, setDocument] = useState<JournaleiroPartnerLandingDocument | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/settings/jornaleiro-partner-landing", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const json = await response.json();
        if (active && json?.success && json?.data) {
          setDocument(json.data);
        }
      } catch {
        return;
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const content = useMemo(() => {
    if (!document) return null;
    return variant === "login" ? document.loginAssist : document.signupAssist;
  }, [document, variant]);

  if (!content) {
    return null;
  }

  return (
    <div className={`rounded-[1.5rem] border border-[#ffd8c4] bg-[#fff7f2] p-5 text-left shadow-sm ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
        {variant === "login" ? "Antes de entrar" : "Antes de finalizar"}
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{content.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{content.description}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={JOURNALEIRO_MARKETING_PATH}
          className="inline-flex items-center gap-2 rounded-xl bg-[#101010] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {content.ctaText}
          <IconArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[#25D366] hover:text-[#25D366]"
        >
          <IconBrandWhatsapp className="h-4 w-4" />
          Suporte
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-500">{content.helper}</p>
    </div>
  );
}
