'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { fetchAdminWithDevFallback } from '@/lib/admin-client-fetch';

type DistribuidorDetail = {
  id: string;
  nome: string;
  application_token: string;
  company_token: string;
  base_url: string | null;
  ativo: boolean;
  ultima_sincronizacao: string | null;
  total_produtos: number;
  total_categorias: number;
  bancas_com_acesso: number;
  produtos_sincronizados_24h: number;
  created_at: string | null;
  updated_at: string | null;
  categorias_recentes: Array<{
    id: string;
    nome: string | null;
    updated_at: string | null;
  }>;
  produtos_recentes: Array<{
    id: string;
    name: string | null;
    price: number | null;
    active: boolean | null;
    sincronizado_em: string | null;
    mercos_id: number | null;
    codigo_mercos?: string | null;
    created_at: string | null;
  }>;
  bancas_relevantes: Array<{
    id: string;
    name: string | null;
    plan_type: string | null;
    is_legacy_cotista_linked: boolean;
  }>;
};

type DistribuidorStatus = {
  distribuidor: {
    id: string;
    nome: string;
    ativo: boolean;
    ultima_sincronizacao: string | null;
    tempo_ultima_sincronizacao: string | null;
  };
  estatisticas: {
    total_produtos: number;
    produtos_recentes_24h: number;
  };
  status: {
    codigo: 'ok' | 'warning' | 'error' | string;
    mensagem: string;
  };
};

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

function StatusPill({ code, label }: { code: string; label: string }) {
  const tone =
    code === 'ok'
      ? 'bg-green-100 text-green-700'
      : code === 'warning'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{label}</span>;
}

export default function AdminDistribuidorDetailPage() {
  const params = useParams();
  const distribuidorId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<DistribuidorDetail | null>(null);
  const [health, setHealth] = useState<DistribuidorStatus | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    application_token: '',
    company_token: '',
    base_url: 'https://app.mercos.com/api/v1',
    ativo: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [detailResponse, statusResponse] = await Promise.all([
        fetchAdminWithDevFallback(`/api/admin/distribuidores/${distribuidorId}`),
        fetchAdminWithDevFallback(`/api/admin/distribuidores/${distribuidorId}/status`),
      ]);

      const [detailJson, statusJson] = await Promise.all([
        detailResponse.json(),
        statusResponse.json(),
      ]);

      if (detailJson.success) {
        setData(detailJson.data);
        setFormData({
          nome: detailJson.data.nome || '',
          application_token: detailJson.data.application_token || '',
          company_token: detailJson.data.company_token || '',
          base_url: detailJson.data.base_url || 'https://app.mercos.com/api/v1',
          ativo: detailJson.data.ativo !== false,
        });
      } else {
        setData(null);
      }

      if (statusJson.success) {
        setHealth(statusJson.data);
      } else {
        setHealth(null);
      }
    } catch (error) {
      console.error('Erro ao carregar distribuidor:', error);
      setData(null);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distribuidorId) {
      load();
    }
  }, [distribuidorId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${distribuidorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();

      if (!json.success) {
        alert(`Erro ao atualizar distribuidor: ${json.error || 'falha desconhecida'}`);
        return;
      }

      await load();
      alert('Distribuidor atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar distribuidor:', error);
      alert('Erro ao atualizar distribuidor.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando distribuidor...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Distribuidor não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href="/admin/distribuidores" className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para distribuidores
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{data.nome}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill code={health?.status.codigo || (data.ativo ? 'ok' : 'error')} label={health?.status.mensagem || (data.ativo ? 'Operação habilitada' : 'Distribuidor inativo')} />
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${data.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {data.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Hub operacional do supply, conectando integração Mercos, catálogo sincronizado, bancas cobertas e governança da operação.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/distribuidores/${data.id}/sync` as Route}
            className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65300]"
          >
            Abrir sincronização
          </Link>
          <Link
            href={`/admin/distribuidores/${data.id}/produtos` as Route}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            Produtos
          </Link>
          <Link
            href={`/admin/distribuidores/${data.id}/categorias` as Route}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            Categorias
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Produtos ativos" value={data.total_produtos} helper="Itens já materializados no catálogo" />
        <SummaryCard title="Categorias" value={data.total_categorias} helper="Estrutura comercial importada da Mercos" />
        <SummaryCard title="Rede alcançada" value={data.bancas_com_acesso} helper="Bancas com acesso ao catálogo parceiro" />
        <SummaryCard title="Sync 24h" value={data.produtos_sincronizados_24h} helper="Produtos atualizados no último dia" />
        <SummaryCard title="Último sync" value={health?.distribuidor.tempo_ultima_sincronizacao || '—'} helper={formatDateTime(data.ultima_sincronizacao)} />
        <SummaryCard title="Cadastro" value={formatDate(data.created_at)} helper={`Atualizado em ${formatDate(data.updated_at)}`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Leitura operacional</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Base URL:</span> {data.base_url || '—'}</div>
            <div><span className="font-medium text-gray-900">Status da integração:</span> {health?.status.mensagem || 'Sem diagnóstico'}</div>
            <div><span className="font-medium text-gray-900">Produtos recentes:</span> {health?.estatisticas.produtos_recentes_24h ?? data.produtos_sincronizados_24h}</div>
            <div><span className="font-medium text-gray-900">Produtos ativos:</span> {health?.estatisticas.total_produtos ?? data.total_produtos}</div>
            <div><span className="font-medium text-gray-900">Application token:</span> {data.application_token ? 'Configurado' : 'Ausente'}</div>
            <div><span className="font-medium text-gray-900">Company token:</span> {data.company_token ? 'Configurado' : 'Ausente'}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Rede de bancas impactadas</h2>
          <div className="mt-4 space-y-3">
            {data.bancas_relevantes.length > 0 ? (
              data.bancas_relevantes.map((banca) => (
                <div key={banca.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">{banca.name || 'Banca sem nome'}</div>
                      <div className="text-xs text-gray-500">
                        {banca.plan_type || 'Sem plano'} · {banca.is_legacy_cotista_linked ? 'Legado cotista' : 'Fluxo atual'}
                      </div>
                    </div>
                    <Link href={`/admin/bancas/${banca.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                      Abrir banca
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhuma banca relevante encontrada para esta operação no momento.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Produtos recentes</h2>
            <Link href={`/admin/distribuidores/${data.id}/produtos` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
              Ver catálogo
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.produtos_recentes.length > 0 ? (
              data.produtos_recentes.map((product) => (
                <div key={product.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">{product.name || 'Produto sem nome'}</div>
                      <div className="text-xs text-gray-500">
                        {product.codigo_mercos || product.mercos_id || 'Sem código'} · {formatDate(product.created_at)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(product.price)}</div>
                      <div className="text-xs text-gray-500">
                        {product.active === false ? 'Inativo' : 'Ativo'} · Sync {formatDateTime(product.sincronizado_em)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhum produto sincronizado recentemente.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Categorias recentes</h2>
            <Link href={`/admin/distribuidores/${data.id}/categorias` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
              Ver estrutura
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.categorias_recentes.length > 0 ? (
              data.categorias_recentes.map((category) => (
                <div key={category.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="font-medium text-gray-900">{category.nome || 'Categoria sem nome'}</div>
                  <div className="text-xs text-gray-500">Atualizada em {formatDateTime(category.updated_at)}</div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhuma categoria Mercos registrada para este distribuidor.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Configuração da integração</h2>
        <p className="mt-2 text-sm text-gray-600">
          Governança da conexão Mercos e dos tokens usados por este parceiro de supply.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 xl:grid-cols-2">
            <div>
              <label htmlFor="nome" className="mb-2 block text-sm font-medium text-gray-700">
                Nome do distribuidor
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(event) => setFormData((current) => ({ ...current, nome: event.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label htmlFor="base_url" className="mb-2 block text-sm font-medium text-gray-700">
                Ambiente da API
              </label>
              <select
                id="base_url"
                value={formData.base_url}
                onChange={(event) => setFormData((current) => ({ ...current, base_url: event.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              >
                <option value="https://app.mercos.com/api/v1">Produção</option>
                <option value="https://sandbox.mercos.com/api/v1">Sandbox</option>
              </select>
            </div>

            <div>
              <label htmlFor="application_token" className="mb-2 block text-sm font-medium text-gray-700">
                Application token
              </label>
              <input
                id="application_token"
                type="text"
                required
                value={formData.application_token}
                onChange={(event) => setFormData((current) => ({ ...current, application_token: event.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm"
              />
            </div>

            <div>
              <label htmlFor="company_token" className="mb-2 block text-sm font-medium text-gray-700">
                Company token
              </label>
              <input
                id="company_token"
                type="text"
                required
                value={formData.company_token}
                onChange={(event) => setFormData((current) => ({ ...current, company_token: event.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={(event) => setFormData((current) => ({ ...current, ativo: event.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            Distribuidor ativo para sincronização automática e exposição operacional
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#ff5c00] px-5 py-3 text-sm font-medium text-white hover:bg-[#e65300] disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar integração'}
            </button>
            <Link
              href={`/admin/distribuidores/${data.id}/sync` as Route}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ir para sincronização
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
