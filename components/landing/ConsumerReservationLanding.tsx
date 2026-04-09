import Link from "next/link";
import {
  IconArrowRight,
  IconBrandWhatsapp,
  IconBuildingStore,
  IconCheck,
  IconClockHour4,
  IconMapPinSearch,
  IconReceipt2,
  IconSearch,
  IconShoppingBag,
  IconStarFilled,
} from "@tabler/icons-react";
import {
  CONSUMER_RESERVATION_PATH,
  PRE_VENDA_PATH,
  type ConsumerReservationLandingDocument,
} from "@/lib/consumer-reservation-marketing";

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

function ReservationPhoneMockups() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute inset-x-12 top-10 h-72 rounded-full bg-[#ff7a33]/30 blur-3xl" />
      <div className="relative flex items-end justify-center gap-4 sm:gap-6">
        <div className="relative w-[230px] overflow-hidden rounded-[2rem] border border-white/15 bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>Busca local</span>
            <span className="rounded-full bg-[#fff1e8] px-2 py-1 font-semibold text-[#ff5c00]">
              perto de você
            </span>
          </div>
          <div className="overflow-hidden rounded-[1.4rem] bg-[#f7f7f8]">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                figurinha copa 2026
              </div>
            </div>
            <div className="p-4">
              <div className="rounded-2xl bg-[linear-gradient(135deg,#ffe0cc,#fff6ef)] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
                  <IconMapPinSearch className="h-4 w-4 text-[#ff5c00]" />
                  Banca perto de mim
                </div>
                <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Banca Central</div>
                      <div className="text-xs text-slate-500">1,2 km de distância</div>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      lote ativo
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
                  Pré-reserva de álbum e figurinhas em poucos minutos.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-[220px] overflow-hidden rounded-[2rem] border border-white/15 bg-[#111827] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-xs text-white/80">
            <span>Reserva confirmada</span>
            <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-semibold text-emerald-200">
              via WhatsApp
            </span>
          </div>
          <div className="rounded-[1.4rem] bg-white p-3 text-[#101828]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff5c00]">
                <IconBrandWhatsapp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold">Jornaleiro respondeu</div>
                <div className="text-xs text-slate-500">Lote separado para retirada</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-[#fff6ef] p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
                    Pedido encaminhado
                  </div>
                  <span className="text-lg font-semibold">ok</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Álbum oficial + figurinhas reservados com antecedência.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Retirada</div>
                  <div className="mt-1 text-lg font-semibold">local</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Tempo</div>
                  <div className="mt-1 text-lg font-semibold">rápido</div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Compra local segura</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    confirmado
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Você fala com a banca da sua região, não com anúncio anônimo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsumerReservationLanding({
  content,
}: {
  content: ConsumerReservationLandingDocument;
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
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/bancas-perto-de-mim"
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(255,92,0,0.35)] transition-transform hover:-translate-y-0.5"
              >
                {content.hero.primaryCtaText}
                <IconArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={PRE_VENDA_PATH}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                {content.hero.secondaryCtaText}
              </Link>
            </div>
          </div>
          <ReservationPhoneMockups />
        </div>
      </section>

      <SectionShell
        eyebrow={content.sections.urgency.eyebrow}
        title={content.sections.urgency.title}
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.urgency.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-[#ffd8c4] bg-[#fff6ef] p-7 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
              O que faz diferença
            </div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconClockHour4 className="h-5 w-5 text-[#ff5c00]" />
                  <span className="text-sm text-slate-700">
                    Lotes limitados exigem decisão rápida.
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconSearch className="h-5 w-5 text-[#ff5c00]" />
                  <span className="text-sm text-slate-700">
                    Busca local encurta o caminho até a banca certa.
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <IconBrandWhatsapp className="h-5 w-5 text-[#ff5c00]" />
                  <span className="text-sm text-slate-700">
                    Reserva combinada direto com o jornaleiro.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.benefits.eyebrow}
        title={content.sections.benefits.title}
        tone="muted"
      >
        <div className="max-w-3xl text-lg leading-8 text-slate-700">
          {content.sections.benefits.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {content.benefitCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff5c00]">
                <IconShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.flow.eyebrow}
        title={content.sections.flow.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.flow.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4">
            {content.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e8] text-base font-semibold text-[#ff5c00]">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                </div>
                <p className="mt-4 text-base leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.trust.eyebrow}
        title={content.sections.trust.title}
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            {content.sections.trust.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link
              href="/bancas-perto-de-mim"
              className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Encontrar bancas disponíveis agora
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            {content.trustCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                  <IconBuildingStore className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                <p className="mt-2 text-base leading-7 text-white/70">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.sections.locality.eyebrow}
        title={content.sections.locality.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {content.sections.locality.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(180deg,#f3fff7,#ffffff)] p-7">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <IconMapPinSearch className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Banca mais próxima</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Menos deslocamento e mais agilidade para retirar ou combinar entrega.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <IconReceipt2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Preço justo local</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Você trata direto com o jornaleiro da região e reduz o atrito da compra.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <IconCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Reserva mais prática</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Você encontra a banca, valida o lote e encaminha a compra no mesmo fluxo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <section className="bg-[linear-gradient(180deg,#fff1e8,#ffffff)]">
        <div className="container-max py-16 sm:py-20">
          <div className="overflow-hidden rounded-[2.5rem] border border-[#ffd8c4] bg-[#101010] px-6 py-10 text-white shadow-[0_30px_80px_rgba(16,16,16,0.2)] sm:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center">
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
                    href="/bancas-perto-de-mim"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-7 py-4 text-base font-semibold text-white transition hover:opacity-95"
                  >
                    {content.finalCta.primaryCtaText}
                    <IconArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href={PRE_VENDA_PATH}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    {content.finalCta.secondaryCtaText}
                  </Link>
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <IconSearch className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Busca local inteligente</div>
                        <div className="text-sm text-white/65">
                          Ache a banca certa sem rodar a cidade.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <IconBrandWhatsapp className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Conversa direta</div>
                        <div className="text-sm text-white/65">
                          Confirme lote, quantidade e retirada direto com o jornaleiro.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <IconShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Pré-reserva com mais chance de sucesso</div>
                        <div className="text-sm text-white/65">
                          Quem se antecipa encontra mais fácil e compra com menos atrito.
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
    </>
  );
}
