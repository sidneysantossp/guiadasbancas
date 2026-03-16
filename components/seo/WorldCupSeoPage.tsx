import Link from "next/link";
import Newsletter from "@/components/Newsletter";

type Breadcrumb = {
  name: string;
  href?: string;
};

type QuickFact = {
  label: string;
  value: string;
  detail?: string;
};

type SectionBlock = {
  title: string;
  body: string;
  bullets?: string[];
};

type LinkCard = {
  href: string;
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type BancaCard = {
  href: string;
  name: string;
  address: string;
};

function toSafeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function WorldCupSeoPage({
  title,
  description,
  eyebrow = "Copa 2026",
  breadcrumbs,
  quickFacts = [],
  primaryCta,
  secondaryCta,
  sectionBlocks,
  relatedLinks = [],
  cityLinks = [],
  bancas = [],
  faqs = [],
}: {
  title: string;
  description: string;
  eyebrow?: string;
  breadcrumbs: Breadcrumb[];
  quickFacts?: QuickFact[];
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  sectionBlocks: SectionBlock[];
  relatedLinks?: LinkCard[];
  cityLinks?: LinkCard[];
  bancas?: BancaCard[];
  faqs?: FaqItem[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    hasPart: [...relatedLinks, ...cityLinks].map((item) => ({
      "@type": "WebPage",
      name: item.title,
      url: item.href,
    })),
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(breadcrumbSchema) }}
      />
      <script
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(collectionSchema) }}
      />
      {faqSchema ? (
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toSafeJsonLd(faqSchema) }}
        />
      ) : null}

      <main className="min-h-screen bg-slate-50">
        <section className="bg-[#0f172a] text-white">
          <div className="container-max py-14 md:py-18">
            <div className="max-w-4xl space-y-6">
              <div className="space-y-3">
                <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  {eyebrow}
                </span>
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-200">{description}</p>
              </div>

              {(primaryCta || secondaryCta) ? (
                <div className="flex flex-wrap gap-3">
                  {primaryCta ? (
                    <Link
                      href={primaryCta.href}
                      className="inline-flex rounded-full bg-[#ff5c00] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e65300]"
                    >
                      {primaryCta.label}
                    </Link>
                  ) : null}
                  {secondaryCta ? (
                    <Link
                      href={secondaryCta.href}
                      className="inline-flex rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
                    >
                      {secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="container-max py-10 md:py-12">
          {quickFacts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{fact.label}</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{fact.value}</div>
                  {fact.detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{fact.detail}</p> : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="space-y-6">
              {sectionBlocks.map((section) => (
                <article key={section.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                  <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
                  {section.bullets?.length ? (
                    <ul className="mt-4 space-y-3 text-slate-700">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 leading-7">
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5c00]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>

            <aside className="space-y-6">
              {relatedLinks.length > 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">Páginas do cluster</h2>
                  <div className="mt-4 space-y-3">
                    {relatedLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-[#ff5c00] hover:bg-orange-50"
                      >
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {cityLinks.length > 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">Cidades prioritárias</h2>
                  <div className="mt-4 space-y-3">
                    {cityLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                      >
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {bancas.length > 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">Bancas públicas relacionadas</h2>
                  <div className="mt-4 space-y-3">
                    {bancas.map((banca) => (
                      <Link
                        key={banca.href}
                        href={banca.href}
                        className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-900 hover:bg-slate-50"
                      >
                        <div className="font-semibold text-slate-900">{banca.name}</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{banca.address}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        {faqs.length > 0 ? (
          <section className="container-max pb-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Perguntas frequentes</h2>
              <div className="mt-5 space-y-4">
                {faqs.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="pb-14">
          <Newsletter />
        </section>
      </main>
    </>
  );
}
