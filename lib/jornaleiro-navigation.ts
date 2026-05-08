import type { Route } from "next";

export type JornaleiroIconKey =
  | "dashboard"
  | "intelligence"
  | "banca"
  | "orders"
  | "products"
  | "catalog"
  | "marketing"
  | "campaigns"
  | "distributors"
  | "users"
  | "coupons"
  | "notifications"
  | "academy"
  | "settings"
  | "plan";

export const JOURNALEIRO_ALL_PERMISSION_KEYS = [
  "dashboard",
  "relatorios",
  "bancas",
  "pedidos",
  "produtos",
  "notificacoes",
  "colaboradores",
  "configuracoes",
  "catalogo",
  "marketing",
  "distribuidores",
  "campanhas",
  "cupons",
  "academy",
] as const;

export type JornaleiroPermissionKey = (typeof JOURNALEIRO_ALL_PERMISSION_KEYS)[number];

export type JornaleiroMenuItem = {
  label: string;
  href: Route;
  icon: JornaleiroIconKey;
  description: string;
  permissionKey?: JornaleiroPermissionKey;
  aliases?: string[];
  requiresCatalogAccess?: boolean;
  requiresPartnerDirectoryAccess?: boolean;
  requiresWholesaleAccess?: boolean;
  requiresMarketplaceModule?: boolean;
  premiumFeature?: boolean;
  upgradeSource?: string;
  hideWhenPlansDisabled?: boolean;
  visibleInFree?: boolean;
  isSubItem?: boolean;
  children?: JornaleiroMenuItem[];
};

export type JornaleiroMenuSection = {
  section: string;
  description: string;
  items: JornaleiroMenuItem[];
};

export type JornaleiroResolvedMenuContext = {
  section: JornaleiroMenuSection;
  item: JornaleiroMenuItem;
};

export type JornaleiroPermissionModuleContext = {
  hasCatalogAccess: boolean;
  hasPartnerDirectoryAccess: boolean;
  hasWholesaleAccess: boolean;
  hasCampaignAccess: boolean;
  marketplaceModuleEnabled?: boolean;
  plansMenuEnabled: boolean;
  planType: string | null;
};

export type JornaleiroMenuContext = JornaleiroPermissionModuleContext & {
  permissionsLoaded: boolean;
  isOwner: boolean | null;
  userPermissions: string[];
};

export type JornaleiroPermissionModule = {
  key: JornaleiroPermissionKey;
  label: string;
  description: string;
};

export const DEFAULT_JORNALEIRO_PERMISSION_MODULE_CONTEXT: JornaleiroPermissionModuleContext = {
  hasCatalogAccess: false,
  hasPartnerDirectoryAccess: false,
  hasWholesaleAccess: false,
  hasCampaignAccess: false,
  marketplaceModuleEnabled: false,
  plansMenuEnabled: true,
  planType: "free",
};

const JOURNALEIRO_PERMISSION_KEY_SET = new Set<string>(JOURNALEIRO_ALL_PERMISSION_KEYS);

const JOURNALEIRO_MENU: JornaleiroMenuSection[] = [
  {
    section: "Visão da Banca",
    description: "Leitura do momento da banca, prioridades e inteligência para decidir o próximo passo.",
    items: [
      {
        label: "Dashboard",
        href: "/jornaleiro/dashboard" as Route,
        icon: "dashboard",
        description: "Centro de comando da operação diária com prioridade, status e atalhos.",
        permissionKey: "dashboard",
        visibleInFree: true,
      },
      {
        label: "Central de Inteligência",
        href: "/jornaleiro/inteligencia" as Route,
        icon: "intelligence",
        description: "Cruza pedidos, catálogo, demanda e vitrine para orientar as decisões da banca.",
        permissionKey: "relatorios",
        aliases: [
          "/jornaleiro/relatorios",
          "/jornaleiro/relatorios/analytics",
          "/jornaleiro/relatorios/cotista",
          "/jornaleiro/relatorios/rede-parceira",
        ],
        visibleInFree: true,
      },
    ],
  },
  {
    section: "Operação da Banca",
    description: "Tudo que o jornaleiro precisa para manter a banca publicada, organizada e vendendo.",
    items: [
      {
        label: "Perfil e Publicação",
        href: "/jornaleiro/banca-v2" as Route,
        icon: "banca",
        description: "Dados da banca, identidade visual, horários, contato e publicação.",
        permissionKey: "bancas",
        aliases: ["/jornaleiro/banca", "/jornaleiro/banca-v2"],
        visibleInFree: true,
      },
      {
        label: "Pedidos",
        href: "/jornaleiro/pedidos" as Route,
        icon: "orders",
        description: "Acompanhe pedidos, priorize atendimento e avance os status da operação.",
        permissionKey: "pedidos",
        visibleInFree: true,
      },
      {
        label: "Produtos",
        href: "/jornaleiro/produtos" as Route,
        icon: "products",
        description: "Catálogo próprio da banca com controle de oferta, estoque e qualidade.",
        permissionKey: "produtos",
        visibleInFree: true,
      },
      {
        label: "Notificações",
        href: "/jornaleiro/notificacoes" as Route,
        icon: "notifications",
        description: "Avisos operacionais, atualizações de pedidos e comunicações da plataforma.",
        permissionKey: "notificacoes",
        visibleInFree: true,
      },
    ],
  },
  {
    section: "Equipe e Estrutura",
    description: "Gestão de bancas vinculadas, equipe operacional e ajustes estruturais da conta.",
    items: [
      {
        label: "Minhas Bancas",
        href: "/jornaleiro/bancas" as Route,
        icon: "banca",
        description: "Troque de banca, acompanhe o portfólio vinculado e acesse o cadastro.",
        permissionKey: "bancas",
        visibleInFree: true,
      },
      {
        label: "Colaboradores",
        href: "/jornaleiro/colaboradores" as Route,
        icon: "users",
        description: "Permissões e acessos da equipe que opera a banca no dia a dia.",
        permissionKey: "colaboradores",
        visibleInFree: true,
      },
      {
        label: "Configurações",
        href: "/jornaleiro/configuracoes" as Route,
        icon: "settings",
        description: "Entrega, pagamento, canais de contato e parâmetros gerais da banca.",
        permissionKey: "configuracoes",
        visibleInFree: true,
      },
    ],
  },
  {
    section: "Abastecimento e Crescimento",
    description: "Oferta complementar, relação com distribuidores e alavancas para vender mais.",
    items: [
      {
        label: "Marketplace",
        href: "/jornaleiro/fornecedor" as Route,
        icon: "catalog",
        description: "Compra B2B de produtos liberados para sua banca.",
        aliases: ["/jornaleiro/atacado"],
        requiresMarketplaceModule: true,
        visibleInFree: true,
      },
      {
        label: "Meus Pedidos",
        href: "/jornaleiro/fornecedor/pedidos" as Route,
        icon: "orders",
        description: "Acompanhe pedidos do Marketplace por aprovação, envio e conclusão.",
        requiresMarketplaceModule: true,
        visibleInFree: true,
        isSubItem: true,
      },
      {
        label: "Catálogo Parceiro",
        href: "/jornaleiro/catalogo-distribuidor/gerenciar" as Route,
        icon: "catalog",
        description: "Gestão dos produtos parceiros liberados para complementar o catálogo da banca.",
        permissionKey: "catalogo",
        aliases: ["/jornaleiro/catalogo-distribuidor"],
        requiresCatalogAccess: true,
        premiumFeature: true,
        upgradeSource: "catalogo-distribuidor",
        visibleInFree: true,
      },
      {
        label: "Rede de Distribuidores",
        href: "/jornaleiro/distribuidores" as Route,
        icon: "distributors",
        description: "Acesso a parceiros de abastecimento e fornecedores integrados ao marketplace.",
        permissionKey: "distribuidores",
        requiresPartnerDirectoryAccess: true,
        premiumFeature: true,
        upgradeSource: "distribuidores",
        visibleInFree: true,
      },
      {
        label: "Marketing",
        href: "/jornaleiro/marketing" as Route,
        icon: "marketing",
        description: "Links, QR Code e mensagens prontas para divulgar a banca nos canais próprios.",
        permissionKey: "marketing",
        visibleInFree: true,
      },
      {
        label: "Campanhas",
        href: "/jornaleiro/campanhas" as Route,
        icon: "campaigns",
        description: "Promoções patrocinadas e visibilidade extra para os produtos da banca.",
        permissionKey: "campanhas",
        premiumFeature: true,
        upgradeSource: "campanhas",
        visibleInFree: true,
      },
      {
        label: "Cupons",
        href: "/jornaleiro/coupons" as Route,
        icon: "coupons",
        description: "Mecânica promocional para ativar demanda e recompras da base de clientes.",
        permissionKey: "cupons",
        visibleInFree: true,
      },
    ],
  },
  {
    section: "Aprendizado",
    description: "Treinamento e conteúdos para operar melhor a banca.",
    items: [
      {
        label: "Academy",
        href: "/jornaleiro/academy" as Route,
        icon: "academy",
        description: "Conteúdos para ajudar o jornaleiro a usar melhor a plataforma.",
        permissionKey: "academy",
        visibleInFree: true,
      },
    ],
  },
];

export const JOURNALEIRO_MOBILE_QUICK_LINKS = [
  { key: "dashboard", label: "Painel", href: "/jornaleiro/dashboard" as Route, icon: "dashboard" as JornaleiroIconKey },
  { key: "orders", label: "Pedidos", href: "/jornaleiro/pedidos" as Route, icon: "orders" as JornaleiroIconKey },
  { key: "products", label: "Produtos", href: "/jornaleiro/produtos" as Route, icon: "products" as JornaleiroIconKey },
  { key: "intelligence", label: "Dados", href: "/jornaleiro/inteligencia" as Route, icon: "intelligence" as JornaleiroIconKey },
] as const;

const PERMISSION_MODULE_OVERRIDES: Partial<Record<JornaleiroPermissionKey, JornaleiroPermissionModule>> = {
  bancas: {
    key: "bancas",
    label: "Perfil e publicação / Minhas Bancas",
    description: "Dados da banca, publicação e gestão das bancas vinculadas.",
  },
  catalogo: {
    key: "catalogo",
    label: "Catálogo e abastecimento",
    description: "Catálogo parceiro e compra B2B quando liberados para a banca.",
  },
  relatorios: {
    key: "relatorios",
    label: "Central de Inteligência",
    description: "Ler sinais operacionais, demanda e performance da banca.",
  },
};

export function normalizeJornaleiroPermissionKeys(value: unknown): JornaleiroPermissionKey[] {
  let rawPermissions: unknown[] = [];

  if (Array.isArray(value)) {
    rawPermissions = value;
  } else if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      rawPermissions = Array.isArray(parsed) ? parsed : [];
    } catch {
      rawPermissions = [];
    }
  }

  const seen = new Set<JornaleiroPermissionKey>();
  const normalized: JornaleiroPermissionKey[] = [];

  for (const permission of rawPermissions) {
    if (typeof permission !== "string" || !JOURNALEIRO_PERMISSION_KEY_SET.has(permission)) {
      continue;
    }

    const key = permission as JornaleiroPermissionKey;
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(key);
    }
  }

  return normalized;
}

export function isJornaleiroMenuItemOperational(
  item: JornaleiroMenuItem,
  context: JornaleiroPermissionModuleContext
) {
  if (context.planType === "free" && !item.visibleInFree) return false;
  if (item.hideWhenPlansDisabled && !context.plansMenuEnabled) return false;
  if (item.requiresMarketplaceModule && context.marketplaceModuleEnabled !== true) return false;
  if (item.requiresWholesaleAccess && !context.hasWholesaleAccess) return false;
  if (item.requiresCatalogAccess && !context.hasCatalogAccess) return false;
  if (item.requiresPartnerDirectoryAccess && !context.hasPartnerDirectoryAccess) return false;
  if (item.permissionKey === "campanhas" && context.hasCampaignAccess === false) return false;
  if (item.premiumFeature && context.planType === "free") return false;

  return true;
}

function itemSelfVisible(item: JornaleiroMenuItem, context: JornaleiroMenuContext) {
  if (!isJornaleiroMenuItemOperational(item, context)) return false;

  if (!context.permissionsLoaded) {
    return item.href === ("/jornaleiro/dashboard" as Route);
  }

  if (context.isOwner === true || !item.permissionKey) {
    return true;
  }

  return context.userPermissions.includes(item.permissionKey);
}

function filterVisibleMenuItem(item: JornaleiroMenuItem, context: JornaleiroMenuContext): JornaleiroMenuItem | null {
  const children = (item.children || [])
    .map((child) => filterVisibleMenuItem(child, context))
    .filter((child): child is JornaleiroMenuItem => Boolean(child));

  if (!itemSelfVisible(item, context) && children.length === 0) {
    return null;
  }

  return {
    ...item,
    children: children.length > 0 ? children : undefined,
  };
}

export function buildJornaleiroMenuSections(context: JornaleiroMenuContext): JornaleiroMenuSection[] {
  return JOURNALEIRO_MENU.map((section) => ({
    ...section,
    items: section.items
      .map((item) => filterVisibleMenuItem(item, context))
      .filter((item): item is JornaleiroMenuItem => Boolean(item)),
  })).filter((section) => section.items.length > 0);
}

function walkJornaleiroMenuItems(items: JornaleiroMenuItem[]): JornaleiroMenuItem[] {
  return items.flatMap((item) => [item, ...walkJornaleiroMenuItems(item.children || [])]);
}

export function buildJornaleiroPermissionModules(
  context: JornaleiroPermissionModuleContext
): JornaleiroPermissionModule[] {
  const byPermissionKey = new Map<JornaleiroPermissionKey, JornaleiroPermissionModule>();

  for (const section of JOURNALEIRO_MENU) {
    for (const item of walkJornaleiroMenuItems(section.items)) {
      if (!item.permissionKey || !isJornaleiroMenuItemOperational(item, context)) {
        continue;
      }

      if (byPermissionKey.has(item.permissionKey)) {
        continue;
      }

      byPermissionKey.set(
        item.permissionKey,
        PERMISSION_MODULE_OVERRIDES[item.permissionKey] || {
          key: item.permissionKey,
          label: item.label,
          description: item.description,
        }
      );
    }
  }

  return JOURNALEIRO_ALL_PERMISSION_KEYS.flatMap((key) => {
    const module = byPermissionKey.get(key);
    return module ? [module] : [];
  });
}

export function findJornaleiroMenuContextByPathname(pathname?: string | null): JornaleiroResolvedMenuContext | null {
  if (!pathname) return null;

  let bestMatch: JornaleiroResolvedMenuContext | null = null;
  let bestMatchLength = -1;

  for (const section of JOURNALEIRO_MENU) {
    for (const item of walkJornaleiroMenuItems(section.items)) {
      const targets = [item.href, ...(item.aliases || [])];
      for (const target of targets) {
        if (pathname !== target && !pathname.startsWith(`${target}/`)) {
          continue;
        }

        if (target.length > bestMatchLength) {
          bestMatch = { section, item };
          bestMatchLength = target.length;
        }
      }
    }
  }

  return bestMatch;
}
