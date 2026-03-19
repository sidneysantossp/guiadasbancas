export type BancaLifecycleCode =
  | "missing"
  | "draft"
  | "pending_approval"
  | "paused"
  | "published";

type BancaLifecycleInput =
  | {
      active?: boolean | null;
      approved?: boolean | null;
    }
  | null
  | undefined;

export function resolveBancaLifecycle(input: BancaLifecycleInput) {
  if (!input) {
    return {
      code: "missing" as BancaLifecycleCode,
      label: "Sem banca",
      shortLabel: "Sem banca",
      description: "Nenhuma banca foi vinculada a esta conta ainda.",
      exists: false,
      canAccessPanel: false,
      isPublished: false,
      isOperational: false,
      requiresApproval: false,
    };
  }

  const isActive = input.active !== false;
  const isApproved = input.approved === true;

  if (isActive && isApproved) {
    return {
      code: "published" as BancaLifecycleCode,
      label: "Banca publicada",
      shortLabel: "Em operacao",
      description: "A banca esta aprovada, ativa e visivel para os clientes no marketplace.",
      exists: true,
      canAccessPanel: true,
      isPublished: true,
      isOperational: true,
      requiresApproval: false,
    };
  }

  if (isActive && !isApproved) {
    return {
      code: "pending_approval" as BancaLifecycleCode,
      label: "Aguardando aprovacao",
      shortLabel: "Aguardando aprovacao",
      description: "A banca ja existe e pode ser configurada no painel, mas ainda nao foi liberada para publicacao.",
      exists: true,
      canAccessPanel: true,
      isPublished: false,
      isOperational: false,
      requiresApproval: true,
    };
  }

  if (!isActive && isApproved) {
    return {
      code: "paused" as BancaLifecycleCode,
      label: "Operacao pausada",
      shortLabel: "Operacao pausada",
      description: "A banca ja foi aprovada, mas esta pausada e nao aparece como operacao ativa no marketplace.",
      exists: true,
      canAccessPanel: true,
      isPublished: false,
      isOperational: false,
      requiresApproval: false,
    };
  }

  return {
    code: "draft" as BancaLifecycleCode,
    label: "Cadastro em preparacao",
    shortLabel: "Em preparacao",
    description: "A banca existe, mas ainda esta em configuracao inicial e sem liberacao para operar.",
    exists: true,
    canAccessPanel: true,
    isPublished: false,
    isOperational: false,
    requiresApproval: true,
  };
}
