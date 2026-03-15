"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type RelationshipRow = {
  id: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string;
  telefone_2?: string;
  endereco_principal?: string;
  cidade?: string;
  estado?: string;
  ativo: boolean;
};

type RelationshipForm = {
  id?: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string | null;
  telefone_2?: string | null;
  endereco_principal?: string | null;
  cidade?: string | null;
  estado?: string | null;
  ativo: boolean;
};

function formatDocument(value: string) {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return value;
}

function cleanDocument(value: string) {
  return value.replace(/\D/g, "");
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

export default function AdminCotistasPage() {
  const [rows, setRows] = useState<RelationshipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RelationshipForm | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRows = async (options?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
    const nextPage = options?.page ?? currentPage;
    const nextPageSize = options?.pageSize ?? itemsPerPage;
    const nextSearch = options?.search ?? search;
    const nextStatus = options?.status ?? statusFilter;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(nextPageSize),
      });
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextStatus) params.set("status", nextStatus);

      const response = await fetchAdminWithDevFallback(`/api/admin/cotistas?${params.toString()}`);
      const json = await response.json();

      if (json.success) {
        setRows(Array.isArray(json.data) ? json.data : []);
        setTotal(Number(json.total || 0));
        setStats({
          active: Number(json.stats?.active || 0),
          inactive: Number(json.stats?.inactive || 0),
        });
        setCurrentPage(nextPage);
        setItemsPerPage(nextPageSize);
      } else {
        setRows([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Erro ao carregar relacionamentos comerciais:", error);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows({ page: 1, pageSize: itemsPerPage });
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadRows({ page: 1, pageSize: itemsPerPage, search, status: statusFilter });
    }, 250);

    return () => clearTimeout(debounce);
  }, [search, statusFilter]);

  const openCreate = () => {
    setForm({
      codigo: "",
      razao_social: "",
      cnpj_cpf: "",
      telefone: null,
      telefone_2: null,
      endereco_principal: null,
      cidade: null,
      estado: null,
      ativo: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (row: RelationshipRow) => {
    setForm({
      id: row.id,
      codigo: row.codigo || "",
      razao_social: row.razao_social || "",
      cnpj_cpf: row.cnpj_cpf || "",
      telefone: row.telefone || null,
      telefone_2: row.telefone_2 || null,
      endereco_principal: row.endereco_principal || null,
      cidade: row.cidade || null,
      estado: row.estado || null,
      ativo: row.ativo,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const validateForm = (nextForm: RelationshipForm) => {
    if (!nextForm.codigo.trim()) return "Código é obrigatório";
    if (!nextForm.razao_social.trim()) return "Razão social é obrigatória";
    const cleaned = cleanDocument(nextForm.cnpj_cpf || "");
    if (!(cleaned.length === 11 || cleaned.length === 14)) {
      return "CNPJ/CPF deve ter 11 ou 14 dígitos";
    }
    return null;
  };

  const submitForm = async () => {
    if (!form) return;

    const error = validateForm(form);
    if (error) {
      setFormError(error);
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        ...form,
        cnpj_cpf: cleanDocument(form.cnpj_cpf),
      };
      const isEdit = Boolean(form.id);
      const url = isEdit ? `/api/admin/cotistas/${form.id}` : "/api/admin/cotistas";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetchAdminWithDevFallback(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao salvar relacionamento comercial");
      }

      setModalOpen(false);
      setForm(null);
      await loadRows({ page: currentPage, pageSize: itemsPerPage, search, status: statusFilter });
    } catch (err: any) {
      setFormError(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const toggleAtivo = async (row: RelationshipRow) => {
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/cotistas/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !row.ativo }),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao atualizar status");
      }

      await loadRows({ page: currentPage, pageSize: itemsPerPage, search, status: statusFilter });
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const columns: Column<RelationshipRow>[] = [
    {
      key: "codigo",
      header: "Código",
      render: (row) => <span className="font-medium text-gray-900">{row.codigo}</span>,
    },
    {
      key: "razao_social",
      header: "Relacionamento",
      render: (row) => (
        <div>
          <Link href={`/admin/cotistas/${row.id}` as Route} className="font-medium text-gray-900 hover:text-[#ff5c00]">
            {row.razao_social}
          </Link>
          <div className="text-xs text-gray-500">{formatDocument(row.cnpj_cpf)}</div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Localização",
      hiddenOnMobile: true,
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.cidade && row.estado ? `${row.cidade}/${row.estado}` : row.cidade || row.estado || "—"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Contato",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-700">{row.telefone || row.telefone_2 || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            row.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.ativo ? "Ativo" : "Inativo"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Relacionamentos comerciais</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Gestão da rede comercial legada de cotistas e vínculos históricos que ainda impactam bancas, cobertura e oferta do marketplace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/cotistas/import"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            Importar CSV / Excel
          </Link>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
          >
            Novo relacionamento
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SummaryCard title="Total" value={total} helper="Relacionamentos comerciais cadastrados" />
        <SummaryCard title="Ativos" value={stats.active} helper="Redes aptas a operar hoje" />
        <SummaryCard title="Inativos" value={stats.inactive} helper="Vínculos fora de operação" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_220px_180px]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por razão social, código ou documento"
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
          <select
            value={itemsPerPage}
            onChange={(event) => loadRows({ page: 1, pageSize: Number(event.target.value), search, status: statusFilter })}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
            <option value={200}>200 por página</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando relacionamentos...</div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            getId={(row) => row.id}
            serverMode
            serverPage={currentPage}
            serverPageSize={itemsPerPage}
            serverTotal={total}
            onServerPageChange={(nextPage) => loadRows({ page: nextPage, pageSize: itemsPerPage, search, status: statusFilter })}
            onServerPageSizeChange={(nextPageSize) => loadRows({ page: 1, pageSize: nextPageSize, search, status: statusFilter })}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/cotistas/${row.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Detalhes
                </Link>
                <button type="button" onClick={() => openEdit(row)} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Editar
                </button>
                <button type="button" onClick={() => toggleAtivo(row)} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  {row.ativo ? "Desativar" : "Ativar"}
                </button>
              </div>
            )}
          />
        )}
      </div>

      {modalOpen && form ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">{form.id ? "Editar relacionamento" : "Novo relacionamento"}</h2>
              <button type="button" onClick={() => { setModalOpen(false); setForm(null); }} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4 p-5">
              {formError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Código</label>
                  <input
                    value={form.codigo}
                    onChange={(event) => setForm({ ...form, codigo: event.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-700">Razão social</label>
                  <input
                    value={form.razao_social}
                    onChange={(event) => setForm({ ...form, razao_social: event.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">CNPJ / CPF</label>
                  <input
                    value={form.cnpj_cpf}
                    onChange={(event) => setForm({ ...form, cnpj_cpf: event.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Telefone</label>
                  <input
                    value={form.telefone || ""}
                    onChange={(event) => setForm({ ...form, telefone: event.target.value || null })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Telefone 2</label>
                  <input
                    value={form.telefone_2 || ""}
                    onChange={(event) => setForm({ ...form, telefone_2: event.target.value || null })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Endereço principal</label>
                <input
                  value={form.endereco_principal || ""}
                  onChange={(event) => setForm({ ...form, endereco_principal: event.target.value || null })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Cidade</label>
                  <input
                    value={form.cidade || ""}
                    onChange={(event) => setForm({ ...form, cidade: event.target.value || null })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Estado</label>
                  <input
                    value={form.estado || ""}
                    onChange={(event) => setForm({ ...form, estado: event.target.value || null })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 self-end rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.ativo}
                    onChange={(event) => setForm({ ...form, ativo: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Ativo
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => { setModalOpen(false); setForm(null); }}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submitForm}
                disabled={saving}
                className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e05400] disabled:opacity-60"
              >
                {saving ? "Salvando..." : form.id ? "Salvar alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
