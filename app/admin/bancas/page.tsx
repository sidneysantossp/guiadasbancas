"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type BancaRow = {
  id: string;
  name: string;
  user_id: string | null;
  cover: string;
  city: string;
  status: "ativa" | "pausada";
  featured: boolean;
  createdAt: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

export default function AdminBancasPage() {
  const [rows, setRows] = useState<BancaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAdminWithDevFallback("/api/admin/bancas?all=true", {
          cache: "no-store",
        });
        const json = await response.json();

        if (!response.ok || !json?.success) {
          const message =
            json?.error ||
            (response.status === 401 ? "Sessão sem permissão de administrador." : `Erro HTTP ${response.status}`);
          setRows([]);
          setError(message);
          return;
        }

        const items = Array.isArray(json.data) ? json.data : [];

        setRows(
          items.map((banca: any) => ({
            id: banca.id,
            name: banca.name || "Banca sem nome",
            user_id: banca.user_id || null,
            cover: banca.cover || banca.avatar || "",
            city:
              banca.addressObj?.city ||
              banca.address
                ?.split(",")
                .map((item: string) => item.trim())
                .filter(Boolean)
                .slice(-2, -1)[0] ||
              "—",
            status: banca.active !== false ? "ativa" : "pausada",
            featured: banca.featured === true,
            createdAt: banca.createdAt || null,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar bancas:", error);
        setRows([]);
        setError("Erro ao carregar bancas. Verifique a sessão de admin e a API.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cities = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.city).filter((value) => value && value !== "—"))).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !normalized ||
        row.name.toLowerCase().includes(normalized) ||
        row.city.toLowerCase().includes(normalized) ||
        row.id.toLowerCase().includes(normalized);
      const matchesCity = !cityFilter || row.city === cityFilter;
      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesQuery && matchesCity && matchesStatus;
    });
  }, [rows, query, cityFilter, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: rows.length,
      active: rows.filter((row) => row.status === "ativa").length,
      paused: rows.filter((row) => row.status === "pausada").length,
      featured: rows.filter((row) => row.featured).length,
    };
  }, [rows]);

  const columns: Column<BancaRow>[] = [
    {
      key: "name",
      header: "Banca",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-gray-100">
            {row.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.cover} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </div>
          <div>
            <Link href={`/admin/bancas/${row.id}` as Route} className="font-medium text-gray-900 hover:text-[#ff5c00]">
              {row.name}
            </Link>
            <div className="text-xs text-gray-500">{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "Cidade",
      render: (row) => <span className="text-sm text-gray-700">{row.city}</span>,
    },
    {
      key: "status",
      header: "Operação",
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            row.status === "ativa" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.status === "ativa" ? "Ativa" : "Pausada"}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Destaque",
      hiddenOnMobile: true,
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            row.featured ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.featured ? "Em destaque" : "Normal"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Cadastro",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-600">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Bancas</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Núcleo operacional das bancas cadastradas, conectando cadastro, dono, catálogo, assinatura e visibilidade pública.
          </p>
        </div>
        <Link
          href="/admin/cms/bancas/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
        >
          Nova banca no CMS
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total" value={summary.total} helper="Bancas cadastradas na operação" />
        <SummaryCard title="Ativas" value={summary.active} helper="Bancas operando no marketplace" />
        <SummaryCard title="Pausadas" value={summary.paused} helper="Operações temporariamente fora do ar" />
        <SummaryCard title="Destaque" value={summary.featured} helper="Bancas com maior visibilidade no site" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_240px_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, cidade ou ID"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todas as cidades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="ativa">Ativas</option>
            <option value="pausada">Pausadas</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando bancas...</div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            getId={(row) => row.id}
            initialPageSize={20}
            pageSizeOptions={[20, 50, 100]}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/bancas/${row.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Detalhes
                </Link>
                <Link href={`/admin/cms/bancas/${row.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  CMS
                </Link>
                <Link href={`/banca/${row.id}` as Route} target="_blank" className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Pública
                </Link>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
