"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type AdminCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  active: boolean;
  visible: boolean;
  order: number;
  jornaleiro_status?: "all" | "specific" | "inactive";
  jornaleiro_bancas?: string[];
  mercos_id?: number | null;
  parent_category_id?: string | null;
  ultima_sincronizacao?: string | null;
};

type AdminBancaOption = {
  id: string;
  name: string;
};

type AdminDistribuidorOption = {
  id: string;
  nome: string;
};

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

export default function AdminCategoriesOperations() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bancas, setBancas] = useState<AdminBancaOption[]>([]);
  const [distribuidores, setDistribuidores] = useState<AdminDistribuidorOption[]>([]);
  const [selectedDistribuidorId, setSelectedDistribuidorId] = useState("all");
  const [mercosIdsByDistribuidor, setMercosIdsByDistribuidor] = useState<Record<string, number[]>>({});
  const [loadingDistribuidorFilter, setLoadingDistribuidorFilter] = useState(false);
  const [query, setQuery] = useState("");

  const statusLabels: Record<"all" | "specific" | "inactive", string> = {
    all: "Ativa para jornaleiros",
    specific: "Ativa para jornaleiros especificos",
    inactive: "Inativa para jornaleiros",
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const res = await fetchAdminWithDevFallback(`/api/admin/categories/visibility?_t=${timestamp}`);
      const json = await res.json();
      setItems(Array.isArray(json?.data) ? json.data : []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistribuidores = async () => {
    try {
      const res = await fetchAdminWithDevFallback("/api/admin/distribuidores");
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        setDistribuidores(
          json.data
            .filter((item: any) => item?.id && item?.nome)
            .map((item: any) => ({ id: String(item.id), nome: String(item.nome) }))
        );
      }
    } catch (error) {
      console.error("Erro ao carregar distribuidores:", error);
    }
  };

  const fetchBancas = async () => {
    try {
      const res = await fetchAdminWithDevFallback("/api/admin/bancas?all=true");
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        setBancas(json.data.map((item: any) => ({ id: String(item.id), name: item.name || "Sem nome" })));
      }
    } catch (error) {
      console.error("Erro ao carregar bancas:", error);
    }
  };

  const ensureDistribuidorMercosIds = async (distribuidorId: string) => {
    if (!distribuidorId || distribuidorId === "all" || mercosIdsByDistribuidor[distribuidorId]) return;

    setLoadingDistribuidorFilter(true);
    try {
      const res = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${distribuidorId}/categorias`);
      const json = await res.json();
      const mercosIds = Array.isArray(json?.data)
        ? json.data
            .map((item: any) => item?.mercos_id)
            .filter((value: any) => typeof value === "number")
        : [];

      setMercosIdsByDistribuidor((prev) => ({
        ...prev,
        [distribuidorId]: Array.from(new Set(mercosIds)),
      }));
    } catch (error) {
      console.error("Erro ao carregar categorias do distribuidor:", error);
      setMercosIdsByDistribuidor((prev) => ({
        ...prev,
        [distribuidorId]: [],
      }));
    } finally {
      setLoadingDistribuidorFilter(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchDistribuidores();
    fetchBancas();
  }, []);

  useEffect(() => {
    if (selectedDistribuidorId !== "all") {
      ensureDistribuidorMercosIds(selectedDistribuidorId);
    }
  }, [selectedDistribuidorId]);

  const filteredItems = useMemo(() => {
    const queryNormalized = query.trim().toLowerCase();
    const distributorMercosIds =
      selectedDistribuidorId === "all"
        ? null
        : new Set<number>(mercosIdsByDistribuidor[selectedDistribuidorId] || []);

    return items.filter((item) => {
      if (queryNormalized) {
        const haystack = [item.name, item.link, String(item.mercos_id ?? "")]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(queryNormalized)) return false;
      }

      if (!distributorMercosIds) return true;
      return typeof item.mercos_id === "number" && distributorMercosIds.has(item.mercos_id);
    });
  }, [items, mercosIdsByDistribuidor, query, selectedDistribuidorId]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      visible: items.filter((item) => item.visible).length,
      mercos: items.filter((item) => typeof item.mercos_id === "number").length,
      restritas: items.filter((item) => item.jornaleiro_status === "specific").length,
    };
  }, [items]);

  const globalIndexById = useMemo(() => {
    const indexMap = new Map<string, number>();
    items.forEach((item, index) => indexMap.set(item.id, index));
    return indexMap;
  }, [items]);

  const onCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onEdit = (item: AdminCategory) => {
    setEditing(item);
    setShowForm(true);
  };

  const syncMercos = async () => {
    if (!window.confirm("Sincronizar categorias da Mercos agora?")) return;

    setSyncing(true);
    setMessage(null);
    try {
      const resMercos = await fetchAdminWithDevFallback("/api/admin/categories/sync-mercos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const jsonMercos = await resMercos.json();

      if (!jsonMercos?.success) {
        throw new Error(jsonMercos?.error || jsonMercos?.message || "Erro na sincronizacao com Mercos");
      }

      const resGlobal = await fetchAdminWithDevFallback("/api/admin/categories/sync-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const jsonGlobal = await resGlobal.json();

      if (!jsonGlobal?.success) {
        throw new Error(jsonGlobal?.error || "Erro ao atualizar taxonomia global");
      }

      setMessage({
        type: "success",
        text: `Sincronizacao concluida: ${jsonMercos.distribuidores_sucesso || 0} distribuidor(es) e ${jsonGlobal.categorias_processadas || 0} categoria(s) processada(s).`,
      });
      await fetchAll();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.message || "Erro ao sincronizar categorias",
      });
    } finally {
      setSyncing(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Excluir esta categoria?")) return;

    setSaving(true);
    try {
      const res = await fetchAdminWithDevFallback(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao excluir categoria");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Categoria excluida com sucesso." });
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || "Erro ao excluir categoria" });
    } finally {
      setSaving(false);
    }
  };

  const onToggleActive = async (id: string) => {
    const category = items.find((item) => item.id === id);
    if (!category) return;

    setSaving(true);
    try {
      const res = await fetchAdminWithDevFallback(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !category.active }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao alterar status");
      }
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || "Erro ao alterar status" });
    } finally {
      setSaving(false);
    }
  };

  const onToggleVisible = async (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    setSaving(true);
    try {
      const nextVisible = !item.visible;
      const res = await fetchAdminWithDevFallback("/api/admin/categories/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visible: nextVisible }),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao alterar visibilidade");
      }

      const updatedIds = Array.isArray(json.updated_ids) ? json.updated_ids : [id];
      const updatedSet = new Set(updatedIds);
      setItems((prev) =>
        prev.map((entry) => (updatedSet.has(entry.id) ? { ...entry, visible: nextVisible } : entry))
      );
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || "Erro ao alterar visibilidade" });
    } finally {
      setSaving(false);
    }
  };

  const move = async (id: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex((item) => item.id === id);
    if (currentIndex < 0) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === items.length - 1) return;

    const reordered = [...items];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
    reordered.forEach((item, index) => {
      item.order = index + 1;
    });

    setSaving(true);
    try {
      const res = await fetchAdminWithDevFallback("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bulk", data: reordered }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao reordenar categorias");
      }
      setItems(reordered);
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || "Erro ao reordenar categorias" });
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (
    data: Omit<AdminCategory, "id" | "order"> & {
      id?: string;
      jornaleiroStatus: "all" | "specific" | "inactive";
      jornaleiroBancas: string[];
    }
  ) => {
    setSaving(true);
    try {
      if (data.id) {
        const res = await fetchAdminWithDevFallback(`/api/admin/categories/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            image: data.image,
            link: data.link,
            active: data.active,
            visible: data.visible,
            jornaleiroStatus: data.jornaleiroStatus,
            jornaleiroBancas: data.jornaleiroBancas,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Erro ao atualizar categoria");
        }
        setItems((prev) => prev.map((item) => (item.id === data.id ? { ...item, ...json.data } : item)));
      } else {
        const res = await fetchAdminWithDevFallback("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              name: data.name,
              image: data.image,
              link: data.link,
              active: data.active,
              jornaleiroStatus: data.jornaleiroStatus,
              jornaleiroBancas: data.jornaleiroBancas,
            },
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Erro ao criar categoria");
        }
        setItems((prev) => [...prev, json.data]);
      }

      setShowForm(false);
      setEditing(null);
      setMessage({ type: "success", text: `Categoria ${data.id ? "atualizada" : "criada"} com sucesso.` });
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || "Erro ao salvar categoria" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold text-gray-950">Categorias</h1>
          <p className="mt-2 text-sm text-gray-600">
            Governe a taxonomia do marketplace, a visibilidade no frontend e a disponibilidade
            para jornaleiros sem misturar isso com a camada editorial do CMS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={syncMercos}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
          >
            {syncing ? "Sincronizando..." : "Sincronizar Mercos"}
          </button>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Nova categoria
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Categorias" value={summary.total} helper="Taxonomia total ativa e historica." />
        <SummaryCard title="Visiveis no Site" value={summary.visible} helper="Categorias liberadas para descoberta no frontend." />
        <SummaryCard title="Mapeadas Mercos" value={summary.mercos} helper="Itens sincronizados com distribuidores parceiros." />
        <SummaryCard title="Restritas" value={summary.restritas} helper="Disponiveis apenas para bancas selecionadas." />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Governanca operacional</h2>
            <p className="text-sm text-gray-500">
              Ajuste ordem, visibilidade, status e disponibilidade por contexto.
            </p>
          </div>
          {selectedDistribuidorId !== "all" && (
            <div className="text-xs text-gray-500">
              {loadingDistribuidorFilter
                ? "Carregando categorias do distribuidor..."
                : `${filteredItems.length} categoria(s) vinculada(s) ao distribuidor filtrado.`}
            </div>
          )}
        </div>
      </div>

      <FiltersBar
        onReset={() => {
          setQuery("");
          setSelectedDistribuidorId("all");
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nome, rota ou Mercos ID..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={selectedDistribuidorId}
          onChange={(event) => setSelectedDistribuidorId(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">Todos os distribuidores</option>
          {distribuidores.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>
      </FiltersBar>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Carregando categorias...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Nenhuma categoria encontrada para o filtro atual.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 p-6 xl:flex-row xl:items-start">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image || "/images/placeholder-banner.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-base font-semibold text-gray-900">{item.name}</div>
                        {typeof item.mercos_id === "number" && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            Mercos #{item.mercos_id}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{item.link || "Sem rota publica definida"}</div>
                      {item.ultima_sincronizacao && (
                        <div className="mt-1 text-xs text-gray-400">
                          Ultima sincronizacao:{" "}
                          {new Date(item.ultima_sincronizacao).toLocaleString("pt-BR")}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.active ? "Ativa" : "Inativa"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.visible ? "bg-sky-100 text-sky-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.visible ? "Visivel no frontend" : "Oculta do frontend"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.jornaleiro_status === "inactive"
                              ? "bg-red-100 text-red-700"
                              : item.jornaleiro_status === "specific"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {statusLabels[(item.jornaleiro_status || "all") as "all" | "specific" | "inactive"]}
                        </span>
                        <span className="text-xs text-gray-500">Ordem {item.order}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => move(item.id, "up")}
                        disabled={(globalIndexById.get(item.id) ?? 0) === 0 || saving}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        Subir
                      </button>
                      <button
                        onClick={() => move(item.id, "down")}
                        disabled={(globalIndexById.get(item.id) ?? -1) === items.length - 1 || saving}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        Descer
                      </button>
                      <button
                        onClick={() => onToggleActive(item.id)}
                        disabled={saving}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        {item.active ? "Desativar" : "Ativar"}
                      </button>
                      <button
                        onClick={() => onToggleVisible(item.id)}
                        disabled={saving}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        {item.visible ? "Ocultar" : "Exibir"}
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        Edicao rapida
                      </button>
                      <Link
                        href={`/admin/categories/${item.id}` as Route}
                        className="rounded-md border border-[#ff5c00]/20 bg-[#fff4ec] px-2 py-1 text-xs font-medium text-[#ff5c00] hover:bg-[#ffe8d9]"
                      >
                        Detalhes
                      </Link>
                      <button
                        onClick={() => onDelete(item.id)}
                        disabled={saving}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm
          item={editing}
          saving={saving}
          bancas={bancas}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

function CategoryForm({
  item,
  onSubmit,
  onCancel,
  saving,
  bancas,
}: {
  item: AdminCategory | null;
  onSubmit: (
    data: Omit<AdminCategory, "id" | "order"> & {
      id?: string;
      jornaleiroStatus: "all" | "specific" | "inactive";
      jornaleiroBancas: string[];
    }
  ) => void;
  onCancel: () => void;
  saving: boolean;
  bancas: AdminBancaOption[];
}) {
  const [name, setName] = useState(item?.name || "");
  const [image, setImage] = useState(item?.image || "");
  const [link, setLink] = useState(item?.link || "");
  const [active, setActive] = useState<boolean>(item?.active ?? true);
  const [visible, setVisible] = useState<boolean>(item?.visible ?? true);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jornaleiroStatus, setJornaleiroStatus] = useState<"all" | "specific" | "inactive">(
    item?.jornaleiro_status ?? "all"
  );
  const [selectedBancas, setSelectedBancas] = useState<string[]>(item?.jornaleiro_bancas ?? []);

  useEffect(() => {
    if (jornaleiroStatus !== "specific" && selectedBancas.length > 0) {
      setSelectedBancas([]);
    }
  }, [jornaleiroStatus, selectedBancas.length]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const normalizedLink = link.trim().startsWith("/")
      ? link.trim()
      : `/${link.trim().replace(/^\/+/, "")}`;

    onSubmit({
      id: item?.id,
      name,
      image,
      link: normalizedLink,
      active,
      visible,
      jornaleiroStatus,
      jornaleiroBancas: jornaleiroStatus === "specific" ? selectedBancas : [],
    });
  };

  const onFileDrop = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Falha no upload");
        return;
      }
      setImage(json.url);
    } catch (uploadError) {
      setError("Erro ao enviar arquivo");
    } finally {
      setUploading(false);
      setDragOver(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
        <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
          <form onSubmit={submit} className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item ? "Edicao rapida da categoria" : "Nova categoria"}
                </h3>
                <p className="text-sm text-gray-500">
                  Ajuste nome, rota, imagem e disponibilidade operacional.
                </p>
              </div>
              <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Imagem (URL)</label>
              <input
                type="text"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="/uploads/arquivo.png ou URL completa"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Aceita caminho relativo ou URL completa.
              </p>
            </div>

            <div
              className={`rounded-lg border-2 border-dashed p-4 text-center text-sm ${
                dragOver ? "border-[#ff5c00] bg-[#fff6ef]" : "border-gray-300 bg-gray-50"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                const file = event.dataTransfer.files?.[0];
                if (file) onFileDrop(file);
              }}
            >
              {uploading ? (
                <div className="text-gray-700">Enviando imagem...</div>
              ) : (
                <>
                  <div>Arraste e solte uma imagem aqui, ou selecione um arquivo.</div>
                  <input
                    id="category-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) onFileDrop(file);
                    }}
                  />
                  <label
                    htmlFor="category-image-input"
                    className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50"
                  >
                    Selecionar arquivo
                  </label>
                </>
              )}
            </div>

            {image && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Preview" className="h-24 w-24 rounded-lg object-cover ring-1 ring-black/10" />
              </div>
            )}
            {error && <div className="text-xs text-red-600">{error}</div>}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Link</label>
              <input
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="/categorias/slug"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 text-sm font-medium text-gray-800">Configuracoes de operacao</div>
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-gray-300"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Categoria ativa</div>
                    <div className="text-xs text-gray-500">Disponivel para uso no ecossistema.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-gray-300"
                    checked={visible}
                    onChange={(event) => setVisible(event.target.checked)}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Visivel no frontend</div>
                    <div className="text-xs text-gray-500">Controla a aparicao na pagina publica de categorias.</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Disponibilidade para jornaleiros
              </label>
              <select
                value={jornaleiroStatus}
                onChange={(event) => setJornaleiroStatus(event.target.value as "all" | "specific" | "inactive")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">Ativa para todos os jornaleiros</option>
                <option value="specific">Ativa apenas para bancas especificas</option>
                <option value="inactive">Inativa para jornaleiros</option>
              </select>
            </div>

            {jornaleiroStatus === "specific" && (
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
                {bancas.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhuma banca cadastrada.</p>
                ) : (
                  bancas.map((banca) => (
                    <label key={banca.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedBancas.includes(banca.id)}
                        onChange={(event) => {
                          setSelectedBancas((prev) => {
                            if (event.target.checked) return Array.from(new Set([...prev, banca.id]));
                            return prev.filter((value) => value !== banca.id);
                          });
                        }}
                      />
                      <span>{banca.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
