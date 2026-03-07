export const COMMERCIAL_PLANNING_DOCUMENT_KEY = "commercial_planning_document_v1";
export const COMMERCIAL_PLANNING_HISTORY_KEY = "commercial_planning_history_v1";
export const COMMERCIAL_PLANNING_HISTORY_LIMIT = 20;
const DEFAULT_DECISION_OWNER = "Sidney Santos";

export type CommercialPlanningPillar = {
  title: string;
  description: string;
};

export type CommercialPlanningValueProposition = {
  headline: string;
  jornaleiro: string;
  distribuidor: string;
  mercado: string;
};

export type CommercialPlanningPlan = {
  name: string;
  price: string;
  highlight: string;
  items: string[];
};

export type CommercialPlanningPlanArchitecture = {
  freeRole: string;
  startRole: string;
  premiumRole: string;
  partnerCatalogRule: string;
  upgradeTriggers: string[];
  onboardingPrinciples: string[];
  billingPrinciples: string[];
};

export type CommercialPlanningDistributorModel = {
  title: string;
  description: string;
  items: string[];
};

export type CommercialPlanningTechnicalFlowStep = {
  title: string;
  goal: string;
  items: string[];
};

export type CommercialPlanningTechnicalEpic = {
  title: string;
  objective: string;
  routes: string[];
  tables: string[];
  items: string[];
  dependencies: string[];
};

export type CommercialPlanningDevelopmentPhase = {
  name: string;
  outcome: string;
  items: string[];
};

export type CommercialPlanningTechnicalBacklog = {
  summary: string;
  criticalInconsistencies: string[];
  recommendedFlow: CommercialPlanningTechnicalFlowStep[];
  epics: CommercialPlanningTechnicalEpic[];
  developmentPhases: CommercialPlanningDevelopmentPhase[];
};

export type CommercialPlanningGlossaryEntry = {
  term: string;
  meaning: string;
};

export type CommercialPlanningHypothesisStatus =
  | "to_validate"
  | "in_progress"
  | "validated"
  | "discarded";

export type CommercialPlanningHypothesis = {
  statement: string;
  owner: string;
  targetDate: string;
  status: CommercialPlanningHypothesisStatus;
};

export type CommercialPlanningDecisionEntry = {
  title: string;
  decision: string;
  rationale: string;
  owner: string;
  decisionDate: string;
};

export type CommercialPlanningDocument = {
  summary: string;
  positioning: string;
  platformIs: string;
  platformIsNot: string;
  valueProposition: CommercialPlanningValueProposition;
  planArchitecture: CommercialPlanningPlanArchitecture;
  technicalBacklog: CommercialPlanningTechnicalBacklog;
  saoPauloRole: string;
  monetizationPillars: CommercialPlanningPillar[];
  bancaPlans: CommercialPlanningPlan[];
  distributorModels: CommercialPlanningDistributorModel[];
  glossary: CommercialPlanningGlossaryEntry[];
  validationHypotheses: CommercialPlanningHypothesis[];
  decisions: CommercialPlanningDecisionEntry[];
  nextSteps: string[];
  dailyNotes: string;
  openQuestions: string[];
};

export type CommercialPlanningVersionEntry = {
  id: string;
  savedAt: string;
  summary: string;
  document: CommercialPlanningDocument;
};

const defaultHypothesis = (
  statement: string,
  owner = "",
  targetDate = "",
  status: CommercialPlanningHypothesisStatus = "to_validate"
): CommercialPlanningHypothesis => ({
  statement,
  owner,
  targetDate,
  status,
});

export const DEFAULT_COMMERCIAL_PLANNING_DOCUMENT: CommercialPlanningDocument = {
  summary:
    "O produto deve se posicionar como uma plataforma nacional para bancas de jornal, com valor próprio para a banca e uma camada opcional de rede para distribuidores parceiros.",
  positioning:
    "A melhor tese para o projeto é SaaS-first, marketplace-second: a banca precisa perceber valor mesmo em regiões onde ainda não existe distribuidor parceiro cadastrado.",
  platformIs:
    "Um SaaS vertical para bancas com vitrine pública, operação digital, pedidos, pagamentos e camada opcional de integração com distribuidores por cobertura regional.",
  platformIsNot:
    "Um marketplace puro dependente de distribuidor. Se a banca só enxerga valor quando existe parceiro local, a expansão nacional fica limitada.",
  valueProposition: {
    headline:
      "Software para modernizar a operação da banca e rede opcional de abastecimento com distribuidores parceiros.",
    jornaleiro:
      "Digitalize sua banca, organize catálogo, pedidos e pagamentos em um único painel e continue operando mesmo que ainda não exista distribuidor parceiro na sua região.",
    distribuidor:
      "Ative bancas da sua área de cobertura, exponha catálogo com mais eficiência e transforme relacionamento comercial em pedidos recorrentes dentro de um canal estruturado.",
    mercado:
      "Infraestrutura vertical para modernizar bancas do Brasil, combinando software operacional, vitrine digital e camada opcional de distribuição por cobertura regional.",
  },
  planArchitecture: {
    freeRole:
      "Plano de entrada para adoção. Precisa ser útil de verdade, permitir a aprovação da banca e provar valor operacional antes de qualquer cobrança.",
    startRole:
      "Plano principal de operação para a maioria das bancas, com catálogo robusto, pedidos, checkout e gestão suficiente para o dia a dia.",
    premiumRole:
      "Plano de escala e automação, voltado para bancas mais maduras, com equipe, regras comerciais e acesso ampliado à rede parceira.",
    partnerCatalogRule:
      "O catálogo dos distribuidores deve ficar disponível para ativação, não publicado automaticamente. A banca escolhe quando ligar o parceiro e com quais regras de margem.",
    upgradeTriggers: [
      "Atingir o limite de produtos do plano atual.",
      "Querer ativar checkout, Pix ou recursos transacionais além do Free.",
      "Precisar de múltiplos usuários, regras de margem ou automações.",
      "Querer ativar catálogo de distribuidores parceiros e operação assistida.",
    ],
    onboardingPrinciples: [
      "Apresentar a proposta de valor antes de mostrar preço e upgrade.",
      "Permitir que a banca entre pelo Free e valide a operação antes da cobrança.",
      "Exibir upgrade no momento de uso de recurso premium ou ao exceder limite real.",
      "Só trazer distribuidores para a jornada quando houver cobertura regional ou parceria aplicável.",
    ],
    billingPrinciples: [
      "A receita principal da plataforma vem da assinatura das bancas.",
      "Take rate só entra quando o pedido nasce e é pago dentro da plataforma.",
      "Distribuidores podem pagar fee mensal ou anual para participar da rede.",
      "Serviços, implantação e campanhas patrocinadas entram como receita complementar.",
    ],
  },
  technicalBacklog: {
    summary:
      "O fluxo ideal do jornaleiro deve ser reduzido a cadastro mínimo, Free automático, checklist guiado dentro do painel e upgrade contextual apenas quando houver valor percebido.",
    criticalInconsistencies: [
      "As APIs de planos e settings do admin ainda expõem operações sensíveis sem guarda consistente de autenticação.",
      "A banca nasce inativa e o painel considera banca inativa como inexistente, misturando cobrança, aprovação e acesso.",
      "Os planos ainda não entram no onboarding; a escolha de plano acontece tarde e fora da jornada principal.",
      "A cobrança paga ainda é avulsa e não assinatura recorrente real, apesar de a integração com Asaas já ter base para subscriptions.",
      "Os limites dos planos existem no admin, mas não são aplicados no backend de produtos e recursos.",
      "O acesso a distribuidores está ligado ao status de cotista, não ao plano Premium e à cobertura regional.",
      "O wizard do jornaleiro mostra menos etapas do que realmente executa, o que gera atrito para um público leigo.",
    ],
    recommendedFlow: [
      {
        title: "Escolha do perfil",
        goal: "Fazer o jornaleiro entender rapidamente que existe um fluxo próprio para bancas.",
        items: [
          "Entrada por /registrar com escolha clara entre usuário e jornaleiro.",
          "Texto simples, sem preço nesta etapa.",
          "Apenas um CTA principal por tela.",
        ],
      },
      {
        title: "Cadastro mínimo",
        goal: "Criar conta e banca com o menor atrito possível.",
        items: [
          "Tela 1: nome, WhatsApp, e-mail, senha e CPF/CNPJ.",
          "Tela 2: nome da banca, CEP e número.",
          "Logo, imagens, horário e redes sociais ficam para depois no checklist.",
        ],
      },
      {
        title: "Ativação automática do Free",
        goal: "Entregar valor antes de cobrar.",
        items: [
          "Criar user_profile e banca em estado draft.",
          "Atribuir o plano Free automaticamente no backend.",
          "Liberar acesso imediato ao painel sem depender de pagamento.",
        ],
      },
      {
        title: "Checklist guiado no painel",
        goal: "Levar o jornaleiro à primeira vitória operacional.",
        items: [
          "Completar perfil da banca.",
          "Cadastrar o primeiro produto.",
          "Configurar horário e formas de contato.",
          "Enviar a banca para aprovação/publicação.",
        ],
      },
      {
        title: "Upgrade contextual",
        goal: "Cobrar quando o valor já estiver claro.",
        items: [
          "Oferecer Start ao se aproximar do limite do Free ou ao tentar checkout/Pix.",
          "Oferecer Premium ao tentar catálogo parceiro, distribuidores e automações avançadas.",
          "Manter a tela Meu Plano como área explícita de comparação e upgrade.",
        ],
      },
    ],
    epics: [
      {
        title: "Segurança e contratos das APIs",
        objective:
          "Fechar os endpoints administrativos e criar contratos próprios para consumo do jornaleiro sem depender de rotas do admin.",
        routes: [
          "/api/admin/plans",
          "/api/admin/plans/[id]",
          "/api/admin/settings",
          "/api/jornaleiro/plans",
        ],
        tables: ["plans", "system_settings"],
        items: [
          "Aplicar requireAdminAuth nas rotas administrativas de planos e settings.",
          "Criar rota segura de listagem de planos para o jornaleiro.",
          "Expor apenas campos públicos e comerciais dos planos.",
        ],
        dependencies: ["Definição final do packaging Free, Start e Premium."],
      },
      {
        title: "Estado da banca, assinatura e aprovação",
        objective:
          "Separar claramente o que é acesso ao painel, o que é aprovação da banca e o que é cobrança do plano.",
        routes: [
          "/api/jornaleiro/banca",
          "/jornaleiro/onboarding",
          "/api/jornaleiro/subscription",
          "/api/webhooks/asaas",
        ],
        tables: ["bancas", "subscriptions", "payments", "user_profiles"],
        items: [
          "Separar status de banca, status de assinatura e progresso de onboarding.",
          "Permitir painel para banca draft sem exigir cobrança.",
          "Deixar aprovação/publicação independente da ativação do plano.",
        ],
        dependencies: ["Segurança e contratos das APIs."],
      },
      {
        title: "Simplificação do onboarding do jornaleiro",
        objective:
          "Reduzir o cadastro para poucas decisões e transferir o restante para um checklist assistido dentro do painel.",
        routes: [
          "/registrar",
          "/jornaleiro/registrar",
          "/jornaleiro/onboarding",
          "/jornaleiro/dashboard",
        ],
        tables: ["jornaleiro_pending_banca", "user_profiles", "bancas"],
        items: [
          "Reduzir o wizard para cadastro mínimo em duas telas.",
          "Criar tela de boas-vindas/checklist após a criação da banca.",
          "Salvar progresso do onboarding para retomada posterior.",
        ],
        dependencies: ["Estado da banca, assinatura e aprovação."],
      },
      {
        title: "Motor de planos e entitlements",
        objective:
          "Transformar planos em regras reais de produto, com Start R$ 59,90 e Premium R$ 99,90 promocional para as 100 primeiras bancas.",
        routes: [
          "/api/jornaleiro/plans",
          "/api/jornaleiro/subscription",
          "/api/jornaleiro/products",
          "/jornaleiro/meu-plano",
        ],
        tables: ["plans", "subscriptions", "bancas", "products"],
        items: [
          "Adicionar o plano Start no modelo e no admin.",
          "Criar helper central de entitlements por banca.",
          "Aplicar limites reais de produtos e recursos no backend.",
          "Suportar regra promocional para as 100 primeiras bancas do Premium.",
        ],
        dependencies: [
          "Segurança e contratos das APIs.",
          "Estado da banca, assinatura e aprovação.",
        ],
      },
      {
        title: "Billing recorrente e promoção comercial",
        objective:
          "Trocar cobrança avulsa por assinatura recorrente real e suportar upgrade, renovação, atraso e cancelamento.",
        routes: ["/api/jornaleiro/subscription", "/api/webhooks/asaas", "/jornaleiro/meu-plano"],
        tables: ["subscriptions", "payments", "plans"],
        items: [
          "Usar createSubscription do Asaas para planos pagos.",
          "Persistir snapshot de preço, ciclo e elegibilidade promocional.",
          "Implementar estados de pending_payment, active, overdue e cancelled.",
          "Criar fluxo de retry e reativação no painel.",
        ],
        dependencies: ["Motor de planos e entitlements."],
      },
      {
        title: "Distribuidores por região e Premium",
        objective:
          "Fazer distribuidores virarem camada opcional do produto, ligada a cobertura regional e elegibilidade do plano.",
        routes: [
          "/jornaleiro/distribuidores",
          "/api/jornaleiro/products",
          "/api/jornaleiro/banca",
        ],
        tables: ["bancas", "cotistas", "products"],
        items: [
          "Desacoplar distribuidores de is_cotista como única regra de acesso.",
          "Criar regra de cobertura por cidade, estado ou faixa de CEP.",
          "Exibir catálogo parceiro por ativação, nunca por publicação automática irrestrita.",
          "Mostrar Premium como upgrade contextual para rede e catálogo parceiro.",
        ],
        dependencies: [
          "Motor de planos e entitlements.",
          "Billing recorrente e promoção comercial.",
        ],
      },
    ],
    developmentPhases: [
      {
        name: "Fase 0 - Fundamentos e segurança",
        outcome: "APIs críticas protegidas e contratos limpos para planos.",
        items: [
          "Fechar rotas de admin.",
          "Criar API pública/autenticada de planos para o jornaleiro.",
          "Congelar a definição comercial dos três planos.",
        ],
      },
      {
        name: "Fase 1 - Free automático e onboarding simples",
        outcome: "Jornaleiro entra sem fricção e já começa a usar o produto.",
        items: [
          "Simplificar o wizard.",
          "Criar banca draft.",
          "Ativar Free automaticamente.",
          "Adicionar checklist de onboarding no painel.",
        ],
      },
      {
        name: "Fase 2 - Entitlements reais",
        outcome: "Os planos passam a controlar produto, não só tela comercial.",
        items: [
          "Aplicar limite de produtos.",
          "Aplicar trava de recursos premium.",
          "Criar banners de upgrade contextual.",
        ],
      },
      {
        name: "Fase 3 - Billing recorrente",
        outcome: "Start e Premium passam a operar com ciclo de assinatura consistente.",
        items: [
          "Criar assinatura recorrente no Asaas.",
          "Implementar renovação, atraso, cancelamento e retomada.",
          "Registrar regra promocional das 100 primeiras bancas.",
        ],
      },
      {
        name: "Fase 4 - Distribuidores por cobertura",
        outcome: "Premium ganha escala nacional sem depender de um único parceiro.",
        items: [
          "Ligar distribuidores à cobertura regional.",
          "Permitir ativação de catálogo parceiro por banca.",
          "Exibir distribuidores de forma contextual por região e plano.",
        ],
      },
    ],
  },
  saoPauloRole:
    "São Paulo deve funcionar como laboratório comercial, caso forte de abastecimento e prova de operação. O patrocinador atual entra como parceiro fundador regional, sem virar dependência estrutural do modelo.",
  monetizationPillars: [
    {
      title: "SaaS das bancas",
      description:
        "Receita principal e previsível. A banca precisa ter valor claro mesmo em cidades onde ainda não existe distribuidor parceiro.",
    },
    {
      title: "Rede de distribuidores",
      description:
        "Receita híbrida com mensalidade, destaque comercial e comissão apenas em pedidos pagos dentro da plataforma.",
    },
    {
      title: "Serviços e add-ons",
      description:
        "Implantação, campanhas patrocinadas, IA, automações, WhatsApp e módulos avançados entram como receita complementar.",
    },
  ],
  bancaPlans: [
    {
      name: "Free",
      price: "R$ 0/mês",
      highlight: "Entrada e adoção",
      items: [
        "Perfil público da banca",
        "Até 50 produtos",
        "Pedidos por WhatsApp",
        "Sem automações avançadas",
        "Sem catálogo parceiro sincronizado",
      ],
    },
    {
      name: "Start",
      price: "R$ 59,90/mês",
      highlight: "Operação digital",
      items: [
        "Até 500 produtos",
        "Checkout/Pix",
        "Gestão de pedidos",
        "Relatórios básicos",
        "Suporte padrão",
      ],
    },
    {
      name: "Premium",
      price: "R$ 99,90/mês para as 100 primeiras bancas",
      highlight: "Escala e automação",
      items: [
        "2.000+ produtos ou ilimitado",
        "Catálogo de distribuidores parceiros por ativação",
        "Regras de margem e preço",
        "Equipe / múltiplos usuários",
        "Suporte prioritário",
      ],
    },
  ],
  distributorModels: [
    {
      title: "Parceiro Fundador",
      description:
        "Modelo ideal para o patrocinador atual. Entra com fee anual ou mensalidade especial e recebe contrapartidas regionais.",
      items: [
        "Destaque comercial em São Paulo",
        "Co-branding e estudos de caso",
        "Prioridade nas ativações locais",
        "Sem exclusividade nacional",
      ],
    },
    {
      title: "Parceiro Regional",
      description:
        "Distribuidor com atuação por cidade, estado ou faixa de CEP. A monetização combina software, vitrine e demanda.",
      items: [
        "Mensalidade da rede",
        "Página institucional",
        "Catálogo integrado",
        "Campanhas patrocinadas",
      ],
    },
    {
      title: "Take Rate Transacional",
      description:
        "Cobrança adicional somente quando o pedido nasce e é pago dentro da plataforma. Não usar como única receita.",
      items: [
        "Cobrança só em pedido liquidado",
        "Melhor quando usar split",
        "Evita conciliação manual",
        "Deixar como segunda etapa",
      ],
    },
  ],
  glossary: [
    {
      term: "SaaS-first, marketplace-second",
      meaning:
        "A plataforma entrega valor por assinatura para a banca antes de depender do efeito de rede entre bancas e distribuidores.",
    },
    {
      term: "Parceiro fundador",
      meaning:
        "Distribuidor âncora que ajuda a financiar a operação e valida a tese comercial local, sem controlar a estratégia nacional.",
    },
    {
      term: "Catálogo parceiro por ativação",
      meaning:
        "O catálogo do distribuidor fica disponível para a banca ativar com um clique, sem publicar todos os SKUs automaticamente.",
    },
    {
      term: "Cobertura regional",
      meaning:
        "Regra que informa em quais cidades, estados ou CEPs cada distribuidor atende com prazo e SLA definidos.",
    },
    {
      term: "Take rate",
      meaning:
        "Percentual cobrado sobre o pedido pago dentro da plataforma. Deve complementar a assinatura, não substituí-la.",
    },
    {
      term: "Documento vivo",
      meaning:
        "Página interna do admin que concentra hipóteses, decisões e aprendizados para revisão contínua do negócio.",
    },
  ],
  validationHypotheses: [
    defaultHypothesis(
      "Jornaleiros pagam assinatura quando percebem valor independente da existência de distribuidor na cidade."
    ),
    defaultHypothesis(
      "O plano Free precisa ser útil de verdade; 10 produtos parece demonstração e não operação real de banca."
    ),
    defaultHypothesis(
      "Distribuidores aderem melhor com fee de parceria e destaque do que com comissão pura desde o início."
    ),
    defaultHypothesis(
      "O catálogo parceiro deve entrar por ativação e regras de margem, não por publicação automática irrestrita."
    ),
    defaultHypothesis(
      "São Paulo deve ser tratado como laboratório comercial e prova social, não como limite do produto."
    ),
  ],
  decisions: [
    {
      title: "Modelo principal da plataforma",
      decision: "Posicionar o produto como SaaS-first, marketplace-second.",
      rationale:
        "A banca precisa enxergar valor próprio no software mesmo sem rede local de distribuidores, para permitir expansão nacional.",
      owner: DEFAULT_DECISION_OWNER,
      decisionDate: "",
    },
  ],
  nextSteps: [
    "Definir proposta de valor oficial da plataforma: software para operação digital de bancas com camada opcional de distribuição.",
    "Fechar a tabela de planos das bancas e os gatilhos de upgrade no produto.",
    "Criar plano de parceiro fundador para o distribuidor atual, com contrapartida regional bem delimitada.",
    "Estruturar cobertura geográfica dos distribuidores por cidade, estado ou CEP.",
    "Mapear o que será cobrado como assinatura, o que vira add-on e o que entra como take rate em pedido pago.",
  ],
  dailyNotes:
    "Use este espaço para registrar aprendizados de conversas com jornaleiros, distribuidores, objeções de venda, testes de preço e decisões do produto.",
  openQuestions: [
    "Qual limite ideal de produtos no plano Free para gerar adoção sem desvalorizar o Start?",
    "Como estruturar o plano do parceiro fundador sem gerar expectativa de exclusividade nacional?",
    "Quais regiões devem ser priorizadas depois de São Paulo para expansão da rede de distribuidores?",
  ],
};

function normalizeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => normalizeString(item).trim())
    .filter(Boolean);
}

function normalizePillars(value: unknown, fallback: CommercialPlanningPillar[]): CommercialPlanningPillar[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      title: normalizeString((item as any)?.title).trim(),
      description: normalizeString((item as any)?.description).trim(),
    }))
    .filter((item) => item.title || item.description);
}

function normalizeValueProposition(
  value: unknown,
  fallback: CommercialPlanningValueProposition
): CommercialPlanningValueProposition {
  const source = (value ?? {}) as Partial<CommercialPlanningValueProposition>;

  return {
    headline: normalizeString(source.headline, fallback.headline),
    jornaleiro: normalizeString(source.jornaleiro, fallback.jornaleiro),
    distribuidor: normalizeString(source.distribuidor, fallback.distribuidor),
    mercado: normalizeString(source.mercado, fallback.mercado),
  };
}

function normalizePlans(value: unknown, fallback: CommercialPlanningPlan[]): CommercialPlanningPlan[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => {
      const name = normalizeString((item as any)?.name).trim();
      const rawPrice = normalizeString((item as any)?.price).trim();

      let price = rawPrice;
      if ((name === "Start" && (!rawPrice || rawPrice === "R$ 59 a R$ 89/mês")) || rawPrice === "59.90") {
        price = "R$ 59,90/mês";
      }
      if (
        (name === "Premium" && (!rawPrice || rawPrice === "R$ 149 a R$ 199/mês")) ||
        rawPrice === "99.90"
      ) {
        price = "R$ 99,90/mês para as 100 primeiras bancas";
      }

      return {
        name,
        price,
        highlight: normalizeString((item as any)?.highlight).trim(),
        items: normalizeStringArray((item as any)?.items),
      };
    })
    .filter((item) => item.name || item.price || item.highlight || item.items.length > 0);
}

function normalizePlanArchitecture(
  value: unknown,
  fallback: CommercialPlanningPlanArchitecture
): CommercialPlanningPlanArchitecture {
  const source = (value ?? {}) as Partial<CommercialPlanningPlanArchitecture>;

  return {
    freeRole: normalizeString(source.freeRole, fallback.freeRole),
    startRole: normalizeString(source.startRole, fallback.startRole),
    premiumRole: normalizeString(source.premiumRole, fallback.premiumRole),
    partnerCatalogRule: normalizeString(source.partnerCatalogRule, fallback.partnerCatalogRule),
    upgradeTriggers: normalizeStringArray(source.upgradeTriggers, fallback.upgradeTriggers),
    onboardingPrinciples: normalizeStringArray(
      source.onboardingPrinciples,
      fallback.onboardingPrinciples
    ),
    billingPrinciples: normalizeStringArray(source.billingPrinciples, fallback.billingPrinciples),
  };
}

function normalizeTechnicalFlowSteps(
  value: unknown,
  fallback: CommercialPlanningTechnicalFlowStep[]
): CommercialPlanningTechnicalFlowStep[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      title: normalizeString((item as any)?.title).trim(),
      goal: normalizeString((item as any)?.goal).trim(),
      items: normalizeStringArray((item as any)?.items),
    }))
    .filter((item) => item.title || item.goal || item.items.length > 0);
}

function normalizeTechnicalEpics(
  value: unknown,
  fallback: CommercialPlanningTechnicalEpic[]
): CommercialPlanningTechnicalEpic[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      title: normalizeString((item as any)?.title).trim(),
      objective: normalizeString((item as any)?.objective).trim(),
      routes: normalizeStringArray((item as any)?.routes),
      tables: normalizeStringArray((item as any)?.tables),
      items: normalizeStringArray((item as any)?.items),
      dependencies: normalizeStringArray((item as any)?.dependencies),
    }))
    .filter(
      (item) =>
        item.title ||
        item.objective ||
        item.routes.length > 0 ||
        item.tables.length > 0 ||
        item.items.length > 0 ||
        item.dependencies.length > 0
    );
}

function normalizeDevelopmentPhases(
  value: unknown,
  fallback: CommercialPlanningDevelopmentPhase[]
): CommercialPlanningDevelopmentPhase[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      name: normalizeString((item as any)?.name).trim(),
      outcome: normalizeString((item as any)?.outcome).trim(),
      items: normalizeStringArray((item as any)?.items),
    }))
    .filter((item) => item.name || item.outcome || item.items.length > 0);
}

function normalizeTechnicalBacklog(
  value: unknown,
  fallback: CommercialPlanningTechnicalBacklog
): CommercialPlanningTechnicalBacklog {
  const source = (value ?? {}) as Partial<CommercialPlanningTechnicalBacklog>;

  return {
    summary: normalizeString(source.summary, fallback.summary),
    criticalInconsistencies: normalizeStringArray(
      source.criticalInconsistencies,
      fallback.criticalInconsistencies
    ),
    recommendedFlow: normalizeTechnicalFlowSteps(source.recommendedFlow, fallback.recommendedFlow),
    epics: normalizeTechnicalEpics(source.epics, fallback.epics),
    developmentPhases: normalizeDevelopmentPhases(
      source.developmentPhases,
      fallback.developmentPhases
    ),
  };
}

function normalizeDistributorModels(
  value: unknown,
  fallback: CommercialPlanningDistributorModel[]
): CommercialPlanningDistributorModel[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      title: normalizeString((item as any)?.title).trim(),
      description: normalizeString((item as any)?.description).trim(),
      items: normalizeStringArray((item as any)?.items),
    }))
    .filter((item) => item.title || item.description || item.items.length > 0);
}

function normalizeGlossary(
  value: unknown,
  fallback: CommercialPlanningGlossaryEntry[]
): CommercialPlanningGlossaryEntry[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      term: normalizeString((item as any)?.term).trim(),
      meaning: normalizeString((item as any)?.meaning).trim(),
    }))
    .filter((item) => item.term || item.meaning);
}

function normalizeHypothesisStatus(value: unknown): CommercialPlanningHypothesisStatus {
  if (value === "in_progress" || value === "validated" || value === "discarded") {
    return value;
  }
  return "to_validate";
}

function normalizeHypotheses(
  value: unknown,
  fallback: CommercialPlanningHypothesis[]
): CommercialPlanningHypothesis[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => {
      if (typeof item === "string") {
        return defaultHypothesis(item.trim());
      }

      return {
        statement: normalizeString((item as any)?.statement).trim(),
        owner: normalizeString((item as any)?.owner).trim(),
        targetDate: normalizeString((item as any)?.targetDate).trim(),
        status: normalizeHypothesisStatus((item as any)?.status),
      };
    })
    .filter((item) => item.statement);
}

function normalizeDecisions(
  value: unknown,
  fallback: CommercialPlanningDecisionEntry[]
): CommercialPlanningDecisionEntry[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => ({
      title: normalizeString((item as any)?.title).trim(),
      decision: normalizeString((item as any)?.decision).trim(),
      rationale: normalizeString((item as any)?.rationale).trim(),
      owner: normalizeString((item as any)?.owner, DEFAULT_DECISION_OWNER).trim() || DEFAULT_DECISION_OWNER,
      decisionDate: normalizeString((item as any)?.decisionDate).trim(),
    }))
    .filter((item) => item.title || item.decision || item.rationale || item.owner || item.decisionDate);
}

export function normalizeCommercialPlanningDocument(value: unknown): CommercialPlanningDocument {
  const source = (value ?? {}) as Partial<CommercialPlanningDocument>;

  return {
    summary: normalizeString(source.summary, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.summary),
    positioning: normalizeString(source.positioning, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.positioning),
    platformIs: normalizeString(source.platformIs, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.platformIs),
    platformIsNot: normalizeString(source.platformIsNot, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.platformIsNot),
    valueProposition: normalizeValueProposition(
      source.valueProposition,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.valueProposition
    ),
    planArchitecture: normalizePlanArchitecture(
      source.planArchitecture,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.planArchitecture
    ),
    technicalBacklog: normalizeTechnicalBacklog(
      source.technicalBacklog,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.technicalBacklog
    ),
    saoPauloRole: normalizeString(source.saoPauloRole, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.saoPauloRole),
    monetizationPillars: normalizePillars(
      source.monetizationPillars,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.monetizationPillars
    ),
    bancaPlans: normalizePlans(source.bancaPlans, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.bancaPlans),
    distributorModels: normalizeDistributorModels(
      source.distributorModels,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.distributorModels
    ),
    glossary: normalizeGlossary(source.glossary, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.glossary),
    validationHypotheses: normalizeHypotheses(
      source.validationHypotheses,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.validationHypotheses
    ),
    decisions: normalizeDecisions(source.decisions, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.decisions),
    nextSteps: normalizeStringArray(source.nextSteps, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.nextSteps),
    dailyNotes: normalizeString(source.dailyNotes, DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.dailyNotes),
    openQuestions: normalizeStringArray(
      source.openQuestions,
      DEFAULT_COMMERCIAL_PLANNING_DOCUMENT.openQuestions
    ),
  };
}

function normalizeVersionEntry(value: unknown): CommercialPlanningVersionEntry | null {
  if (!value || typeof value !== "object") return null;

  const id = normalizeString((value as any)?.id).trim();
  const savedAt = normalizeString((value as any)?.savedAt).trim();
  const summary = normalizeString((value as any)?.summary).trim();
  const document = normalizeCommercialPlanningDocument((value as any)?.document);

  if (!id || !savedAt) return null;

  return {
    id,
    savedAt,
    summary,
    document,
  };
}

export function normalizeCommercialPlanningHistory(value: unknown): CommercialPlanningVersionEntry[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => normalizeVersionEntry(item))
    .filter((item): item is CommercialPlanningVersionEntry => Boolean(item))
    .slice(0, COMMERCIAL_PLANNING_HISTORY_LIMIT);
}
