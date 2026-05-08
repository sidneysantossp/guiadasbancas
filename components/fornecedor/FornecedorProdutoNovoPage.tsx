"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck, IconLoader2, IconPhoto, IconPlugConnected } from "@tabler/icons-react";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type CategoryOption = {
  id: string;
  name: string;
  product_count?: number;
  source?: string;
};

function resolveAvailability(form: { pronta_entrega: boolean; sob_encomenda: boolean; pre_venda: boolean }) {
  if (form.sob_encomenda) return "on_demand";
  if (form.pre_venda) return "quote";
  return "in_stock";
}

function formatDeliveryLeadTime(daysInput: string) {
  const days = Math.floor(Number(String(daysInput || "").replace(",", ".")));
  if (!Number.isFinite(days) || days <= 0) return "";
  return days === 1 ? "1 dia" : `${days} dias`;
}

export default function FornecedorProdutoNovoPage() {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock_qty: "0",
    codigo_mercos: "",
    images: "",
    active: true,
    visible: true,
    visible_jornaleiro: true,
    visible_banca: false,
    track_stock: true,
    pronta_entrega: true,
    sob_encomenda: false,
    pre_venda: false,
    delivery_days: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetchAdminWithDevFallback("/api/admin/categories");

        if (!response.ok) {
          throw new Error("Não foi possível carregar as categorias");
        }

        const json = await response.json().catch(() => null);
        if (json?.success) {
          setCategories(json.data || []);
        }
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const imageUrls = form.images
        .split(/[\n,]/)
        .map((image) => image.trim())
        .filter(Boolean);

      const parsedPrice = Number(form.price);

      const response = await fetchAdminWithDevFallback("/api/admin/atacado/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category_id: form.category_id || null,
          sku: form.codigo_mercos || null,
          supplier_reference: form.codigo_mercos || null,
          image_url: imageUrls[0] || null,
          images: imageUrls,
          cost_price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
          price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
          stock_quantity: Number(form.stock_qty),
          active: form.active,
          visible: form.visible,
          visible_jornaleiro: form.visible_jornaleiro,
          visible_banca: form.visible_banca,
          track_stock: form.track_stock,
          availability_status: resolveAvailability(form),
          delivery_lead_time: formatDeliveryLeadTime(form.delivery_days),
          min_order_quantity: 1,
          pack_size: 1,
        }),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok || json?.success === false) {
        throw new Error(json?.error || "Erro ao cadastrar produto");
      }

      toast.success("Produto criado com sucesso");
      router.push("/fornecedor/produtos");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao cadastrar produto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/fornecedor/produtos"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <IconArrowLeft size={16} />
          Voltar
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
          <p className="text-sm text-gray-600">Cadastre um item manualmente no catálogo do fornecedor.</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="flex items-start gap-3">
          <IconPlugConnected size={20} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Quando usar cadastro manual</p>
            <p className="mt-1">
              Use esta tela para itens fora da Mercos ou para cadastrar rapidamente novos produtos. Os produtos
              do fornecedor próprio continuam separados das integrações Mercos.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex.: Revista especial edição março"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Descreva o produto para as bancas parceiras"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    value={form.category_id}
                    onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    disabled={loading}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                        {category.source === "mercos" ? " (Mercos)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Código Mercos / SKU</label>
                  <input
                    value={form.codigo_mercos}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, codigo_mercos: event.target.value.toUpperCase() }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Preço de venda</label>
                  <input
                    required={!form.sob_encomenda}
                    type="number"
                    min={form.sob_encomenda ? "0" : "0.01"}
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="0,00"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {form.sob_encomenda
                      ? "Produtos sob encomenda podem ficar com valor 0 para compra com preço a definir."
                      : "Informe um valor maior que zero para pronta entrega ou consulta."}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock_qty}
                    onChange={(event) => setForm((current) => ({ ...current, stock_qty: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900">
              <IconPhoto size={18} />
              <h2 className="text-lg font-semibold">Imagens</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Se já tiver URLs das imagens, cole aqui. Se preferir, você também pode vincular imagens depois pela tela
              de importação em massa.
            </p>
            <textarea
              value={form.images}
              onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))}
              rows={4}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Uma URL por linha ou separadas por vírgula"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Disponibilidade</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Produto ativo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.track_stock}
                  onChange={(event) => setForm((current) => ({ ...current, track_stock: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Controlar estoque
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.pronta_entrega}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      pronta_entrega: event.target.checked,
                      sob_encomenda: event.target.checked ? false : current.sob_encomenda,
                      pre_venda: event.target.checked ? false : current.pre_venda,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                Pronta entrega
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.sob_encomenda}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sob_encomenda: event.target.checked,
                      pronta_entrega: event.target.checked ? false : current.pronta_entrega,
                      pre_venda: event.target.checked ? false : current.pre_venda,
                      price: event.target.checked && !current.price ? "0" : current.price,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                Sob encomenda
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.pre_venda}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      pre_venda: event.target.checked,
                      pronta_entrega: event.target.checked ? false : current.pronta_entrega,
                      sob_encomenda: event.target.checked ? false : current.sob_encomenda,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                Pré-venda
              </label>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">Prazo médio sob encomenda (dias)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.delivery_days}
                onChange={(event) => setForm((current) => ({ ...current, delivery_days: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex.: 7"
              />
              <p className="mt-1 text-xs text-gray-500">
                Esse prazo aparece para o jornaleiro no detalhe do Marketplace quando o produto estiver sob encomenda.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Publicação</h2>
            <p className="mt-2 text-sm text-gray-600">
              Controle onde este produto aparece depois que a banca estiver liberada na tela de visibilidade.
            </p>

            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(event) => setForm((current) => ({ ...current, visible: event.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <span>
                  <span className="block font-medium text-gray-800">Visível</span>
                  <span className="block text-xs text-gray-500">Controle geral do produto no fornecedor.</span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={form.visible_jornaleiro}
                  onChange={(event) => setForm((current) => ({ ...current, visible_jornaleiro: event.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <span>
                  <span className="block font-medium text-gray-800">Jornaleiro</span>
                  <span className="block text-xs text-gray-500">Aparece no painel do jornaleiro para compra.</span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={form.visible_banca}
                  onChange={(event) => setForm((current) => ({ ...current, visible_banca: event.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <span>
                  <span className="block font-medium text-gray-800">Banca</span>
                  <span className="block text-xs text-gray-500">Aparece no perfil público das bancas liberadas.</span>
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                {saving ? "Salvando..." : "Cadastrar produto"}
              </button>
              <Link
                href="/fornecedor/produtos"
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
