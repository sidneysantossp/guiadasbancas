export type AdminIconKey =
  | "dashboard"
  | "chart"
  | "clipboard"
  | "store"
  | "orders"
  | "creditCard"
  | "box"
  | "tags"
  | "truck"
  | "userCheck"
  | "image"
  | "home"
  | "sparkles"
  | "article"
  | "megaphone"
  | "grid"
  | "newspaper"
  | "gift"
  | "school"
  | "settings"
  | "brandWhatsapp"
  | "palette"
  | "footer"
  | "users"
  | "user";

export type AdminMenuItem = {
  label: string;
  href: string;
  icon: AdminIconKey;
  description: string;
};

export type AdminMenuSection = {
  section: string;
  description: string;
  items: AdminMenuItem[];
};

export const ADMIN_MENU: AdminMenuSection[] = [
  {
    section: "Visao Executiva",
    description: "Decisao estrategica, leitura consolidada da operacao e direcao comercial da plataforma.",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: "dashboard",
        description: "Centro de comando do marketplace com alertas, atalhos e visao operacional.",
      },
      {
        label: "Inteligencia de Dados",
        href: "/admin/inteligencia",
        icon: "chart",
        description: "Cruza demanda, oferta, operacao e receita em uma camada analitica unica.",
      },
      {
        label: "Planejamento Comercial",
        href: "/admin/planejamento-comercial",
        icon: "clipboard",
        description: "Base viva da tese do negocio, planos, hipoteses e backlog estrategico.",
      },
    ],
  },
  {
    section: "Operacao do Marketplace",
    description: "Tudo que move a rede de bancas, o fluxo de pedidos e a monetizacao recorrente.",
    items: [
      {
        label: "Bancas",
        href: "/admin/bancas",
        icon: "store",
        description: "Cadastro, aprovacao, ativacao e tratamento operacional das bancas.",
      },
      {
        label: "Jornaleiros",
        href: "/admin/jornaleiros",
        icon: "users",
        description: "Contas operacionais ligadas as bancas, seus planos, pedidos e bloqueios.",
      },
      {
        label: "Usuarios",
        href: "/admin/users",
        icon: "user",
        description: "Base de contas da plataforma, incluindo clientes e usuarios vinculados a bancas.",
      },
      {
        label: "Pedidos",
        href: "/admin/orders",
        icon: "orders",
        description: "Acompanhamento global dos pedidos da plataforma e seus status.",
      },
      {
        label: "Assinaturas",
        href: "/admin/assinaturas",
        icon: "creditCard",
        description: "Leitura da base ativa, pendencias de pagamento e saude da receita recorrente.",
      },
      {
        label: "Planos",
        href: "/admin/planos",
        icon: "creditCard",
        description: "Definicao dos produtos de assinatura vendidos para as bancas.",
      },
    ],
  },
  {
    section: "Oferta e Abastecimento",
    description: "Gestao do catalogo, distribuidores, imagens e estrutura comercial de abastecimento.",
    items: [
      {
        label: "Produtos",
        href: "/admin/products",
        icon: "box",
        description: "Catalogo central que abastece site, bancas e distribuidores.",
      },
      {
        label: "Categorias",
        href: "/admin/categories",
        icon: "tags",
        description: "Taxonomia do marketplace e visibilidade por contexto de negocio.",
      },
      {
        label: "Distribuidores",
        href: "/admin/distribuidores",
        icon: "truck",
        description: "Operacao dos parceiros de supply e integracao com Mercos.",
      },
      {
        label: "Relacionamentos Comerciais",
        href: "/admin/cotistas",
        icon: "userCheck",
        description: "Rede comercial legada e vinculos de abastecimento entre atores.",
      },
      {
        label: "Importar Fotos",
        href: "/admin/produtos/upload-imagens",
        icon: "image",
        description: "Saneamento visual do catalogo para melhorar vitrine e conversao.",
      },
    ],
  },
  {
    section: "Site e Growth",
    description: "Camada editorial, visual e promocional que move descoberta, marca e aquisicao.",
    items: [
      {
        label: "Home",
        href: "/admin/cms/home",
        icon: "home",
        description: "Hero, secoes e narrativa principal do site publico.",
      },
      {
        label: "Vitrines",
        href: "/admin/cms/vitrines",
        icon: "sparkles",
        description: "Curadoria de produtos e bancas em destaque nas paginas chave.",
      },
      {
        label: "Branding",
        href: "/admin/cms/branding",
        icon: "palette",
        description: "Identidade visual global da plataforma e seus pontos de contato.",
      },
      {
        label: "Blog",
        href: "/admin/blog",
        icon: "article",
        description: "Conteudo editorial com funcao de posicionamento e descoberta organica.",
      },
      {
        label: "Campanhas",
        href: "/admin/campaigns",
        icon: "megaphone",
        description: "Promocoes e campanhas conectadas ao catalogo e aos paines operacionais.",
      },
      {
        label: "Mini Banners",
        href: "/admin/cms/mini-banners",
        icon: "grid",
        description: "Espacos promocionais menores que modulam descoberta e oferta.",
      },
      {
        label: "Banner Jornaleiro",
        href: "/admin/cms/vendor-banner",
        icon: "newspaper",
        description: "Comunicacao institucional e comercial voltada ao jornaleiro.",
      },
      {
        label: "Landing Jornaleiro",
        href: "/admin/cms/jornaleiro-landing",
        icon: "megaphone",
        description: "Narrativa de aquisicao, oferta e objecoes da jornada publica do jornaleiro.",
      },
      {
        label: "Banner Indicacao",
        href: "/admin/cms/referral-banner",
        icon: "gift",
        description: "Aquisicao por indicacao e narrativas de crescimento de base.",
      },
      {
        label: "Footer",
        href: "/admin/cms/footer",
        icon: "footer",
        description: "Governanca dos links institucionais e da base de navegacao do site.",
      },
    ],
  },
  {
    section: "Dados e Governanca",
    description: "Telemetria, trilha de auditoria e base institucional de conhecimento da operacao.",
    items: [
      {
        label: "Analytics de Comportamento",
        href: "/admin/analytics",
        icon: "chart",
        description: "Eventos do frontend e comportamento de navegacao do usuario final.",
      },
      {
        label: "Auditoria",
        href: "/admin/audit",
        icon: "clipboard",
        description: "Camada de rastreabilidade administrativa e controles operacionais.",
      },
      {
        label: "Academy",
        href: "/admin/academy",
        icon: "school",
        description: "Repositorio interno de conteudo e capacitacao da operacao.",
      },
    ],
  },
  {
    section: "Integracoes e Plataforma",
    description: "Configuracoes estruturais, cobranca, APIs, WhatsApp e integracoes externas da stack.",
    items: [
      {
        label: "Cobranca e Asaas",
        href: "/admin/configuracoes",
        icon: "creditCard",
        description: "Parametros de faturamento, trial, carencia e regras da monetizacao.",
      },
      {
        label: "Chaves API",
        href: "/admin/configuracoes/chaves-api",
        icon: "settings",
        description: "Governanca das chaves de IA e integracoes server-side.",
      },
      {
        label: "WhatsApp",
        href: "/admin/configuracoes/whatsapp",
        icon: "brandWhatsapp",
        description: "Canal transacional e operacional de notificacoes da plataforma.",
      },
      {
        label: "Sync Mercos",
        href: "/admin/configuracoes/sync-mercos",
        icon: "truck",
        description: "Monitoramento da ingestao de catalogo dos distribuidores.",
      },
      {
        label: "Homologacao Mercos",
        href: "/admin/configuracoes/homologacao-mercos",
        icon: "clipboard",
        description: "Ambiente de validacao da integracao antes de impacto na operacao.",
      },
      {
        label: "Plataforma",
        href: "/admin/settings",
        icon: "settings",
        description: "Configuracoes globais e parametros estruturais do sistema.",
      },
    ],
  },
];
