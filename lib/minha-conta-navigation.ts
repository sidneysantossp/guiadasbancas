import type { Route } from "next";

export type MinhaContaMenuKey =
  | "inteligencia"
  | "perfil"
  | "pedidos"
  | "enderecos"
  | "favoritos"
  | "cupons";

export type MinhaContaMenuItem = {
  key: MinhaContaMenuKey;
  label: string;
  description: string;
  href: Route;
  routeScoped?: boolean;
};

export type MinhaContaMenuSection = {
  title: string;
  description: string;
  items: MinhaContaMenuItem[];
};

export function buildMinhaContaMenuSections(): MinhaContaMenuSection[] {
  return [
    {
      title: "Visao da Conta",
      description: "Panorama da relacao do cliente com a plataforma.",
      items: [
        {
          key: "inteligencia",
          label: "Central de Compras",
          description: "Resumo de pedidos, gasto, preferencias e proximos passos.",
          href: "/minha-conta/inteligencia" as Route,
          routeScoped: true,
        },
        {
          key: "perfil",
          label: "Perfil e Dados",
          description: "Dados pessoais e informacoes principais da conta.",
          href: "/minha-conta/perfil" as Route,
          routeScoped: true,
        },
      ],
    },
    {
      title: "Compras e Beneficios",
      description: "Pedidos, vantagens e produtos de interesse do comprador.",
      items: [
        {
          key: "pedidos",
          label: "Pedidos",
          description: "Acompanhamento de compras em andamento e historico.",
          href: "/minha-conta/pedidos" as Route,
          routeScoped: true,
        },
        {
          key: "favoritos",
          label: "Favoritos",
          description: "Produtos e interesses salvos para decidir depois.",
          href: "/minha-conta/favoritos" as Route,
          routeScoped: true,
        },
        {
          key: "cupons",
          label: "Cupons",
          description: "Beneficios e incentivos disponiveis para compra.",
          href: "/minha-conta/cupons" as Route,
          routeScoped: true,
        },
      ],
    },
    {
      title: "Relacionamento",
      description: "Dados de entrega e base de recorrencia do comprador.",
      items: [
        {
          key: "enderecos",
          label: "Enderecos",
          description: "Enderecos salvos para checkout e entrega.",
          href: "/minha-conta/enderecos" as Route,
          routeScoped: true,
        },
      ],
    },
  ];
}
