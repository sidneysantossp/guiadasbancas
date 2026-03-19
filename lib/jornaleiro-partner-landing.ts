import { supabaseAdmin } from "@/lib/supabase";

export const JOURNALEIRO_PARTNER_LANDING_KEY = "jornaleiro_partner_landing_v1";

export type JournaleiroPartnerTextSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type JournaleiroPartnerHighlight = {
  title: string;
  description: string;
};

export type JournaleiroPartnerCard = {
  title: string;
  description: string;
};

export type JournaleiroPartnerComparisonRow = {
  withoutGuide: string;
  withGuide: string;
};

export type JournaleiroPartnerPlanCard = {
  name: string;
  price: string;
  subtitle: string;
  accent: string;
  badge?: string;
  features: string[];
};

export type JournaleiroPartnerPromoStrip = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  bullets: string[];
};

export type JournaleiroPartnerAssistCard = {
  title: string;
  description: string;
  ctaText: string;
  helper: string;
};

export type JournaleiroPartnerLandingDocument = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    supportText: string;
    highlights: string[];
  };
  sections: {
    pain: JournaleiroPartnerTextSection;
    transformation: JournaleiroPartnerTextSection;
    simplicity: JournaleiroPartnerTextSection;
    sales: JournaleiroPartnerTextSection;
    distributors: JournaleiroPartnerTextSection;
    differentiation: JournaleiroPartnerTextSection;
    coverage: JournaleiroPartnerTextSection;
    pricing: JournaleiroPartnerTextSection;
    risk: JournaleiroPartnerTextSection;
    future: JournaleiroPartnerTextSection;
  };
  transformationHighlight: JournaleiroPartnerHighlight & { ctaText: string };
  distributorHighlight: JournaleiroPartnerHighlight;
  finalCta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaText: string;
    supportText: string;
  };
  simplicityCards: JournaleiroPartnerCard[];
  comparisonRows: JournaleiroPartnerComparisonRow[];
  plans: JournaleiroPartnerPlanCard[];
  promoStrip: JournaleiroPartnerPromoStrip;
  loginAssist: JournaleiroPartnerAssistCard;
  signupAssist: JournaleiroPartnerAssistCard;
};

function fallbackString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const normalized = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeSection(
  value: unknown,
  fallback: JournaleiroPartnerTextSection
): JournaleiroPartnerTextSection {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    eyebrow: fallbackString(candidate.eyebrow, fallback.eyebrow),
    title: fallbackString(candidate.title, fallback.title),
    paragraphs: normalizeStringArray(candidate.paragraphs, fallback.paragraphs),
  };
}

function normalizeCard(value: unknown, fallback: JournaleiroPartnerCard): JournaleiroPartnerCard {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    title: fallbackString(candidate.title, fallback.title),
    description: fallbackString(candidate.description, fallback.description),
  };
}

function normalizeHighlight<T extends JournaleiroPartnerHighlight>(
  value: unknown,
  fallback: T
): T {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    ...fallback,
    title: fallbackString(candidate.title, fallback.title),
    description: fallbackString(candidate.description, fallback.description),
    ...(Object.prototype.hasOwnProperty.call(fallback, "ctaText")
      ? {
          ctaText: fallbackString(
            candidate.ctaText,
            (fallback as T & { ctaText?: string }).ctaText || ""
          ),
        }
      : {}),
  } as T;
}

function normalizeComparisonRow(
  value: unknown,
  fallback: JournaleiroPartnerComparisonRow
): JournaleiroPartnerComparisonRow {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    withoutGuide: fallbackString(candidate.withoutGuide, fallback.withoutGuide),
    withGuide: fallbackString(candidate.withGuide, fallback.withGuide),
  };
}

function normalizePlanCard(
  value: unknown,
  fallback: JournaleiroPartnerPlanCard
): JournaleiroPartnerPlanCard {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    name: fallbackString(candidate.name, fallback.name),
    price: fallbackString(candidate.price, fallback.price),
    subtitle: fallbackString(candidate.subtitle, fallback.subtitle),
    accent: fallbackString(candidate.accent, fallback.accent),
    badge: fallbackString(candidate.badge, fallback.badge || ""),
    features: normalizeStringArray(candidate.features, fallback.features),
  };
}

function normalizePromoStrip(
  value: unknown,
  fallback: JournaleiroPartnerPromoStrip
): JournaleiroPartnerPromoStrip {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    eyebrow: fallbackString(candidate.eyebrow, fallback.eyebrow),
    title: fallbackString(candidate.title, fallback.title),
    description: fallbackString(candidate.description, fallback.description),
    primaryCtaText: fallbackString(candidate.primaryCtaText, fallback.primaryCtaText),
    secondaryCtaText: fallbackString(candidate.secondaryCtaText, fallback.secondaryCtaText),
    bullets: normalizeStringArray(candidate.bullets, fallback.bullets),
  };
}

function normalizeAssistCard(
  value: unknown,
  fallback: JournaleiroPartnerAssistCard
): JournaleiroPartnerAssistCard {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    title: fallbackString(candidate.title, fallback.title),
    description: fallbackString(candidate.description, fallback.description),
    ctaText: fallbackString(candidate.ctaText, fallback.ctaText),
    helper: fallbackString(candidate.helper, fallback.helper),
  };
}

export const DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT: JournaleiroPartnerLandingDocument = {
  hero: {
    badge: "Plataforma exclusiva para bancas de jornal - 100% gratuita para começar",
    title: "Sua banca vendendo pela internet a partir de hoje. Direto do seu celular.",
    subtitle:
      "Cadastre sua banca, ganhe uma loja online completa com milhares de produtos já no estoque, apareça no Google para clientes da sua região e receba pedidos por WhatsApp e Pix - tudo sem precisar entender de tecnologia.",
    ctaText: "Cadastrar minha banca grátis",
    supportText: "Sem cartão de crédito. Pronto em 3 minutos. Funciona no celular.",
    highlights: [
      "Loja online pronta para sua banca",
      "Pedidos por WhatsApp e Pix",
      "Produtos próprios e catálogo parceiro",
    ],
  },
  sections: {
    pain: {
      eyebrow: "Dor real",
      title: "O jornaleiro que depende só de quem passa na calçada está perdendo venda todo dia.",
      paragraphs: [
        "Pense em quantas pessoas moram a 5, 10, 15 quarteirões da sua banca e nunca entraram nela. Não é porque não querem. É porque não sabem que ela existe. Não sabem o que você vende. Não sabem seu horário. Não sabem que você tem aquele card raro, aquela revista de colecionador, aquela figurinha que o filho delas está procurando.",
        "Hoje, antes de sair de casa, a maioria das pessoas pesquisa no Google. \"Banca perto de mim.\" \"Figurinha Copa do Mundo.\" \"HQ Marvel perto de mim.\" Se a sua banca não aparece nessa busca, o cliente vai para outro lugar ou simplesmente não vai até você.",
        "Não é o futuro. Já é o presente. O futuro das compras é digital, e quem não estiver lá simplesmente não vai ser encontrado. A pergunta não é se você precisa estar na internet. A pergunta é: quantas vendas você já perdeu por não estar?",
      ],
    },
    transformation: {
      eyebrow: "A virada",
      title: "Cadastrou? Pronto. Sua banca acabou de ganhar uma loja online com milhares de produtos.",
      paragraphs: [
        "Quando você se cadastra no Guia das Bancas, algo acontece que nenhuma outra plataforma faz por você: o perfil da sua banca nasce já conectado ao estoque de todos os distribuidores parceiros da rede. Isso significa que, com poucos cliques, seu catálogo online pode ter centenas, até milhares, de produtos disponíveis para o cliente comprar.",
        "Você não precisa fotografar um por um. Não precisa criar descrição. Não precisa inventar preço. Os produtos dos distribuidores parceiros já estão lá: com foto, nome, categoria e preço sugerido. Você escolhe o que quer ativar na sua vitrine, define sua margem e pronto - está à venda.",
        "É como ter uma loja online do tamanho de um shopping, mas que roda na palma da sua mão. Direto do celular.",
      ],
    },
    simplicity: {
      eyebrow: "Simplicidade",
      title: "Se você usa WhatsApp, já sabe usar o Guia das Bancas.",
      paragraphs: [
        "Essa plataforma foi feita para jornaleiro, não para programador. Tudo funciona no celular. O cadastro é guiado passo a passo: você coloca o nome da banca, o CEP, o número, e a banca já aparece no mapa. Depois, um checklist simples te mostra exatamente o que fazer: cadastrar o primeiro produto, escolher seu horário, ativar o WhatsApp para pedidos.",
        "Não tem painel complicado. Não tem menu escondido. Não precisa de computador, não precisa de técnico, não precisa de ninguém. Você gerencia tudo - catálogo, preço, pedido e pagamento - do mesmo celular que já usa para conversar com seus clientes.",
      ],
    },
    sales: {
      eyebrow: "Foco em venda",
      title: "Aqui não tem enrolação. Tem venda.",
      paragraphs: [
        "O Guia das Bancas existe para uma coisa: fazer sua banca vender mais. Não é rede social. Não é aplicativo de conteúdo. É uma máquina de vendas que funciona enquanto você está atendendo no balcão, enquanto está almoçando, enquanto a porta está fechada.",
        "Funciona assim: o cliente da sua região pesquisa um produto no Google. Encontra na vitrine da sua banca. Tem duas opções - comprar online ali mesmo, pagando por Pix, ou ir até a banca buscar. Nos dois casos, é venda pra você.",
        "E tem mais: quando o cliente prefere o WhatsApp, ele clica direto no botão da sua vitrine, cai na sua conversa e compra ali, no papo. Você mantém o contato, manda novidade, avisa quando chega produto novo. Fideliza. Aquele cliente volta. E volta de novo.",
      ],
    },
    distributors: {
      eyebrow: "Distribuidores",
      title: "Seus distribuidores já estão aqui. O estoque deles vira o seu catálogo.",
      paragraphs: [
        "Esse é o diferencial que nenhuma outra plataforma oferece para bancas. Dentro do Guia das Bancas, existe uma rede de distribuidores parceiros - os mesmos que já abastecem bancas por todo o Brasil. Quando você ativa o plano Premium, o catálogo completo deles fica disponível para você.",
        "Você não compra antes para vender depois. Você ativa o produto na sua vitrine, o cliente compra, e aí você faz o pedido ao distribuidor com um clique só, por um custo diferenciado. O produto chega na sua banca ou no endereço de entrega que você definir.",
        "É como ter um depósito gigante por trás da sua banca, sem pagar aluguel, sem estoque parado, sem risco. Você vende primeiro e compra depois.",
      ],
    },
    differentiation: {
      eyebrow: "Diferencial",
      title:
        "Instagram não foi feito pra banca. iFood cobra comissão. Marketplace te enterra entre milhões de vendedores. Aqui é diferente.",
      paragraphs: [
        "No Instagram, você posta foto e torce para alguém ver. No iFood, você paga até 27% de comissão. No Mercado Livre, sua banca compete com vendedores gigantes e desaparece na busca. Nenhuma dessas plataformas foi pensada para o jornaleiro.",
        "O Guia das Bancas é a única plataforma do Brasil feita exclusivamente para bancas de jornal. Quando alguém pesquisa \"banca perto de mim\" ou o nome de um produto que você vende, é a sua banca que aparece - não a de um seller de outro estado. A busca é por região. A compra é local. O relacionamento é seu, pelo seu WhatsApp, com o seu cliente.",
        "Você não paga comissão para conversar com seu cliente. Não perde margem para intermediário. Não disputa atenção com milhões de concorrentes. Aqui, a banca é o protagonista.",
      ],
    },
    coverage: {
      eyebrow: "Cobertura",
      title: "Funciona na sua cidade. Seja ela qual for.",
      paragraphs: [
        "O Guia das Bancas é nacional. Não importa se sua banca está na Paulista, em Belo Horizonte, numa cidade do interior do Paraná ou no centro de Manaus. A plataforma funciona em qualquer lugar porque o valor principal é seu: sua vitrine, seu catálogo, seus clientes, seus pedidos por WhatsApp.",
        "A rede de distribuidores parceiros está em expansão e cobre cada vez mais regiões. Mas mesmo onde ainda não existe distribuidor cadastrado, sua banca já funciona 100%. Você cadastra seus próprios produtos, aparece no Google da sua cidade e começa a vender pela internet imediatamente.",
        "Quando o distribuidor chegar na sua região, você já está pronto - e na frente de todo mundo.",
      ],
    },
    pricing: {
      eyebrow: "Preço",
      title: "Começa de graça. E quando cresce, custa menos que um dia ruim de vendas.",
      paragraphs: [
        "O plano gratuito já te dá vitrine pública, até 50 produtos, pedidos por WhatsApp e presença no Google. Zero. Nada. Sem cartão.",
        "Quando sua banca começar a crescer na plataforma e você quiser mais - checkout com Pix, mais produtos, relatórios de vendas - o plano Start custa R$ 59,90 por mês.",
        "E o plano Premium, que libera o catálogo completo dos distribuidores, múltiplos usuários e compra com 1 clique a preço diferenciado, custa R$ 99,90 por mês. Para as 100 primeiras bancas que entrarem, esse preço fica travado para sempre.",
        "Pense assim: basta uma venda extra por semana vinda pela internet para pagar o plano inteiro. O resto é lucro.",
      ],
    },
    risk: {
      eyebrow: "Risco zero",
      title: "Você não tem nada a perder. Mas pode ter muito a ganhar.",
      paragraphs: [
        "O cadastro é gratuito. Leva 3 minutos. Não pede cartão de crédito. Se não funcionar para você, basta não usar - sem multa, sem cobrança, sem contrato.",
        "Mas pense no que pode acontecer se funcionar: pessoas do seu bairro que nunca entraram na sua banca vão te descobrir. Colecionadores de outras cidades vão achar aquele produto raro que você tem. Clientes antigos vão voltar a comprar porque agora recebem suas novidades pelo WhatsApp. E você vai poder oferecer milhares de produtos que antes não cabiam na sua prateleira.",
        "O risco de não entrar é maior do que o risco de entrar.",
      ],
    },
    future: {
      eyebrow: "Visão de futuro",
      title: "O futuro das compras é digital. O futuro das bancas é agora.",
      paragraphs: [
        "Cada vez mais pessoas compram pelo celular. Pesquisam antes de sair de casa. Pagam por Pix. Pedem por WhatsApp. Comparam preços no Google. Essa não é uma tendência - é a realidade de hoje. E amanhã vai ser ainda mais assim.",
        "As bancas que vão sobreviver e crescer nos próximos anos são as que entenderam isso primeiro. Não é sobre abandonar a calçada - é sobre expandir para além dela. É sobre vender para quem está a 5 quarteirões, a 5 bairros de distância, a 5 cidades de distância.",
        "Sua banca sobreviveu ao fim dos jornais impressos. Sobreviveu à pandemia. Sobreviveu à concorrência dos marketplaces. Você se reinventou dezenas de vezes. Agora é hora de dar o próximo passo - e dessa vez, você não está sozinho.",
      ],
    },
  },
  transformationHighlight: {
    title: "Ao cadastrar sua banca, você ativa automaticamente um e-commerce completo.",
    description:
      "Seus produtos aparecem no Google para milhares de pessoas da sua região. O cliente encontra, escolhe e compra - sem precisar sair de casa. Ou descobre que você existe e vai até a banca.",
    ctaText: "Quero ativar minha loja online grátis",
  },
  distributorHighlight: {
    title:
      "Imagine ter acesso ao catálogo completo de distribuidores como Panini e outros parceiros regionais, tudo integrado à sua vitrine.",
    description:
      "O cliente vê, compra, e você faz o pedido com 1 clique. O produto chega na sua banca com custo diferenciado.",
  },
  finalCta: {
    eyebrow: "CTA final",
    title: "Junte-se aos jornaleiros que já estão vendendo pela internet.",
    subtitle:
      "Centenas de bancas já estão no Guia. Sua banca está ficando para trás. Cadastre agora, de graça, em 3 minutos, direto do celular. Sem complicação.",
    ctaText: "Cadastrar minha banca e começar a vender",
    supportText: "Gratuito. Sem cartão. Sem contrato. Funciona no celular.",
  },
  simplicityCards: [
    {
      title: "Cadastrou? Apareceu no Google.",
      description:
        "Sua banca fica visível para quem pesquisa por produtos na sua região. Automático.",
    },
    {
      title: "Produto ativado? Está à venda.",
      description:
        "Com um toque, o produto do distribuidor parceiro aparece na sua vitrine com o seu preço.",
    },
    {
      title: "Cliente mandou mensagem? Vendeu.",
      description:
        "O pedido chega pelo WhatsApp. Você confirma, separa e entrega. Simples assim.",
    },
  ],
  comparisonRows: [
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
  ],
  plans: [
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
  ],
  promoStrip: {
    eyebrow: "Para jornaleiros parceiros",
    title: "Sua banca pode vender pela internet hoje mesmo.",
    description:
      "Entenda a proposta, veja como o catálogo parceiro funciona e comece grátis pelo celular.",
    primaryCtaText: "Ver como funciona",
    secondaryCtaText: "Cadastrar minha banca grátis",
    bullets: [
      "Presença no Google",
      "Pedidos por WhatsApp e Pix",
      "Catálogo parceiro integrado",
    ],
  },
  loginAssist: {
    title: "Ainda está avaliando como o Guia ajuda sua banca?",
    description:
      "Veja a jornada completa, as objeções quebradas e como a vitrine digital ajuda a vender mais sem complicação.",
    ctaText: "Entender como funciona",
    helper: "Sem cartão. Cadastro em 3 minutos. Tudo no celular.",
  },
  signupAssist: {
    title: "Você está a poucos minutos de colocar sua banca no digital.",
    description:
      "Se quiser revisar a proposta antes de concluir, veja a landing completa com planos, catálogo parceiro e argumentos de venda.",
    ctaText: "Ver a apresentação completa",
    helper: "Depois volte e finalize o cadastro no mesmo fluxo.",
  },
};

export function normalizeJornaleiroPartnerLandingDocument(
  value: unknown
): JournaleiroPartnerLandingDocument {
  const fallback = DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT;
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const sectionsCandidate =
    candidate.sections && typeof candidate.sections === "object"
      ? (candidate.sections as Record<string, unknown>)
      : {};

  return {
    hero: {
      badge: fallbackString((candidate.hero as any)?.badge, fallback.hero.badge),
      title: fallbackString((candidate.hero as any)?.title, fallback.hero.title),
      subtitle: fallbackString((candidate.hero as any)?.subtitle, fallback.hero.subtitle),
      ctaText: fallbackString((candidate.hero as any)?.ctaText, fallback.hero.ctaText),
      supportText: fallbackString((candidate.hero as any)?.supportText, fallback.hero.supportText),
      highlights: normalizeStringArray((candidate.hero as any)?.highlights, fallback.hero.highlights),
    },
    sections: {
      pain: normalizeSection(sectionsCandidate.pain, fallback.sections.pain),
      transformation: normalizeSection(
        sectionsCandidate.transformation,
        fallback.sections.transformation
      ),
      simplicity: normalizeSection(sectionsCandidate.simplicity, fallback.sections.simplicity),
      sales: normalizeSection(sectionsCandidate.sales, fallback.sections.sales),
      distributors: normalizeSection(
        sectionsCandidate.distributors,
        fallback.sections.distributors
      ),
      differentiation: normalizeSection(
        sectionsCandidate.differentiation,
        fallback.sections.differentiation
      ),
      coverage: normalizeSection(sectionsCandidate.coverage, fallback.sections.coverage),
      pricing: normalizeSection(sectionsCandidate.pricing, fallback.sections.pricing),
      risk: normalizeSection(sectionsCandidate.risk, fallback.sections.risk),
      future: normalizeSection(sectionsCandidate.future, fallback.sections.future),
    },
    transformationHighlight: normalizeHighlight(
      candidate.transformationHighlight,
      fallback.transformationHighlight
    ),
    distributorHighlight: normalizeHighlight(
      candidate.distributorHighlight,
      fallback.distributorHighlight
    ),
    finalCta: {
      eyebrow: fallbackString((candidate.finalCta as any)?.eyebrow, fallback.finalCta.eyebrow),
      title: fallbackString((candidate.finalCta as any)?.title, fallback.finalCta.title),
      subtitle: fallbackString((candidate.finalCta as any)?.subtitle, fallback.finalCta.subtitle),
      ctaText: fallbackString((candidate.finalCta as any)?.ctaText, fallback.finalCta.ctaText),
      supportText: fallbackString(
        (candidate.finalCta as any)?.supportText,
        fallback.finalCta.supportText
      ),
    },
    simplicityCards: Array.isArray(candidate.simplicityCards)
      ? fallback.simplicityCards.map((item, index) =>
          normalizeCard((candidate.simplicityCards as unknown[])[index], item)
        )
      : fallback.simplicityCards,
    comparisonRows: Array.isArray(candidate.comparisonRows)
      ? fallback.comparisonRows.map((item, index) =>
          normalizeComparisonRow((candidate.comparisonRows as unknown[])[index], item)
        )
      : fallback.comparisonRows,
    plans: Array.isArray(candidate.plans)
      ? fallback.plans.map((item, index) =>
          normalizePlanCard((candidate.plans as unknown[])[index], item)
        )
      : fallback.plans,
    promoStrip: normalizePromoStrip(candidate.promoStrip, fallback.promoStrip),
    loginAssist: normalizeAssistCard(candidate.loginAssist, fallback.loginAssist),
    signupAssist: normalizeAssistCard(candidate.signupAssist, fallback.signupAssist),
  };
}

export async function loadJornaleiroPartnerLandingDocument() {
  try {
    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value, updated_at")
      .eq("key", JOURNALEIRO_PARTNER_LANDING_KEY)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const parsed =
      typeof data?.value === "string" && data.value.trim() ? JSON.parse(data.value) : null;

    return {
      document: parsed
        ? normalizeJornaleiroPartnerLandingDocument(parsed)
        : DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT,
      updatedAt: data?.updated_at || null,
      source: parsed ? "settings" : "default",
    } as const;
  } catch (error) {
    console.error("[JORNALEIRO-PARTNER-LANDING] Erro ao carregar:", error);
    return {
      document: DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT,
      updatedAt: null,
      source: "default",
    } as const;
  }
}
