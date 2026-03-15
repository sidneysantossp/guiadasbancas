"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type CategoryRecord = {
  id: string;
  name: string;
  image: string;
  link: string;
  active: boolean;
  visible?: boolean;
  order: number;
  jornaleiro_status?: "all" | "specific" | "inactive";
  jornaleiro_bancas?: string[];
  mercos_id?: number | null;
  parent_category_id?: string | null;
  ultima_sincronizacao?: string | null;
};

type BancaOption = {
  id: string;
  name: string;
};

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-lg font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminCategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bancas, setBancas] = useState<BancaOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryRecord[]>([]);
  const [form, setForm] = useState<CategoryRecord>({
    id: "",
    name: "",
    image: "",
    link: "",
    active: true,
    visible: true,
    order: 0,
    jornaleiro_status: "all",
    jornaleiro_bancas: [],
    mercos_id: null,
    parent_category_id: null,
    ultima_sincronizacao: null,
  });

  const parentOptions = useMemo(
    () => categoryOptions.filter((item) => item.id !== categoryId),
    [categoryId, categoryOptions]
  );

  useEffect(() => {
    void loadDetail();
  }, [categoryId]);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const [categoryResponse, bancasResponse, allCategoriesResponse] = await Promise.all([
        fetchAdminWithDevFallback(`/api/admin/categories/${categoryId}`),
        fetchAdminWithDevFallback("/api/admin/bancas?all=true"),
        fetchAdminWithDevFallback("/api/admin/categories?all=true"),
      ]);

      const [categoryJson, bancasJson, allCategoriesJson] = await Promise.all([
        categoryResponse.json(),
        bancasResponse.json(),
        allCategoriesResponse.json(),
      ]);

      if (!categoryResponse.ok || !categoryJson?.success) {
        throw new Error(categoryJson?.error || "Categoria nao encontrada");
      }

      setForm({
        ...categoryJson.data,
        visible: categoryJson.data.visible ?? true,
        jornaleiro_status: categoryJson.data.jornaleiro_status ?? "all",
        jornaleiro_bancas: Array.isArray(categoryJson.data.jornaleiro_bancas)
          ? categoryJson.data.jornaleiro_bancas
          : [],
      });

      if (bancasJson?.success && Array.isArray(bancasJson.data)) {
        setBancas(
          bancasJson.data.map((item: any) => ({
            id: String(item.id),
            name: item.name || "Sem nome",
          }))
        );
      }

      if (allCategoriesJson?.success && Array.isArray(allCategoriesJson.data)) {
        setCategoryOptions(allCategoriesJson.data);
      }
    } catch (error: any) {
      console.error("Erro ao carregar detalhe da categoria:", error);
      toast.error(error?.message || "Erro ao carregar categoria");
      router.push("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nome da categoria é obrigatorio");
      return;
    }

    try {
      setSaving(true);
      const response = await fetchAdminWithDevFallback(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          image: form.image,
          link: form.link.trim(),
          active: form.active,
          visible: form.visible,
          order: form.order,
          parent_category_id: form.parent_category_id,
          jornaleiroStatus: form.jornaleiro_status,
          jornaleiroBancas: form.jornaleiro_status === "specific" ? form.jornaleiro_bancas : [],
        }),
      });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Erro ao atualizar categoria");
      }

      setForm((prev) => ({
        ...prev,
        ...result.data,
        visible: result.data.visible ?? true,
        jornaleiro_status: result.data.jornaleiro_status ?? "all",
        jornaleiro_bancas: Array.isArray(result.data.jornaleiro_bancas) ? result.data.jornaleiro_bancas : [],
      }));

      toast.success("Categoria atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error(error?.message || "Erro ao atualizar categoria");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta categoria? Esta ação nao pode ser desfeita."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      const response = await fetchAdminWithDevFallback(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Erro ao excluir categoria");
      }

      toast.success("Categoria excluida com sucesso!");
      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Erro ao excluir categoria:", error);
      toast.error(error?.message || "Erro ao excluir categoria");
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = (_files: File[], previews: string[]) => {
    if (previews.length > 0) {
      setForm((prev) => ({ ...prev, image: previews[0] }));
    }
  };

  const selectedBancas = Array.isArray(form.jornaleiro_bancas) ? form.jornaleiro_bancas : [];
  const syncLabel = form.ultima_sincronizacao
    ? new Date(form.ultima_sincronizacao).toLocaleString("pt-BR")
    : "Sem sincronizacao recente";

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
          <p className="mt-2 text-sm text-gray-600">Carregando categoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href={"/admin/categories" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para categorias
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-gray-950">{form.name}</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Controle a governanca completa da categoria: frontend, jornaleiros, hierarquia e
            amarracao com sincronizacao Mercos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
          <Link
            href={"/admin/categories/create" as Route}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Nova categoria
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Frontend"
          value={form.visible ? "Visivel" : "Oculta"}
          helper="Controla a aparicao na navegacao publica."
        />
        <SummaryCard
          title="Jornaleiros"
          value={
            form.jornaleiro_status === "specific"
              ? `${selectedBancas.length} banca(s)`
              : form.jornaleiro_status === "inactive"
              ? "Bloqueada"
              : "Todos"
          }
          helper="Disponibilidade operacional para bancas."
        />
        <SummaryCard
          title="Mercos"
          value={typeof form.mercos_id === "number" ? `#${form.mercos_id}` : "Manual"}
          helper="Origem ou vinculacao da taxonomia."
        />
        <SummaryCard title="Ultima Sync" value={syncLabel} helper="Leitura mais recente da integracao." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Identidade da categoria</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Nome *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex: Revistas, Papelaria, Tabacaria..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Imagem</label>
                <ImageUploader
                  multiple={false}
                  max={1}
                  value={form.image ? [form.image] : []}
                  onChange={handleImageUpload}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Link publico</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="/categorias/revistas"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Governanca operacional</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Ordem</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, order: parseInt(event.target.value, 10) || 0 }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Categoria pai</label>
                <select
                  value={form.parent_category_id || ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      parent_category_id: event.target.value || null,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Sem categoria pai</option>
                  {parentOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Categoria ativa</div>
                  <div className="text-xs text-gray-500">
                    Disponivel para uso na plataforma e em operacoes internas.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  checked={Boolean(form.visible)}
                  onChange={(event) => setForm((prev) => ({ ...prev, visible: event.target.checked }))}
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Visivel no frontend</div>
                  <div className="text-xs text-gray-500">
                    Controla a exposicao na navegacao e em blocos publicos do site.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Disponibilidade para jornaleiros</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Politica de acesso</label>
                <select
                  value={form.jornaleiro_status || "all"}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      jornaleiro_status: event.target.value as "all" | "specific" | "inactive",
                      jornaleiro_bancas:
                        event.target.value === "specific" ? prev.jornaleiro_bancas : [],
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="all">Ativa para todos os jornaleiros</option>
                  <option value="specific">Ativa apenas para bancas especificas</option>
                  <option value="inactive">Inativa para jornaleiros</option>
                </select>
              </div>

              {form.jornaleiro_status === "specific" && (
                <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 text-sm font-medium text-gray-800">Bancas autorizadas</div>
                  <div className="space-y-2">
                    {bancas.map((banca) => (
                      <label key={banca.id} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedBancas.includes(banca.id)}
                          onChange={(event) =>
                            setForm((prev) => {
                              const current = Array.isArray(prev.jornaleiro_bancas)
                                ? prev.jornaleiro_bancas
                                : [];
                              return {
                                ...prev,
                                jornaleiro_bancas: event.target.checked
                                  ? Array.from(new Set([...current, banca.id]))
                                  : current.filter((value) => value !== banca.id),
                              };
                            })
                          }
                        />
                        <span>{banca.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href={"/admin/categories" as Route}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar alteracoes"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Contexto</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">ID interno</dt>
                <dd className="font-medium text-gray-900">{form.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Mercos ID</dt>
                <dd className="font-medium text-gray-900">
                  {typeof form.mercos_id === "number" ? form.mercos_id : "Nao vinculado"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Sync Mercos</dt>
                <dd className="font-medium text-gray-900">{syncLabel}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Categoria pai</dt>
                <dd className="font-medium text-gray-900">
                  {parentOptions.find((item) => item.id === form.parent_category_id)?.name || "Sem categoria pai"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Boas praticas</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Mantenha a mesma categoria visivel apenas quando ela fizer sentido no frontend publico.</li>
              <li>Use acesso especifico quando a categoria fizer parte de uma operacao de banca ou supply restrita.</li>
              <li>Evite mudar Mercos ID manualmente; a sincronizacao e a fonte oficial dessa vinculacao.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
