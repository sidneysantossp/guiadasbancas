'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import DataTable, { type Column } from '@/components/admin/DataTable';
import { fetchAdminWithDevFallback } from '@/lib/admin-client-fetch';

type DistribuidorRow = {
  id: string;
  nome: string;
  ativo: boolean;
  base_url: string | null;
  ultima_sincronizacao: string | null;
  total_produtos: number;
  created_at: string | null;
};

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

export default function DistribuidoresPage() {
  const [rows, setRows] = useState<DistribuidorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadDistribuidores = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetchAdminWithDevFallback('/api/admin/distribuidores');
      const result = await response.json().catch(() => null);

      if (result?.success) {
        setRows(Array.isArray(result.data) ? result.data : []);
      } else if (response.status === 401) {
        setErrorMessage('Sessão administrativa expirada. Faça login novamente.');
        setRows([]);
      } else {
        setErrorMessage(result?.error || 'Erro ao carregar distribuidores.');
        setRows([]);
      }
    } catch (error) {
      console.error('Erro ao carregar distribuidores:', error);
      setErrorMessage('Erro ao carregar distribuidores.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistribuidores();
  }, []);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !normalized ||
        row.nome.toLowerCase().includes(normalized) ||
        (row.base_url || '').toLowerCase().includes(normalized);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'ativo' ? row.ativo : !row.ativo);
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: rows.length,
      ativos: rows.filter((item) => item.ativo).length,
      inativos: rows.filter((item) => !item.ativo).length,
      produtos: rows.reduce((sum, item) => sum + Number(item.total_produtos || 0), 0),
    };
  }, [rows]);

  const columns: Column<DistribuidorRow>[] = [
    {
      key: 'nome',
      header: 'Distribuidor',
      render: (row) => (
        <div>
          <Link href={`/admin/distribuidores/${row.id}` as Route} className="font-medium text-gray-900 hover:text-[#ff5c00]">
            {row.nome}
          </Link>
          <div className="text-xs text-gray-500">{row.base_url || 'Sem base URL configurada'}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {row.ativo ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'produtos',
      header: 'Produtos ativos',
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm font-medium text-gray-900">{row.total_produtos}</span>,
    },
    {
      key: 'ultima_sincronizacao',
      header: 'Última sincronização',
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-600">{formatDateTime(row.ultima_sincronizacao)}</span>,
    },
    {
      key: 'created_at',
      header: 'Cadastro',
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-600">{formatDateTime(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Distribuidores</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Gestão central do supply da plataforma, incluindo integração Mercos, catálogo e cobertura de bancas.
          </p>
        </div>
        <Link
          href="/admin/distribuidores/novo"
          className="inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
        >
          Novo distribuidor
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total" value={summary.total} helper="Distribuidores cadastrados" />
        <SummaryCard title="Ativos" value={summary.ativos} helper="Integrações liberadas para operação" />
        <SummaryCard title="Inativos" value={summary.inativos} helper="Parceiros fora da operação" />
        <SummaryCard title="Produtos ativos" value={summary.produtos} helper="Oferta total vinda do supply" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou URL da integração"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando distribuidores...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            getId={(row) => row.id}
            initialPageSize={20}
            pageSizeOptions={[20, 50, 100]}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/distribuidores/${row.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Detalhes
                </Link>
                <Link href={`/admin/distribuidores/${row.id}/sync` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Sync
                </Link>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
