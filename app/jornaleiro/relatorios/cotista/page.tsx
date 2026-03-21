"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

type Stats = {
  total_produtos: number;
  produtos_proprios: number;
  produtos_distribuidores: number;
  produtos_customizados: number;
  produtos_desabilitados: number;
  produtos_estoque_proprio: number;
  valor_catalogo_original: number;
  valor_catalogo_customizado: number;
  economia_preco_custom: number;
};

export default function RelatorioRedeParceiraPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [hasCatalogAccess, setHasCatalogAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verificar se o plano libera o catalogo parceiro
        const bancaRes = await fetch('/api/jornaleiro/banca');
        const bancaJson = await bancaRes.json();
        const canAccessCatalog = bancaJson?.data?.entitlements?.can_access_distributor_catalog === true;
        setHasCatalogAccess(canAccessCatalog);

        if (!canAccessCatalog) {
          setLoading(false);
          return;
        }

        // Buscar estatisticas da rede parceira
        const res = await fetch('/api/jornaleiro/relatorios/cotista');
        const json = await res.json();

        if (json.success) {
          setStats(json.stats);
        } else {
          toast.error(json.error || "Erro ao carregar estatísticas");
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error("Erro ao carregar relatório");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Carregando relatório...</div>
      </div>
    );
  }

  if (hasCatalogAccess === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatorio da Rede Parceira</h1>
          <p className="text-sm text-gray-600 mt-1">
            Estatisticas sobre produtos parceiros e performance do catalogo complementar
          </p>
        </div>

        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-center">
          <span className="text-yellow-600 text-4xl">⚠️</span>
          <h3 className="text-lg font-semibold text-yellow-900 mt-4">
            Este painel depende do plano da banca
          </h3>
          <p className="text-sm text-yellow-800 mt-2">
            Para acessar os indicadores do catalogo parceiro, ative um plano com acesso a rede de distribuidores.
          </p>
          <div className="mt-6">
            <Link
              href="/jornaleiro/meu-plano"
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              → Revisar meu plano
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  const percentCustomizados = stats.total_produtos > 0 
    ? (stats.produtos_customizados / stats.total_produtos) * 100 
    : 0;

  const percentEstoqueProprio = stats.produtos_distribuidores > 0
    ? (stats.produtos_estoque_proprio / stats.produtos_distribuidores) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatorio da Rede Parceira</h1>
          <p className="text-sm text-gray-600 mt-1">
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

      {/* Success Badge */}
      <div className="rounded-lg bg-green-50 border border-green-200 p-4">
        <div className="flex items-center gap-3">
          <span className="text-green-600 text-2xl">✓</span>
          <div>
            <h3 className="text-sm font-semibold text-green-900">
              Catalogo parceiro liberado neste plano
            </h3>
            <p className="text-xs text-green-700 mt-1">
              Acesso atual a {stats.produtos_distribuidores} produtos da rede parceira
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-600">Total de Produtos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_produtos}</p>
          <p className="text-xs text-gray-500 mt-1">
            Na sua banca
          </p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-blue-700">Produtos Próprios</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{stats.produtos_proprios}</p>
          <p className="text-xs text-blue-600 mt-1">
            Cadastrados por você
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <p className="text-sm text-green-700">De Distribuidores</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.produtos_distribuidores}</p>
          <p className="text-xs text-green-600 mt-1">
            Disponiveis no plano
          </p>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
          <p className="text-sm text-orange-700">Customizados</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">{stats.produtos_customizados}</p>
          <p className="text-xs text-orange-600 mt-1">
            {formatPercent(percentCustomizados)} do catálogo
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customization Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gestão de Catálogo
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
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

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
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

        {/* Financial Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análise Financeira
          </h3>
          
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">
                Valor Catálogo Original
              </p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formatCurrency(stats.valor_catalogo_original)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Preços dos distribuidores
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
              <p className="text-xs text-orange-700 font-medium uppercase tracking-wide">
                Valor com Customizações
              </p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {formatCurrency(stats.valor_catalogo_customizado)}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Com seus preços personalizados
              </p>
            </div>

            {stats.economia_preco_custom !== 0 && (
              <div className={`rounded-lg border p-4 ${
                stats.economia_preco_custom > 0 
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-xs font-medium uppercase tracking-wide ${
                  stats.economia_preco_custom > 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {stats.economia_preco_custom > 0 ? 'Margem Adicional' : 'Desconto Aplicado'}
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  stats.economia_preco_custom > 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {stats.economia_preco_custom > 0 ? '+' : ''}{formatCurrency(stats.economia_preco_custom)}
                </p>
                <p className={`text-xs mt-1 ${
                  stats.economia_preco_custom > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.economia_preco_custom > 0 
                    ? 'Potencial de ganho extra'
                    : 'Descontos para clientes'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/jornaleiro/catalogo-distribuidor/gerenciar"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Gerenciar Catálogo</p>
              <p className="text-xs text-gray-500">Customizar produtos</p>
            </div>
          </Link>

          <Link
            href="/jornaleiro/produtos"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Ver Produtos</p>
              <p className="text-xs text-gray-500">Todos os produtos</p>
            </div>
          </Link>

          <Link
            href="/jornaleiro/banca-v2?tab=banca"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
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
