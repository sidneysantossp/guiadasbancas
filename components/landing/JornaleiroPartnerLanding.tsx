import Link from "next/link";
import {
  IconArrowRight,
  IconBolt,
  IconBrandGoogle,
  IconBrandWhatsapp,
  IconBuildingStore,
  IconCheck,
  IconClockHour4,
  IconDeviceMobile,
  IconMapPinSearch,
  IconPackageExport,
  IconReceipt2,
  IconSearch,
  IconShoppingBag,
  IconStarFilled,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
import {
  JOURNALEIRO_SIGNUP_PATH,
  buildGuideSupportWhatsAppUrl,
} from "@/lib/jornaleiro-marketing";
import type { JournaleiroPartnerLandingDocument } from "@/lib/jornaleiro-partner-landing";

const SIMPLICITY_ICONS = [IconBrandGoogle, IconShoppingBag, IconBrandWhatsapp] as const;

const supportWhatsAppUrl = buildGuideSupportWhatsAppUrl(
  "Olá! Quero cadastrar minha banca no Guia das Bancas."
);

function SectionShell({
  eyebrow,
  title,
  children,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  tone?: "light" | "dark" | "muted";
}) {
  const toneClasses =
    tone === "dark"
      ? "bg-[#101010] text-white"
      : tone === "muted"
        ? "bg-[#f6f2ec] text-[#101828]"
        : "bg-white text-[#101828]";

  return (
    <section className={toneClasses}>
      <div className="container-max py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff5c00]">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function PhoneMockups() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute inset-x-10 top-8 h-72 rounded-full bg-[#ff7a33]/30 blur-3xl" />
      <div className="relative flex items-end justify-center gap-4 sm:gap-6">
        <div className="relative w-[230px] overflow-hidden rounded-[2rem] border border-white/15 bg-[#111827] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-xs text-white/80">
            <span>Painel da banca</span>
            <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-semibold text-emerald-200">
              online agora
            </span>
          </div>
          <div className="rounded-[1.4rem] bg-white p-3 text-[#101828]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff5c00]">
                <IconBuildingStore className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold">Banca perto de você</div>
                <div className="text-xs text-slate-500">Pedidos, catálogo e WhatsApp</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-[#fff6ef] p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
                    Produtos ativos
                  </div>
                  <span className="text-lg font-semibold">1.248</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Catálogo próprio + distribuidores parceiros
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Pedidos hoje</div>
                  <div className="mt-1 text-lg font-semibold">17</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">WhatsApp</div>
                  <div className="mt-1 text-lg font-semibold">9</div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Pedido recebido</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    Pix aprovado
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Álbum, figurinhas e revista de colecionador.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-[210px] overflow-hidden rounded-[2rem] border border-white/15 bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>Busca local</span>
            <span className="rounded-full bg-[#fff1e8] px-2 py-1 font-semibold text-[#ff5c00]">
              Banca perto de mim
            </span>
          </div>
          <div className="overflow-hidden rounded-[1.4rem] bg-[#f7f7f8]">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                banca perto de mim
              </div>
            </div>
            <div className="p-4">
              <div className="rounded-2xl bg-[linear-gradient(135deg,#ffe0cc,#fff6ef)] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
                  <IconMapPinSearch className="h-4 w-4 text-[#ff5c00]" />
                  Guia das Bancas
                </div>
                <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Banca Capuava</div>
                      <div className="text-xs text-slate-500">0,8 km de distância</div>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      aberto
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-amber-500">
                    <IconStarFilled className="h-4 w-4" />
                    <IconStarFilled className="h-4 w-4" />
                    <IconStarFilled className="h-4 w-4" />
                    <IconStarFilled className="h-4 w-4" />
                    <IconStarFilled className="h-4 w-4 text-slate-200" />
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 p-3 text-xs text-slate-500">
                  Cliente achou, clicou no WhatsApp e pediu.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JornaleiroPartnerLanding({
  content,
}: {
  content: JournaleiroPartnerLandingDocument;
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#101010] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,92,0,0.26),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,170,64,0.18),transparent_42%)]" />
        <div className="container-max relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-100">
              {content.hero.badge}
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              {content.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {content.hero.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href={JOURNALEIRO_SIGNUP_PATH}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(255,92,0,0.35)] transition-transform hover:-translate-y-0.5"
              >
                {content.hero.ctaText}
                <IconArrowRight className="h-5 w-5" />
              </Link>
              <div className="mt-3 text-sm text-white/70">
                {content.hero.supportText}
              </div>
            </div>
          </div>
          <PhoneMockups />
        </div>
      </section>

      <SectionShell
        eyebrow={content.sections.pain.eyebrow}
        title={content.sections.pain.title}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.pain.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-[#ffd8c4] bg-[#fff6ef] p-7 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
              Busca local decide a compra
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconSearch className="h-5 w-5 text-[#ff5c00]" />
                  <span className="text-sm text-slate-500">banca perto de mim</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconSearch className="h-5 w-5 text-[#ff5c00]" />
                  <span className="text-sm text-slate-500">figurinha Copa do Mundo</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconSearch className="h-5 w-5 text-[#ff5c00]" />
                  <span className="text-sm text-slate-500">HQ Marvel perto de mim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.transformation.eyebrow}
        title={content.sections.transformation.title}
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            {content.sections.transformation.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] bg-[#101010] p-7 text-white shadow-[0_24px_80px_rgba(16,16,16,0.18)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
              Caixa de impacto
            </div>
            <p className="mt-5 text-2xl font-semibold leading-tight">
              {content.transformationHighlight.title}
            </p>
            <p className="mt-4 text-base leading-7 text-white/75">
              {content.transformationHighlight.description}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Foto, nome e categoria</div>
                <div className="mt-1 text-sm text-white/70">Catálogo pronto para ativar</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Preço sugerido</div>
                <div className="mt-1 text-sm text-white/70">Você ajusta a margem e publica</div>
              </div>
            </div>
            <Link
              href={JOURNALEIRO_SIGNUP_PATH}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#101010] transition hover:bg-orange-50"
            >
              {content.transformationHighlight.ctaText}
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.simplicity.eyebrow}
        title={content.sections.simplicity.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.simplicity.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4">
            {content.simplicityCards.map((card, index) => {
              const Icon = SIMPLICITY_ICONS[index % SIMPLICITY_ICONS.length];
              return (
                <div
                  key={card.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff5c00]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.sales.eyebrow}
        title={content.sections.sales.title}
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            {content.sections.sales.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link
              href={JOURNALEIRO_SIGNUP_PATH}
              className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Começar a vender pela internet agora
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className="grid grid-cols-[1fr_1fr] border-b border-white/10 bg-white/5">
              <div className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                Sem o Guia das Bancas
              </div>
              <div className="border-l border-white/10 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-orange-200">
                Com o Guia das Bancas
              </div>
            </div>
            {content.comparisonRows.map((row) => (
              <div key={row.withGuide} className="grid grid-cols-[1fr_1fr]">
                <div className="border-b border-white/10 px-5 py-4 text-sm leading-6 text-white/70">
                  {row.withoutGuide}
                </div>
                <div className="border-b border-l border-white/10 px-5 py-4 text-sm leading-6 text-white">
                  {row.withGuide}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.distributors.eyebrow}
        title={content.sections.distributors.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.distributors.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(180deg,#f3fff7,#ffffff)] p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <IconPackageExport className="h-7 w-7" />
            </div>
            <p className="mt-5 text-2xl font-semibold text-slate-900">
              {content.distributorHighlight.title}
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {content.distributorHighlight.description}
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.differentiation.eyebrow}
        title={content.sections.differentiation.title}
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            {content.sections.differentiation.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Marketplaces genéricos
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Comissão alta</li>
                <li>Concorrência com grandes sellers</li>
                <li>Cliente não vira relacionamento seu</li>
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-[#ffd8c4] bg-[#fff6ef] p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
                Guia das Bancas
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>Busca local por região</li>
                <li>Pedido no seu WhatsApp</li>
                <li>Catálogo feito para a realidade da banca</li>
              </ul>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.coverage.eyebrow}
        title={content.sections.coverage.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.coverage.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] bg-[#101010] p-7 text-white">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <IconWorld className="h-7 w-7 text-orange-300" />
                <div className="mt-4 text-lg font-semibold">Presença nacional</div>
                <div className="mt-2 text-sm leading-6 text-white/70">
                  Sua banca vende com presença local em qualquer cidade.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <IconUsersGroup className="h-7 w-7 text-orange-300" />
                <div className="mt-4 text-lg font-semibold">Rede em expansão</div>
                <div className="mt-2 text-sm leading-6 text-white/70">
                  Distribuidores parceiros entram por região e ampliam o catálogo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.pricing.eyebrow}
        title={content.sections.pricing.title}
        tone="muted"
      >
        <div className="max-w-3xl text-lg leading-8 text-slate-700">
          {content.sections.pricing.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {content.plans.map((plan) => (
            <div
              key={plan.name}
              className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className={`h-2 bg-gradient-to-r ${plan.accent}`} />
              <div className="p-7">
                {plan.badge ? (
                  <div className="mb-4 inline-flex rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-[#ff5c00]">
                    {plan.badge}
                  </div>
                ) : null}
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {plan.name}
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">{plan.price}</div>
                <div className="mt-2 text-sm text-slate-600">{plan.subtitle}</div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={JOURNALEIRO_SIGNUP_PATH}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[#ff5c00] hover:text-[#ff5c00]"
                >
                  Começar grátis
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.risk.eyebrow}
        title={content.sections.risk.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.risk.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 rounded-2xl bg-[#fff6ef] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#ff5c00]">
                  <IconClockHour4 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Cadastro em 3 minutos</div>
                  <div className="mt-1 text-sm text-slate-600">Sem cartão e sem contrato.</div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-[#fff6ef] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#ff5c00]">
                  <IconDeviceMobile className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Tudo no celular</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Cadastro, vitrine, catálogo, pedido e pagamento.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-[#fff6ef] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#ff5c00]">
                  <IconReceipt2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Escala com plano certo</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Você começa gratuito e evolui quando a venda pedir mais estrutura.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.future.eyebrow}
        title={content.sections.future.title}
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            {content.sections.future.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <IconBolt className="h-7 w-7 text-orange-300" />
              <div className="mt-4 text-xl font-semibold">Busca, compra e conversa</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Google, Pix e WhatsApp já fazem parte da rotina do cliente.
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <IconBuildingStore className="h-7 w-7 text-orange-300" />
              <div className="mt-4 text-xl font-semibold">A calçada continua. O alcance cresce.</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                A vitrine digital complementa a banca física e multiplica a descoberta.
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <section className="bg-[linear-gradient(180deg,#fff1e8,#ffffff)]">
        <div className="container-max py-16 sm:py-20">
          <div className="overflow-hidden rounded-[2.5rem] border border-[#ffd8c4] bg-[#101010] px-6 py-10 text-white shadow-[0_30px_80px_rgba(16,16,16,0.2)] sm:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
                  {content.finalCta.eyebrow}
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  {content.finalCta.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                  {content.finalCta.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                  href={JOURNALEIRO_SIGNUP_PATH}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-7 py-4 text-base font-semibold text-white transition hover:opacity-95"
                >
                  {content.finalCta.ctaText}
                  <IconArrowRight className="h-5 w-5" />
                </Link>
                  <a
                    href={supportWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    <IconBrandWhatsapp className="h-5 w-5 text-emerald-300" />
                    Falar com o suporte
                  </a>
                </div>
                <div className="mt-4 text-sm text-white/65">
                  {content.finalCta.supportText}
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <IconBrandGoogle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Presença no Google</div>
                        <div className="text-sm text-white/65">Apareça na busca local.</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <IconBrandWhatsapp className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Pedidos por WhatsApp</div>
                        <div className="text-sm text-white/65">
                          Relacionamento direto com o cliente.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <IconPackageExport className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Catálogo parceiro integrado</div>
                        <div className="text-sm text-white/65">
                          Escala sem depender de estoque parado.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <a
        href={supportWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com o suporte no WhatsApp"
        className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(37,211,102,0.35)] transition hover:scale-[1.02] md:bottom-6 md:right-6"
      >
        <IconBrandWhatsapp className="h-5 w-5" />
        <span className="hidden sm:inline">Suporte no WhatsApp</span>
      </a>
    </>
  );
}
