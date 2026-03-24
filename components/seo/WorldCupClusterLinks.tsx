import Link from "next/link";
import { WORLD_CUP_CITY_PAGES, WORLD_CUP_SUBHUBS } from "@/lib/seo/world-cup-2026";

function pickLinks(limit = 4) {
  return WORLD_CUP_SUBHUBS.slice(0, limit);
}

export default function WorldCupClusterLinks({
  variant = "section",
  title,
  description,
  links,
  cityLinks,
}: {
  variant?: "section" | "compact";
  title?: string;
  description?: string;
  links?: Array<{ href: string; title: string; description: string }>;
  cityLinks?: Array<{ href: string; label: string }>;
}) {
  const resolvedLinks = (links && links.length > 0 ? links : pickLinks(variant === "compact" ? 3 : 4)).slice(
    0,
    variant === "compact" ? 3 : 4
  );
  const resolvedCityLinks = (
    cityLinks && cityLinks.length > 0
      ? cityLinks
      : WORLD_CUP_CITY_PAGES.slice(0, variant === "compact" ? 3 : 4).map((city) => ({
          href: `/copa-2026/onde-comprar/${city.slug}`,
          label: city.label,
        }))
  ).slice(0, variant === "compact" ? 3 : 4);

  if (variant === "compact") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Especial Copa 2026
        </span>
        <h3 className="mt-3 text-2xl font-bold text-slate-900">
          {title || "Continue a jornada do álbum e das figurinhas"}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          {description ||
            "O cluster da Copa 2026 foi criado para levar o leitor até páginas com intenção mais forte de compra, descoberta local e reposição da coleção dentro da operação paulista da plataforma."}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {resolvedLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-emerald-200 bg-white p-4 transition-colors hover:border-emerald-500 hover:bg-emerald-100/40"
            >
              <div className="font-semibold text-slate-900">{item.title}</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Especial Copa 2026
        </span>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          {title || "Álbum, figurinhas e compra local em uma mesma arquitetura"}
        </h2>
        <p className="mt-3 text-base leading-8 text-slate-700">
          {description ||
            "Estas páginas foram desenhadas para transformar o interesse por Copa 2026 em tráfego transacional e local dentro da operação ativa em São Paulo. Elas unem busca por figurinhas, intenção por bairro, categorias Panini e páginas públicas de bancas."}
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {resolvedLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-200 p-5 transition-colors hover:border-[#ff5c00] hover:bg-orange-50"
          >
            <div className="text-lg font-semibold text-slate-900">{item.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-semibold text-slate-900">Entradas locais ativas</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {resolvedCityLinks.map((city) => (
            <Link
              key={city.href}
              href={city.href}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
            >
              {city.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
