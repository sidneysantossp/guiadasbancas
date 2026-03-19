export type DistribuidorIconKey =
  | "dashboard"
  | "box"
  | "tags"
  | "image"
  | "orders"
  | "truck"
  | "percentage"
  | "plug"
  | "settings";

export type DistribuidorMenuItem = {
  label: string;
  href: string;
  icon: DistribuidorIconKey;
  description: string;
};

export type DistribuidorMenuSection = {
  section: string;
  description: string;
  items: DistribuidorMenuItem[];
};

export const DISTRIBUIDOR_MENU: DistribuidorMenuSection[] = [
  {
    section: "Visao Executiva",
    description:
      "Leitura consolidada da operacao do distribuidor, seus pedidos, parceiros e ritmo comercial.",
    items: [
      {
        label: "Dashboard",
        href: "/distribuidor/dashboard",
        icon: "dashboard",
        description: "Centro de comando com visao do abastecimento, pedidos e saude da operacao.",
      },
    ],
  },
  {
    section: "Oferta e Catalogo",
    description:
      "Gestao do sortimento, taxonomia e qualidade visual do catalogo disponibilizado para a rede.",
    items: [
      {
        label: "Produtos",
        href: "/distribuidor/produtos",
        icon: "box",
        description: "Catalogo comercial com edicao, cadastro e governanca dos itens ofertados.",
      },
      {
        label: "Categorias",
        href: "/distribuidor/categorias",
        icon: "tags",
        description: "Organizacao da taxonomia para melhorar descoberta e distribuicao por contexto.",
      },
      {
        label: "Importar Fotos",
        href: "/distribuidor/upload-imagens",
        icon: "image",
        description: "Saneamento visual do catalogo para elevar conversao e qualidade da vitrine.",
      },
    ],
  },
  {
    section: "Rede e Pedidos",
    description:
      "Tudo que conecta o distribuidor as bancas parceiras, ao fluxo comercial e ao atendimento.",
    items: [
      {
        label: "Pedidos",
        href: "/distribuidor/pedidos",
        icon: "orders",
        description: "Acompanhamento das compras recebidas da rede de bancas e seus status.",
      },
      {
        label: "Bancas Parceiras",
        href: "/distribuidor/bancas",
        icon: "truck",
        description: "Base de bancas atendidas, cobertura comercial e relacao ativa da carteira.",
      },
    ],
  },
  {
    section: "Precificacao e Integracoes",
    description:
      "Camada operacional de margens, integrações externas e configuracoes da conta distribuidora.",
    items: [
      {
        label: "Markup / Precos",
        href: "/distribuidor/configuracoes/markup",
        icon: "percentage",
        description: "Regras de margem e formacao comercial dos precos exibidos para a rede.",
      },
      {
        label: "Integracao Mercos",
        href: "/distribuidor/configuracoes/integracao",
        icon: "plug",
        description: "Governanca da conexao com Mercos e sincronizacao do catalogo externo.",
      },
      {
        label: "Minha Conta",
        href: "/distribuidor/configuracoes",
        icon: "settings",
        description: "Dados da conta distribuidora, contato, preferências e parametros operacionais.",
      },
    ],
  },
];
