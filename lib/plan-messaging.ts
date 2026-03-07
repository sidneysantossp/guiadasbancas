export type SupportedPlanType = "free" | "start" | "premium";
export type UpgradeContext = "dashboard" | "product-limit" | "partner-network";

export type PlanUpgradeHint = {
  tone: "orange" | "blue" | "green";
  title: string;
  description: string;
  bullets: string[];
  targetPlanType: SupportedPlanType | null;
  targetPlanLabel: string | null;
  primaryLabel: string;
};

function normalizePlanType(value: string | null | undefined): SupportedPlanType {
  if (value === "start" || value === "premium") {
    return value;
  }

  return "free";
}

export function getPlanLabel(planType: string | null | undefined): string {
  const normalized = normalizePlanType(planType);

  if (normalized === "start") return "Start";
  if (normalized === "premium") return "Premium";
  return "Free";
}

export function getNextPlanType(planType: string | null | undefined): SupportedPlanType | null {
  const normalized = normalizePlanType(planType);

  if (normalized === "free") return "start";
  if (normalized === "start") return "premium";
  return null;
}

export function getPlanUpgradeHint(params: {
  currentPlanType: string | null | undefined;
  currentPlanName?: string | null;
  context: UpgradeContext;
  productLimit?: number | null;
  currentCount?: number | null;
}): PlanUpgradeHint {
  const currentPlanType = normalizePlanType(params.currentPlanType);
  const currentPlanName = params.currentPlanName || getPlanLabel(currentPlanType);
  const nextPlanType = getNextPlanType(currentPlanType);
  const nextPlanLabel = nextPlanType ? getPlanLabel(nextPlanType) : null;

  if (params.context === "product-limit") {
    if (currentPlanType === "free") {
      const currentCountText =
        typeof params.currentCount === "number" && params.currentCount >= 0
          ? `${params.currentCount} itens já cadastrados`
          : "seu limite atual já foi alcançado";

      return {
        tone: "orange",
        title: "Seu catálogo chegou ao limite do Free",
        description: `No ${currentPlanName}, ${currentCountText}. Faça upgrade para continuar cadastrando produtos sem travar sua operação.`,
        bullets: [
          "Suba para o Start e ganhe mais espaço para ampliar seu sortimento.",
          "Continue organizando a vitrine sem precisar apagar itens já cadastrados.",
          "Faça o upgrade em poucos cliques dentro do painel.",
        ],
        targetPlanType: nextPlanType,
        targetPlanLabel: nextPlanLabel,
        primaryLabel: "Ver planos e continuar",
      };
    }

    return {
      tone: "orange",
      title: "Seu plano atual já ficou pequeno para o catálogo",
      description: `O ${currentPlanName} já atingiu o limite configurado para produtos próprios. O próximo passo é subir de plano para continuar crescendo sem atrito.`,
      bullets: [
        "Destrave mais capacidade para sua vitrine.",
        "Ganhe acesso aos recursos mais avançados do painel.",
        "Evite interromper o cadastro de novos produtos.",
      ],
      targetPlanType: nextPlanType,
      targetPlanLabel: nextPlanLabel,
      primaryLabel: "Fazer upgrade do plano",
    };
  }

  if (params.context === "partner-network") {
    return {
      tone: currentPlanType === "premium" ? "green" : "blue",
      title:
        currentPlanType === "premium"
          ? "Sua banca já faz parte da rede parceira"
          : "A rede de distribuidores faz parte do Premium",
      description:
        currentPlanType === "premium"
          ? "Seu plano já libera o catálogo parceiro e a navegação pelos distribuidores habilitados na plataforma."
          : `Hoje sua banca está no ${currentPlanName}. Ative o Premium para receber acesso ao catálogo parceiro e ampliar o mix sem cadastrar tudo manualmente.`,
      bullets:
        currentPlanType === "premium"
          ? [
              "Gerencie produtos próprios e parceiros no mesmo painel.",
              "Navegue pela rede de distribuidores sem sair do fluxo do jornaleiro.",
              "Aproveite a estrutura pronta para crescer com mais rapidez.",
            ]
          : [
              "Acesse o catálogo parceiro diretamente no painel.",
              "Ganhe agilidade para ativar produtos de distribuidores.",
              "Centralize seu abastecimento em uma jornada mais simples.",
            ],
      targetPlanType: currentPlanType === "premium" ? null : "premium",
      targetPlanLabel: currentPlanType === "premium" ? null : "Premium",
      primaryLabel: currentPlanType === "premium" ? "Revisar meu plano" : "Ativar acesso parceiro",
    };
  }

  if (currentPlanType === "free") {
    return {
      tone: "blue",
      title: "Seu próximo passo sugerido é o Start",
      description: `O ${currentPlanName} já libera o painel e a vitrine inicial. Quando sua banca estiver pronta para crescer, o Start é a evolução natural.`,
      bullets: [
        "Tenha mais fôlego para ampliar o catálogo.",
        "Organize melhor a operação sem complicar o cadastro.",
        "Faça o upgrade no momento em que sentir necessidade real.",
      ],
      targetPlanType: nextPlanType,
      targetPlanLabel: nextPlanLabel,
      primaryLabel: "Conhecer o Start",
    };
  }

  if (currentPlanType === "start") {
    return {
      tone: "blue",
      title: "O próximo salto do Start é o Premium",
      description: `Sua banca já saiu do básico. Quando quiser acelerar o sortimento e conectar distribuidores, o Premium passa a fazer mais sentido.`,
      bullets: [
        "Destrave a rede parceira da plataforma.",
        "Ganhe mais escala para crescer sem retrabalho.",
        "Centralize catálogo próprio e catálogo parceiro no mesmo fluxo.",
      ],
      targetPlanType: nextPlanType,
      targetPlanLabel: nextPlanLabel,
      primaryLabel: "Conhecer o Premium",
    };
  }

  return {
    tone: "green",
    title: "Seu plano já está no nível mais completo",
    description: "O Premium já libera os recursos estratégicos da operação. Agora o foco é publicar melhor, vender mais e usar o painel com consistência.",
    bullets: [
      "Revise o cadastro da banca para melhorar a conversão.",
      "Aproveite os recursos parceiros já habilitados.",
      "Use o painel para escalar com mais previsibilidade.",
    ],
    targetPlanType: null,
    targetPlanLabel: null,
    primaryLabel: "Revisar meu plano",
  };
}
