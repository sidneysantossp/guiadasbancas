export type FornecedorIconKey =
  | "dashboard"
  | "box"
  | "orders"
  | "truck"
  | "creditCard"
  | "store"
  | "eye"
  | "settings";

export type FornecedorMenuItem = {
  label: string;
  href: string;
  icon: FornecedorIconKey;
  description: string;
};

export type FornecedorMenuSection = {
  section: string;
  description: string;
  items: FornecedorMenuItem[];
};

export const FORNECEDOR_MENU: FornecedorMenuSection[] = [
  {
    section: "Operacao",
    description: "Leitura diaria da oferta propria, pedidos recebidos, separacao e entrega para jornaleiros.",
    items: [
      {
        label: "Dashboard",
        href: "/fornecedor/dashboard",
        icon: "dashboard",
        description: "Resumo operacional do centro de distribuicao, pedidos e faturamento.",
      },
      {
        label: "Produtos",
        href: "/fornecedor/produtos",
        icon: "box",
        description: "Catalogo proprio sem Mercos, com estoque, prazo, preco e disponibilidade.",
      },
      {
        label: "Pedidos",
        href: "/fornecedor/pedidos",
        icon: "orders",
        description: "Fila comercial dos pedidos feitos pelos jornaleiros no checkout integrado.",
      },
    ],
  },
  {
    section: "Fulfillment",
    description: "Controle do que precisa ser comprado, separado, enviado e entregue.",
    items: [
      {
        label: "Entregas",
        href: "/fornecedor/entregas",
        icon: "truck",
        description: "Pedidos por etapa logistica, rastreio e prazo de atendimento.",
      },
      {
        label: "Financeiro",
        href: "/fornecedor/financeiro",
        icon: "creditCard",
        description: "Receita, pagamentos, pendencias e conciliacao basica dos pedidos.",
      },
    ],
  },
  {
    section: "Rede",
    description: "Governanca de acesso dos jornaleiros ao fornecedor principal da plataforma.",
    items: [
      {
        label: "Jornaleiros",
        href: "/fornecedor/jornaleiros",
        icon: "store",
        description: "Bancas com acesso, bloqueios individuais e situacao de cadastro.",
      },
      {
        label: "Visibilidade",
        href: "/fornecedor/visibilidade",
        icon: "eye",
        description: "Liberacao geral ou por banca para enxergar os produtos do fornecedor.",
      },
      {
        label: "Configuracoes",
        href: "/fornecedor/configuracoes",
        icon: "settings",
        description: "Parametros comerciais do fornecedor proprio e orientacoes operacionais.",
      },
    ],
  },
];
