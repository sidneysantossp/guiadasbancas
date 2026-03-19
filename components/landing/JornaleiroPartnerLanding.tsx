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

const heroHighlights = [
  "Loja online pronta para sua banca",
  "Pedidos por WhatsApp e Pix",
  "Produtos próprios e catálogo parceiro",
];

const simplicityCards = [
  {
    title: "Cadastrou? Apareceu no Google.",
    description:
      "Sua banca fica visível para quem pesquisa por produtos na sua região. Automático.",
    icon: IconBrandGoogle,
  },
  {
    title: "Produto ativado? Está à venda.",
    description:
      "Com um toque, o produto do distribuidor parceiro aparece na sua vitrine com o seu preço.",
    icon: IconShoppingBag,
  },
  {
    title: "Cliente mandou mensagem? Vendeu.",
    description:
      "O pedido chega pelo WhatsApp. Você confirma, separa e entrega. Simples assim.",
    icon: IconBrandWhatsapp,
  },
];

const comparisonRows = [
  {
    withoutGuide: "Cliente só compra se passar na frente",
    withGuide: "Cliente te encontra no Google de qualquer lugar",
  },
  {
    withoutGuide: "Você vende só o que cabe na prateleira",
    withGuide: "Seu catálogo online tem milhares de produtos dos distribuidores",
  },
  {
    withoutGuide: "Horário de venda = horário da porta aberta",
    withGuide: "Sua vitrine vende 24 horas por dia",
  },
  {
    withoutGuide: "Precisa decorar o que tem em estoque",
    withGuide: "Estoque organizado no celular com foto e preço",
  },
  {
    withoutGuide: "Cliente compra e some",
    withGuide: "Cliente no WhatsApp compra, volta e indica",
  },
];

const planCards = [
  {
    name: "FREE",
    price: "R$ 0/mês",
    subtitle: "Comece agora, sem pagar nada",
    accent: "from-slate-900 to-slate-700",
    features: [
      "Perfil público da banca no Google",
      "Até 50 produtos com foto e preço",
      "Pedidos por WhatsApp",
      "Endereço e horário visíveis",
      "Tudo pelo celular",
    ],
  },
  {
    name: "START",
    price: "R$ 59,90/mês",
    subtitle: "Venda de verdade pela internet",
    accent: "from-[#ff6a00] to-[#ff8b3d]",
    features: [
      "Tudo do Free",
      "Até 500 produtos",
      "Checkout com Pix integrado",
      "Gestão completa de pedidos",
      "Relatórios de vendas",
      "Suporte dedicado",
    ],
  },
  {
    name: "PREMIUM",
    price: "R$ 99,90/mês",
    subtitle: "Sua banca com estoque infinito",
    accent: "from-emerald-500 to-lime-400",
    badge: "Preço travado para as 100 primeiras bancas",
    features: [
      "Tudo do Start",
      "2.000 produtos ou mais",
      "Catálogo dos distribuidores integrado à vitrine",
      "Compra com 1 clique a custo diferenciado",
      "Definição de margem por produto",
      "Múltiplos usuários",
      "Suporte prioritário",
    ],
  },
];

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

export default function JornaleiroPartnerLanding() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#101010] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,92,0,0.26),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,170,64,0.18),transparent_42%)]" />
        <div className="container-max relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-100">
              Plataforma exclusiva para bancas de jornal - 100% gratuita para começar
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Sua banca vendendo pela internet a partir de hoje. Direto do seu celular.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Cadastre sua banca, ganhe uma loja online completa com milhares de produtos já no
              estoque, apareça no Google para clientes da sua região e receba pedidos por WhatsApp
              e Pix - tudo sem precisar entender de tecnologia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {heroHighlights.map((item) => (
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
                Cadastrar minha banca grátis
                <IconArrowRight className="h-5 w-5" />
              </Link>
              <div className="mt-3 text-sm text-white/70">
                Sem cartão de crédito. Pronto em 3 minutos. Funciona no celular.
              </div>
            </div>
          </div>
          <PhoneMockups />
        </div>
      </section>

      <SectionShell eyebrow="Dor real" title="O jornaleiro que depende só de quem passa na calçada está perdendo venda todo dia.">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              Pense em quantas pessoas moram a 5, 10, 15 quarteirões da sua banca e nunca
              entraram nela. Não é porque não querem. É porque não sabem que ela existe. Não
              sabem o que você vende. Não sabem seu horário. Não sabem que você tem aquele card
              raro, aquela revista de colecionador, aquela figurinha que o filho delas está
              procurando.
            </p>
            <p>
              Hoje, antes de sair de casa, a maioria das pessoas pesquisa no Google. &quot;Banca
              perto de mim.&quot; &quot;Figurinha Copa do Mundo.&quot; &quot;HQ Marvel perto de mim.&quot; Se a sua
              banca não aparece nessa busca, o cliente vai para outro lugar ou simplesmente não vai
              até você.
            </p>
            <p>
              Não é o futuro. Já é o presente. O futuro das compras é digital, e quem não estiver
              lá simplesmente não vai ser encontrado. A pergunta não é se você precisa estar na
              internet. A pergunta é: quantas vendas você já perdeu por não estar?
            </p>
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
        eyebrow="A virada"
        title="Cadastrou? Pronto. Sua banca acabou de ganhar uma loja online com milhares de produtos."
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            <p>
              Quando você se cadastra no Guia das Bancas, algo acontece que nenhuma outra
              plataforma faz por você: o perfil da sua banca nasce já conectado ao estoque de todos
              os distribuidores parceiros da rede. Isso significa que, com poucos cliques, seu
              catálogo online pode ter centenas, até milhares, de produtos disponíveis para o
              cliente comprar.
            </p>
            <p>
              Você não precisa fotografar um por um. Não precisa criar descrição. Não precisa
              inventar preço. Os produtos dos distribuidores parceiros já estão lá: com foto, nome,
              categoria e preço sugerido. Você escolhe o que quer ativar na sua vitrine, define sua
              margem e pronto - está à venda.
            </p>
            <p>
              É como ter uma loja online do tamanho de um shopping, mas que roda na palma da sua
              mão. Direto do celular.
            </p>
          </div>
          <div className="rounded-[2rem] bg-[#101010] p-7 text-white shadow-[0_24px_80px_rgba(16,16,16,0.18)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
              Caixa de impacto
            </div>
            <p className="mt-5 text-2xl font-semibold leading-tight">
              Ao cadastrar sua banca, você ativa automaticamente um e-commerce completo.
            </p>
            <p className="mt-4 text-base leading-7 text-white/75">
              Seus produtos aparecem no Google para milhares de pessoas da sua região. O cliente
              encontra, escolhe e compra - sem precisar sair de casa. Ou descobre que você existe e
              vai até a banca.
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
              Quero ativar minha loja online grátis
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Simplicidade"
        title="Se você usa WhatsApp, já sabe usar o Guia das Bancas."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              Essa plataforma foi feita para jornaleiro, não para programador. Tudo funciona no
              celular. O cadastro é guiado passo a passo: você coloca o nome da banca, o CEP, o
              número, e a banca já aparece no mapa. Depois, um checklist simples te mostra
              exatamente o que fazer: cadastrar o primeiro produto, escolher seu horário, ativar o
              WhatsApp para pedidos.
            </p>
            <p>
              Não tem painel complicado. Não tem menu escondido. Não precisa de computador, não
              precisa de técnico, não precisa de ninguém. Você gerencia tudo - catálogo, preço,
              pedido e pagamento - do mesmo celular que já usa para conversar com seus clientes.
            </p>
          </div>
          <div className="grid gap-4">
            {simplicityCards.map((card) => {
              const Icon = card.icon;
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
        eyebrow="Foco em venda"
        title="Aqui não tem enrolação. Tem venda."
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            <p>
              O Guia das Bancas existe para uma coisa: fazer sua banca vender mais. Não é rede
              social. Não é aplicativo de conteúdo. É uma máquina de vendas que funciona enquanto
              você está atendendo no balcão, enquanto está almoçando, enquanto a porta está
              fechada.
            </p>
            <p>
              Funciona assim: o cliente da sua região pesquisa um produto no Google. Encontra na
              vitrine da sua banca. Tem duas opções - comprar online ali mesmo, pagando por Pix, ou
              ir até a banca buscar. Nos dois casos, é venda pra você.
            </p>
            <p>
              E tem mais: quando o cliente prefere o WhatsApp, ele clica direto no botão da sua
              vitrine, cai na sua conversa e compra ali, no papo. Você mantém o contato, manda
              novidade, avisa quando chega produto novo. Fideliza. Aquele cliente volta. E volta de
              novo.
            </p>
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
            {comparisonRows.map((row) => (
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
        eyebrow="Distribuidores"
        title="Seus distribuidores já estão aqui. O estoque deles vira o seu catálogo."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              Esse é o diferencial que nenhuma outra plataforma oferece para bancas. Dentro do Guia
              das Bancas, existe uma rede de distribuidores parceiros - os mesmos que já abastecem
              bancas por todo o Brasil. Quando você ativa o plano Premium, o catálogo completo
              deles fica disponível para você.
            </p>
            <p>
              Você não compra antes para vender depois. Você ativa o produto na sua vitrine, o
              cliente compra, e aí você faz o pedido ao distribuidor com um clique só, por um custo
              diferenciado. O produto chega na sua banca ou no endereço de entrega que você
              definir.
            </p>
            <p>
              É como ter um depósito gigante por trás da sua banca, sem pagar aluguel, sem estoque
              parado, sem risco. Você vende primeiro e compra depois.
            </p>
          </div>
          <div className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(180deg,#f3fff7,#ffffff)] p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <IconPackageExport className="h-7 w-7" />
            </div>
            <p className="mt-5 text-2xl font-semibold text-slate-900">
              Imagine ter acesso ao catálogo completo de distribuidores como Panini e outros
              parceiros regionais, tudo integrado à sua vitrine.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              O cliente vê, compra, e você faz o pedido com 1 clique. O produto chega na sua banca
              com custo diferenciado.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Diferencial"
        title="Instagram não foi feito pra banca. iFood cobra comissão. Marketplace te enterra entre milhões de vendedores. Aqui é diferente."
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            <p>
              No Instagram, você posta foto e torce para alguém ver. No iFood, você paga até 27%
              de comissão. No Mercado Livre, sua banca compete com vendedores gigantes e
              desaparece na busca. Nenhuma dessas plataformas foi pensada para o jornaleiro.
            </p>
            <p>
              O Guia das Bancas é a única plataforma do Brasil feita exclusivamente para bancas de
              jornal. Quando alguém pesquisa &quot;banca perto de mim&quot; ou o nome de um produto que
              você vende, é a sua banca que aparece - não a de um seller de outro estado. A busca
              é por região. A compra é local. O relacionamento é seu, pelo seu WhatsApp, com o seu
              cliente.
            </p>
            <p>
              Você não paga comissão para conversar com seu cliente. Não perde margem para
              intermediário. Não disputa atenção com milhões de concorrentes. Aqui, a banca é o
              protagonista.
            </p>
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
        eyebrow="Cobertura"
        title="Funciona na sua cidade. Seja ela qual for."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              O Guia das Bancas é nacional. Não importa se sua banca está na Paulista, em Belo
              Horizonte, numa cidade do interior do Paraná ou no centro de Manaus. A plataforma
              funciona em qualquer lugar porque o valor principal é seu: sua vitrine, seu catálogo,
              seus clientes, seus pedidos por WhatsApp.
            </p>
            <p>
              A rede de distribuidores parceiros está em expansão e cobre cada vez mais regiões.
              Mas mesmo onde ainda não existe distribuidor cadastrado, sua banca já funciona 100%.
              Você cadastra seus próprios produtos, aparece no Google da sua cidade e começa a
              vender pela internet imediatamente.
            </p>
            <p>
              Quando o distribuidor chegar na sua região, você já está pronto - e na frente de todo
              mundo.
            </p>
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
        eyebrow="Preço"
        title="Começa de graça. E quando cresce, custa menos que um dia ruim de vendas."
        tone="muted"
      >
        <div className="max-w-3xl text-lg leading-8 text-slate-700">
          <p>
            O plano gratuito já te dá vitrine pública, até 50 produtos, pedidos por WhatsApp e
            presença no Google. Zero. Nada. Sem cartão.
          </p>
          <p className="mt-4">
            Quando sua banca começar a crescer na plataforma e você quiser mais - checkout com Pix,
            mais produtos, relatórios de vendas - o plano Start custa R$ 59,90 por mês.
          </p>
          <p className="mt-4">
            E o plano Premium, que libera o catálogo completo dos distribuidores, múltiplos
            usuários e compra com 1 clique a preço diferenciado, custa R$ 99,90 por mês. Para as
            100 primeiras bancas que entrarem, esse preço fica travado para sempre.
          </p>
          <p className="mt-4">
            Pense assim: basta uma venda extra por semana vinda pela internet para pagar o plano
            inteiro. O resto é lucro.
          </p>
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {planCards.map((plan) => (
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
        eyebrow="Risco zero"
        title="Você não tem nada a perder. Mas pode ter muito a ganhar."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              O cadastro é gratuito. Leva 3 minutos. Não pede cartão de crédito. Se não funcionar
              para você, basta não usar - sem multa, sem cobrança, sem contrato.
            </p>
            <p>
              Mas pense no que pode acontecer se funcionar: pessoas do seu bairro que nunca
              entraram na sua banca vão te descobrir. Colecionadores de outras cidades vão achar
              aquele produto raro que você tem. Clientes antigos vão voltar a comprar porque agora
              recebem suas novidades pelo WhatsApp. E você vai poder oferecer milhares de produtos
              que antes não cabiam na sua prateleira.
            </p>
            <p>O risco de não entrar é maior do que o risco de entrar.</p>
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
        eyebrow="Visão de futuro"
        title="O futuro das compras é digital. O futuro das bancas é agora."
        tone="dark"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-5 text-lg leading-8 text-white/75">
            <p>
              Cada vez mais pessoas compram pelo celular. Pesquisam antes de sair de casa. Pagam
              por Pix. Pedem por WhatsApp. Comparam preços no Google. Essa não é uma tendência - é
              a realidade de hoje. E amanhã vai ser ainda mais assim.
            </p>
            <p>
              As bancas que vão sobreviver e crescer nos próximos anos são as que entenderam isso
              primeiro. Não é sobre abandonar a calçada - é sobre expandir para além dela. É sobre
              vender para quem está a 5 quarteirões, a 5 bairros de distância, a 5 cidades de
              distância.
            </p>
            <p>
              Sua banca sobreviveu ao fim dos jornais impressos. Sobreviveu à pandemia. Sobreviveu
              à concorrência dos marketplaces. Você se reinventou dezenas de vezes. Agora é hora de
              dar o próximo passo - e dessa vez, você não está sozinho.
            </p>
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
                  CTA final
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Junte-se aos jornaleiros que já estão vendendo pela internet.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                  Centenas de bancas já estão no Guia. Sua banca está ficando para trás. Cadastre
                  agora, de graça, em 3 minutos, direto do celular. Sem complicação.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={JOURNALEIRO_SIGNUP_PATH}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff5c00,#ff8742)] px-7 py-4 text-base font-semibold text-white transition hover:opacity-95"
                  >
                    Cadastrar minha banca e começar a vender
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
                  Gratuito. Sem cartão. Sem contrato. Funciona no celular.
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
