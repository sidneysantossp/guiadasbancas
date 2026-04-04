export type SupportedPlanType = "free" | "premium";
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
  if (value === "premium" || value === "start") {
    return "premium";
  }

  return "free";
}

export function getPlanLabel(planType: string | null | undefined): string {
  const normalized = normalizePlanType(planType);

  if (normalized === "premium") return "Premium";
  return "Free";
}

export function getNextPlanType(planType: string | null | undefined): SupportedPlanType | null {
  const normalized = normalizePlanType(planType);

  if (normalized === "free") return "premium";
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
        description: `No ${currentPlanName}, ${currentCountText}. Ative o Premium desta banca para ampliar o catálogo manual sem travar a operação.`,
        bullets: [
          "Amplie o limite de produtos próprios cadastrados manualmente.",
          "Continue organizando a vitrine sem apagar itens já cadastrados.",
          "Mantenha a licença desta banca separada das demais unidades.",
        ],
        targetPlanType: nextPlanType,
        targetPlanLabel: nextPlanLabel,
        primaryLabel: "Ativar Premium",
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
          : "Distribuidores são um recurso do Premium",
      description:
        currentPlanType === "premium"
          ? "Seu plano já libera o catálogo parceiro e a navegação pelos distribuidores habilitados na plataforma."
          : `Hoje sua banca está no ${currentPlanName}. Ative o Premium para liberar distribuidores e ampliar o mix sem cadastrar tudo manualmente.`,
      bullets:
        currentPlanType === "premium"
          ? [
              "Gerencie produtos próprios e parceiros no mesmo painel.",
              "Navegue pela rede de distribuidores sem sair do fluxo do jornaleiro.",
              "Aproveite a estrutura pronta para crescer com mais rapidez.",
            ]
          : [
              "Acesse catálogos de distribuidores diretamente no painel.",
              "Ative produtos parceiros na banca sem retrabalho manual.",
              "Transforme abastecimento em um fluxo mais rápido e previsível.",
            ],
      targetPlanType: currentPlanType === "premium" ? null : "premium",
      targetPlanLabel: currentPlanType === "premium" ? null : "Premium",
      primaryLabel: currentPlanType === "premium" ? "Revisar meu plano" : "Ativar acesso parceiro",
    };
  }

  if (currentPlanType === "free") {
    return {
      tone: "blue",
      title: "Seu próximo passo sugerido é o Premium",
      description: `O ${currentPlanName} já libera a operação base da banca. Quando quiser crescer com campanhas, publi editorial, destaque, distribuidores e suporte prioritário, o Premium passa a fazer sentido.`,
      bullets: [
        "Destrave campanhas, publi editorial e destaque na plataforma.",
        "Libere distribuidores e amplie o mix sem retrabalho manual.",
        "Ative o Premium desta banca somente quando fizer sentido para a operação.",
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
