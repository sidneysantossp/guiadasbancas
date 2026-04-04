"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import { usePremiumRouteGuard } from "@/components/jornaleiro/usePremiumRouteGuard";

type Stats = {
  total_produtos: number;
  produtos_proprios: number;
  produtos_distribuidores: number;
  produtos_parceiros?: number;
  produtos_customizados: number;
  produtos_desabilitados: number;
  produtos_estoque_proprio: number;
  valor_catalogo_original: number;
  valor_catalogo_customizado: number;
  economia_preco_custom: number;
};

export default function PartnerCatalogReportPage() {
  const toast = useToast();
  const { guarding, allowed } = usePremiumRouteGuard({
    entitlementKey: "can_access_distributor_catalog",
    source: "relatorio-rede-parceira",
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (guarding || !allowed) {
        return;
      }

      try {
        setLoading(true);

        const res = await fetch("/api/jornaleiro/relatorios/rede-parceira");
        const json = await res.json();

        if (json.success) {
          setStats(json.stats);
        } else {
          toast.error(json.error || "Erro ao carregar estatísticas");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Erro ao carregar relatório");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [allowed, guarding, toast]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  if (guarding || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">
          {guarding ? "Validando acesso ao relatório parceiro..." : "Carregando relatório..."}
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  if (!stats) {
    return <div className="py-12 text-center text-gray-500">Nenhum dado disponível</div>;
  }

  const partnerProductsCount = stats.produtos_parceiros ?? stats.produtos_distribuidores;
  const percentCustomizados =
    stats.total_produtos > 0 ? (stats.produtos_customizados / stats.total_produtos) * 100 : 0;
  const percentEstoqueProprio =
    partnerProductsCount > 0 ? (stats.produtos_estoque_proprio / partnerProductsCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatorio da Rede Parceira</h1>
          <p className="mt-1 text-sm text-gray-600">
            Estatisticas e insights sobre produtos parceiros, mix e customizacoes
          </p>
        </div>
        <Link
          href="/jornaleiro/catalogo-distribuidor/gerenciar"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Gerenciar Catálogo
        </Link>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-green-600">✓</span>
          <div>
            <h3 className="text-sm font-semibold text-green-900">
              Catalogo parceiro liberado neste plano
            </h3>
            <p className="mt-1 text-xs text-green-700">
              Acesso atual a {partnerProductsCount} produtos da rede parceira
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-600">Total de Produtos</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_produtos}</p>
          <p className="mt-1 text-xs text-gray-500">Na sua banca</p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-blue-700">Produtos Próprios</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{stats.produtos_proprios}</p>
          <p className="mt-1 text-xs text-blue-600">Cadastrados por você</p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <p className="text-sm text-green-700">De Distribuidores</p>
          <p className="mt-2 text-3xl font-bold text-green-900">{partnerProductsCount}</p>
          <p className="mt-1 text-xs text-green-600">Disponiveis no plano</p>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
          <p className="text-sm text-orange-700">Customizados</p>
          <p className="mt-2 text-3xl font-bold text-orange-900">{stats.produtos_customizados}</p>
          <p className="mt-1 text-xs text-orange-600">
            {formatPercent(percentCustomizados)} do catálogo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Gestão de Catálogo</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Produtos Customizados</p>
                  <p className="text-xs text-gray-500">Com preço ou estoque próprio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-600">{stats.produtos_customizados}</p>
                <p className="text-xs text-gray-500">{formatPercent(percentCustomizados)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Estoque Próprio</p>
                  <p className="text-xs text-gray-500">Gerenciamento independente</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{stats.produtos_estoque_proprio}</p>
                <p className="text-xs text-gray-500">{formatPercent(percentEstoqueProprio)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Produtos Desabilitados</p>
                  <p className="text-xs text-gray-500">Ocultos da sua banca</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">{stats.produtos_desabilitados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Análise Financeira</h3>

          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Valor Catálogo Original
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {formatCurrency(stats.valor_catalogo_original)}
              </p>
              <p className="mt-1 text-xs text-blue-600">Preços dos distribuidores</p>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-orange-700">
                Valor com Customizações
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-900">
                {formatCurrency(stats.valor_catalogo_customizado)}
              </p>
              <p className="mt-1 text-xs text-orange-600">Com seus preços personalizados</p>
            </div>

            {stats.economia_preco_custom !== 0 && (
              <div
                className={`rounded-lg border p-4 ${
                  stats.economia_preco_custom > 0
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    stats.economia_preco_custom > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {stats.economia_preco_custom > 0 ? "Margem Adicional" : "Desconto Aplicado"}
                </p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    stats.economia_preco_custom > 0 ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {stats.economia_preco_custom > 0 ? "+" : ""}
                  {formatCurrency(stats.economia_preco_custom)}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    stats.economia_preco_custom > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.economia_preco_custom > 0
                    ? "Potencial de ganho extra"
                    : "Descontos para clientes"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Ações Rápidas</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/jornaleiro/catalogo-distribuidor/gerenciar"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Gerenciar Catálogo</p>
              <p className="text-xs text-gray-500">Customizar produtos</p>
            </div>
          </Link>

          <Link
            href="/jornaleiro/produtos"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Ver Produtos</p>
              <p className="text-xs text-gray-500">Todos os produtos</p>
            </div>
          </Link>

          <Link
            href="/jornaleiro/banca-v2?tab=banca"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <span className="text-2xl">👤</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Minha Conta</p>
              <p className="text-xs text-gray-500">Dados da banca e do plano</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
