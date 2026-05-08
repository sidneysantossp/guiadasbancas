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
  IconSearch,
  IconShoppingBag,
  IconStarFilled,
} from "@tabler/icons-react";
import {
  JOURNALEIRO_SIGNUP_PATH,
  buildGuideSupportWhatsAppUrl,
} from "@/lib/jornaleiro-marketing";

const SIMPLICITY_ICONS = [IconShoppingBag, IconDeviceMobile, IconBrandWhatsapp] as const;

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

const pageCopy = {
  hero: {
    badge: "Cadastro gratuito para jornaleiros",
    title: "Sua banca pronta para vender pelo WhatsApp hoje",
    subtitle:
      "Cadastre-se grátis e comece com 4.000+ produtos já disponíveis, sem configuração e sem complicação.",
    ctaText: "Criar minha banca grátis",
    supportText: "Sem custo para começar.",
    highlights: [
      "4.000+ produtos pré-carregados",
      "Vendas diretas pelo WhatsApp",
      "Pronta em minutos",
    ],
  },
  problem: {
    eyebrow: "Dor real",
    title: "Se o cliente não encontra sua banca, ele compra de outro lugar.",
    paragraphs: [
      "Hoje o cliente procura no celular antes de sair. Ele digita o que quer, compara opções perto dele e chama quem responde mais rápido.",
      "Se a sua banca não aparece nessa hora, você depende só de quem passa na calçada. O cliente que poderia comprar com você acaba falando com outra banca.",
    ],
  },
  opportunity: {
    eyebrow: "A virada",
    title: "Agora sua banca pode vender além da calçada.",
    paragraphs: [
      "Você continua atendendo do jeito que já conhece, no balcão e pelo WhatsApp. A diferença é que mais clientes conseguem descobrir sua banca antes de chegar até ela.",
      "O Guia das Bancas coloca sua banca em uma vitrine simples, feita para gerar conversa e pedido direto no seu WhatsApp.",
    ],
    highlightTitle: "Sua rotina não muda. Seu alcance aumenta.",
    highlightDescription:
      "O cliente encontra sua banca, vê o catálogo pronto e chama você para comprar, reservar ou tirar dúvidas.",
  },
  ready: {
    eyebrow: "Tudo pronto",
    title: "Você começa com tudo pronto.",
    paragraphs: [
      "O cadastro foi pensado para não tomar seu tempo. Você cria a banca, informa seus dados principais e já pode começar com milhares de produtos disponíveis no catálogo.",
      "Não precisa subir produto por produto para começar. A ideia é tirar o peso da configuração e colocar sua banca online rapidamente.",
    ],
  },
  readyCards: [
    {
      title: "4.000+ produtos pré-cadastrados",
      description: "Sua banca já começa com um catálogo amplo para ativar e vender.",
    },
    {
      title: "Sem configuração manual",
      description: "Menos cadastro, menos etapa e mais velocidade para entrar no ar.",
    },
    {
      title: "Uso imediato",
      description: "O foco é colocar o cliente em contato com você pelo WhatsApp.",
    },
  ],
  steps: [
    {
      title: "Crie sua banca",
      description: "Faça o cadastro gratuito com os dados principais da sua banca.",
    },
    {
      title: "Apareça para clientes próximos",
      description: "Sua banca fica preparada para ser encontrada por quem está na sua região.",
    },
    {
      title: "Receba mensagens pelo WhatsApp",
      description: "O cliente chama direto, você conversa e combina a venda.",
    },
  ],
  objections: [
    {
      question: "Não sou bom com tecnologia",
      answer: "Você só precisa usar o WhatsApp, como já usa todos os dias.",
    },
    {
      question: "Isso vai tomar meu tempo?",
      answer: "Não. Os produtos já estão carregados para você começar sem montar tudo do zero.",
    },
    {
      question: "Preciso pagar para entrar?",
      answer: "Não. O cadastro é gratuito e você pode começar sem cartão.",
    },
  ],
  urgency: {
    eyebrow: "Comece antes",
    title: "As primeiras bancas ganham mais visibilidade.",
    paragraphs: [
      "Quanto antes sua banca entra, antes ela começa a aparecer para clientes da região.",
      "As primeiras bancas cadastradas saem na frente porque chegam primeiro na busca local e começam a receber interesse antes da concorrência.",
    ],
  },
  future: {
    eyebrow: "Próximo passo",
    title: "Isso é só o começo.",
    paragraphs: [
      "O Guia das Bancas vai liberar novas formas de crescimento para quem já estiver dentro da plataforma.",
      "Você não precisa entender tudo agora. O primeiro passo é simples: colocar sua banca online e começar a receber clientes pelo WhatsApp.",
    ],
  },
  finalCta: {
    eyebrow: "Cadastro gratuito",
    title: "Coloque sua banca online em minutos.",
    subtitle:
      "Crie sua banca grátis, comece com catálogo pronto e receba clientes direto pelo WhatsApp.",
    ctaText: "Criar minha banca grátis",
    supportText: "Sem custo para começar. Sem cartão. Pelo celular.",
  },
};

export default function JornaleiroPartnerLanding() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#101010] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,92,0,0.26),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,170,64,0.18),transparent_42%)]" />
        <div className="container-max relative grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-100">
              {pageCopy.hero.badge}
            </div>
            <h1 className="mt-6 max-w-3xl break-words text-4xl font-semibold tracking-tight sm:text-6xl">
              {pageCopy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              {pageCopy.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {pageCopy.hero.highlights.map((item) => (
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
                {pageCopy.hero.ctaText}
                <IconArrowRight className="h-5 w-5" />
              </Link>
              <div className="mt-3 text-sm text-white/70">
                {pageCopy.hero.supportText}
              </div>
            </div>
          </div>
          <PhoneMockups />
        </div>
      </section>

      <SectionShell
        eyebrow={pageCopy.problem.eyebrow}
        title={pageCopy.problem.title}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {pageCopy.problem.paragraphs.map((paragraph) => (
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
        eyebrow={pageCopy.opportunity.eyebrow}
        title={pageCopy.opportunity.title}
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            {pageCopy.opportunity.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] bg-[#101010] p-7 text-white shadow-[0_24px_80px_rgba(16,16,16,0.18)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
              Alcance local
            </div>
            <p className="mt-5 text-2xl font-semibold leading-tight">
              {pageCopy.opportunity.highlightTitle}
            </p>
            <p className="mt-4 text-base leading-7 text-white/75">
              {pageCopy.opportunity.highlightDescription}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Balcão funcionando</div>
                <div className="mt-1 text-sm text-white/70">Sua rotina continua igual</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Demanda digital</div>
                <div className="mt-1 text-sm text-white/70">Clientes chegam pelo WhatsApp</div>
              </div>
            </div>
            <Link
              href={JOURNALEIRO_SIGNUP_PATH}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#101010] transition hover:bg-orange-50"
            >
              Criar minha banca grátis
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={pageCopy.ready.eyebrow}
        title={pageCopy.ready.title}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            {pageCopy.ready.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4">
            {pageCopy.readyCards.map((card, index) => {
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
        eyebrow="Como funciona"
        title="Três passos para começar."
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            <p>
              O fluxo foi feito para ser direto. Você cadastra a banca, aparece
              para quem está perto e conversa com o cliente pelo WhatsApp.
            </p>
            <Link
              href={JOURNALEIRO_SIGNUP_PATH}
              className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Criar minha banca grátis
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            {pageCopy.steps.map((step, index) => (
              <div
                key={step.title}
                className="grid grid-cols-[72px_1fr] border-b border-white/10 last:border-b-0"
              >
                <div className="flex items-center justify-center border-r border-white/10 px-5 py-5 text-2xl font-semibold text-orange-200">
                  {index + 1}
                </div>
                <div className="px-5 py-5">
                  <div className="font-semibold text-white">{step.title}</div>
                  <div className="mt-1 text-sm leading-6 text-white/70">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Sem complicação"
        title="As dúvidas mais comuns já estão resolvidas."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {pageCopy.objections.map((item) => (
            <div
              key={item.question}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff5c00]">
                <IconCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={pageCopy.urgency.eyebrow}
        title={pageCopy.urgency.title}
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            {pageCopy.urgency.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4 rounded-2xl bg-[#fff6ef] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#ff5c00]">
                <IconClockHour4 className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Entrada antecipada</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">
                  As bancas que chegam primeiro começam a formar presença antes no
                  bairro.
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={pageCopy.future.eyebrow}
        title={pageCopy.future.title}
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            {pageCopy.future.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <IconBolt className="h-7 w-7 text-orange-300" />
              <div className="mt-4 text-xl font-semibold">Comece simples</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Primeiro, sua banca online e WhatsApp funcionando.
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <IconBuildingStore className="h-7 w-7 text-orange-300" />
              <div className="mt-4 text-xl font-semibold">Depois, mais crescimento</div>
              <div className="mt-2 text-sm leading-6 text-white/70">
                Novas oportunidades serão abertas para quem já estiver dentro.
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
                  {pageCopy.finalCta.eyebrow}
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  {pageCopy.finalCta.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                  {pageCopy.finalCta.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                  href={JOURNALEIRO_SIGNUP_PATH}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-7 py-4 text-base font-semibold text-white transition hover:opacity-95"
                >
                  {pageCopy.finalCta.ctaText}
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
                  {pageCopy.finalCta.supportText}
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
                        <div className="font-semibold">Busca local</div>
                        <div className="text-sm text-white/65">Prepare sua banca para ser encontrada.</div>
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
                        <IconShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Catálogo pronto</div>
                        <div className="text-sm text-white/65">
                          Comece sem cadastrar tudo do zero.
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
