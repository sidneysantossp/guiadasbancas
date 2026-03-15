import type { Route } from "next";

export type JornaleiroIconKey =
  | "dashboard"
  | "intelligence"
  | "banca"
  | "orders"
  | "products"
  | "catalog"
  | "campaigns"
  | "distributors"
  | "users"
  | "coupons"
  | "notifications"
  | "academy"
  | "settings"
  | "plan";

export type JornaleiroPermissionKey =
  | "dashboard"
  | "bancas"
  | "colaboradores"
  | "notificacoes"
  | "pedidos"
  | "produtos"
  | "catalogo"
  | "campanhas"
  | "distribuidores"
  | "cupons"
  | "relatorios"
  | "academy"
  | "configuracoes"
  | "plano";

export type JornaleiroMenuItem = {
  label: string;
  href: Route;
  icon: JornaleiroIconKey;
  description: string;
  permissionKey?: JornaleiroPermissionKey;
  aliases?: string[];
  requiresCatalogAccess?: boolean;
  requiresPartnerDirectoryAccess?: boolean;
  hideWhenPlansDisabled?: boolean;
};

export type JornaleiroMenuSection = {
  section: string;
  description: string;
  items: JornaleiroMenuItem[];
};

export type JornaleiroMenuContext = {
  hasCatalogAccess: boolean;
  hasPartnerDirectoryAccess: boolean;
  plansMenuEnabled: boolean;
  permissionsLoaded: boolean;
  isOwner: boolean | null;
  userPermissions: string[];
};

const JOURNALEIRO_MENU: JornaleiroMenuSection[] = [
  {
    section: "Visao da Banca",
    description: "Leitura do momento da banca, prioridades e inteligencia para decidir o proximo passo.",
    items: [
      {
        label: "Dashboard",
        href: "/jornaleiro/dashboard" as Route,
        icon: "dashboard",
        description: "Centro de comando da operacao diaria com prioridade, status e atalhos.",
        permissionKey: "dashboard",
      },
      {
        label: "Central de Inteligencia",
        href: "/jornaleiro/inteligencia" as Route,
        icon: "intelligence",
        description: "Cruza pedidos, catalogo, demanda e vitrine para orientar as decisoes da banca.",
        permissionKey: "relatorios",
        aliases: ["/jornaleiro/relatorios", "/jornaleiro/relatorios/analytics", "/jornaleiro/relatorios/cotista"],
      },
    ],
  },
  {
    section: "Operacao da Banca",
    description: "Tudo que o jornaleiro precisa para manter a banca publicada, organizada e vendendo.",
    items: [
      {
        label: "Perfil e Publicacao",
        href: "/jornaleiro/banca-v2" as Route,
        icon: "banca",
        description: "Dados da banca, identidade visual, horarios, contato e publicacao.",
        permissionKey: "bancas",
        aliases: ["/jornaleiro/banca", "/jornaleiro/banca-v2"],
      },
      {
        label: "Pedidos",
        href: "/jornaleiro/pedidos" as Route,
        icon: "orders",
        description: "Acompanhe pedidos, priorize atendimento e avance os status da operacao.",
        permissionKey: "pedidos",
      },
      {
        label: "Produtos",
        href: "/jornaleiro/produtos" as Route,
        icon: "products",
        description: "Catalogo proprio da banca com controle de oferta, estoque e qualidade.",
        permissionKey: "produtos",
      },
      {
        label: "Notificacoes",
        href: "/jornaleiro/notificacoes" as Route,
        icon: "notifications",
        description: "Avisos operacionais, atualizacoes de pedidos e comunicacoes da plataforma.",
        permissionKey: "notificacoes",
      },
    ],
  },
  {
    section: "Equipe e Estrutura",
    description: "Gestao de bancas vinculadas, equipe operacional e ajustes estruturais da conta.",
    items: [
      {
        label: "Minhas Bancas",
        href: "/jornaleiro/bancas" as Route,
        icon: "banca",
        description: "Troque de banca, acompanhe o portfolio vinculado e acesse o cadastro.",
        permissionKey: "bancas",
      },
      {
        label: "Colaboradores",
        href: "/jornaleiro/colaboradores" as Route,
        icon: "users",
        description: "Permissoes e acessos da equipe que opera a banca no dia a dia.",
        permissionKey: "colaboradores",
      },
      {
        label: "Configuracoes",
        href: "/jornaleiro/configuracoes" as Route,
        icon: "settings",
        description: "Entrega, pagamento, canais de contato e parametros gerais da banca.",
        permissionKey: "configuracoes",
      },
    ],
  },
  {
    section: "Abastecimento e Crescimento",
    description: "Oferta complementar, relacao com distribuidores e alavancas para vender mais.",
    items: [
      {
        label: "Catalogo Parceiro",
        href: "/jornaleiro/catalogo-distribuidor/gerenciar" as Route,
        icon: "catalog",
        description: "Gestao dos produtos parceiros liberados para complementar o catalogo da banca.",
        permissionKey: "catalogo",
        aliases: ["/jornaleiro/catalogo-distribuidor"],
        requiresCatalogAccess: true,
      },
      {
        label: "Rede de Distribuidores",
        href: "/jornaleiro/distribuidores" as Route,
        icon: "distributors",
        description: "Acesso a parceiros de abastecimento e fornecedores integrados ao marketplace.",
        permissionKey: "distribuidores",
        requiresPartnerDirectoryAccess: true,
      },
      {
        label: "Campanhas",
        href: "/jornaleiro/campanhas" as Route,
        icon: "campaigns",
        description: "Promocoes patrocinadas e visibilidade extra para os produtos da banca.",
        permissionKey: "campanhas",
      },
      {
        label: "Cupons",
        href: "/jornaleiro/coupons" as Route,
        icon: "coupons",
        description: "Mecanica promocional para ativar demanda e recompras da base de clientes.",
        permissionKey: "cupons",
      },
    ],
  },
  {
    section: "Plano e Aprendizado",
    description: "Evolucao comercial da banca, treinamento e configuracao do plano contratado.",
    items: [
      {
        label: "Meu Plano",
        href: "/jornaleiro/meu-plano" as Route,
        icon: "plan",
        description: "Status do plano, cobrancas, limites e acessos da banca.",
        permissionKey: "plano",
        hideWhenPlansDisabled: true,
      },
      {
        label: "Academy",
        href: "/jornaleiro/academy" as Route,
        icon: "academy",
        description: "Conteudos para ajudar o jornaleiro a usar melhor a plataforma.",
        permissionKey: "academy",
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

function itemVisible(item: JornaleiroMenuItem, context: JornaleiroMenuContext) {
  if (item.requiresCatalogAccess && !context.hasCatalogAccess) return false;
  if (item.requiresPartnerDirectoryAccess && !context.hasPartnerDirectoryAccess) return false;
  if (item.hideWhenPlansDisabled && !context.plansMenuEnabled) return false;

  if (!context.permissionsLoaded) {
    return item.href === ("/jornaleiro/dashboard" as Route);
  }

  if (context.isOwner === true || !item.permissionKey) {
    return true;
  }

  return context.userPermissions.includes(item.permissionKey);
}

export function buildJornaleiroMenuSections(context: JornaleiroMenuContext): JornaleiroMenuSection[] {
  return JOURNALEIRO_MENU.map((section) => ({
    ...section,
    items: section.items.filter((item) => itemVisible(item, context)),
  })).filter((section) => section.items.length > 0);
}
